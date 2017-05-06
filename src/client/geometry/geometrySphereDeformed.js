// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { CubeGeometry } from 'three/src/Three'
import ImprovedNoise from 'improved-noise'

export default class geometrySphereDeformed {
  /**
  * [constructor description]
  * @param  {[type]} state [description]
  * @return {[type]}       [description]
  */
  constructor(state, settings) {
    const self = this

    /**
    * [state description]
    * @param  {object} texture { texture1 : texture}
    * @type {Object}
    */
    this.state = {
      texture : { }
    }

    state ? Object.assign(self.state, state) : null

    /**
    * [settings description]
    * @param {array} size [40, 40, 40, 40, 40, 40]
    * @param {string} fragment
    * @param {string} vertex
    * @type {Object}
    */
    this.settings = {
      size : [40, 40, 40, 40, 40, 40]
    }

    settings ? Object.assign(self.settings, settings) : null

    this.improvedNoise = new ImprovedNoise()
  }

  _geometry(){
    this.geometry = new CubeGeometry(...this.settings.size)
  }

  /**
  * Initialize geometry and deformed
  * @method init
  * @return {[type]} [description]
  */
  init(){
    this.initIsActive = true;
    this._geometry()
    return this
  }

  /**
  * Get a deformed geometry by improvedNoise function
  * @method getDeformedGeometry
  * @param  {[type]}            timer [description]
  * @return {[type]}            [description]
  */
  getDeformedGeometry(timer){
    this.geometry == undefined ? this._geometry() : null
    timer != undefined ? this.timer = timer : null
    this.geometry.verticesNeedUpdate = true;
    this.geometry.normalsNeedUpdate = true;
    this.geometry.uvsNeedUpdate = true;
    this.geometry.computeFaceNormals()
    this.geometry.computeVertexNormals()
    this.geometry.computeMorphNormals()
    for( let j = 0; j < this.geometry.vertices.length; j++ ) {
      let v = this.geometry.vertices[ j ]
      let n = v.clone()
      n.normalize()
      v.copy( n )
      v.multiplyScalar( 30 )
      let f = 0.07
      this.timer != undefined ? f = 0.0+(Math.cos(this.timer)*0.1) : false
      //var d = - 10 * this.turbulence( f * v.x, f * v.y, f * v.z )
      let d = 6 * this.improvedNoise.noise( f * v.x, f * v.y, f * v.z )
      v.add( n.multiplyScalar( d ) )
    }
    return this.geometry
  }

  /**
  * Get geometry helper - return the geometry for the object instance or from a new single instance
  * @method getGeometry
  * @return {object} Geometry
  */
  getGeometry(){
    this.geometry == undefined ? this._geometry() : null
    return this.geometry
  }
}
