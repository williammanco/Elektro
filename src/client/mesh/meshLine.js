// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { APP_CONTAINER_SELECTOR } from '../shared/config'
import * as THREE from 'three/src/Three'

/**
 * MeshLine
 * @type Class
 */
export default class MeshLine {
  /**
   * [constructor description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  constructor(state,settings) {
    let self = this
    this.debug = true

    /**
     * [state description]
     * @param  {object} texture { texture1 : THREE.texture}
     * @type {Object}
     */
    this.state = {
    }

    /**
     * [settings description]
     * @param {array} size [30, 30, 30, 30, 30, 30]
     * @param {string} fragment
     * @param {string} vertex
     * @type {Object}
     */
    this.settings = {
      size : [30, 30, 30, 30, 30, 30]
    }

    //Merging settings and state if is not empty
    state ? Object.assign(self.state, state) : null
    settings ? Object.assign(self.settings, settings) : null


  }

  _geometry(){
    let self = this

    function CustomSinCurve( scale ) {
  	   THREE.Curve.call( this )
  	   this.scale = ( scale === undefined ) ? 1 : scale
    }

    CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
    CustomSinCurve.prototype.constructor = CustomSinCurve;

    CustomSinCurve.prototype.getPoint = function ( t ) {

      var tx = t-Math.PI;
    	var ty =  2 * Math.PI * t
    	var tz = 0



    	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale )

    };

    var path = new CustomSinCurve( 10 );
    console.log(path)
    this.geometry = new THREE.TubeBufferGeometry( path, 20, 2, 8, false );

  }
  _material(){
      this.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  }
  _mesh(){
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init(){
    this.initIsActive = true;
    this._geometry()
    this._material()
    this._mesh()
    return this
  }
  /**
   * Get material helper - return the material for the object instance or from a new single instance
   * @method getMaterial
   * @return {object} THREE.Material
   */
  getMaterial(){
    this.material == undefined ? this._material() : null
    return this.material
  }
  /**
   * Get geometry helper - return the geometry for the object instance or from a new single instance
   * @method getGeometry
   * @return {object} THREE.Geometry
   */
  getGeometry(){
    this.geometry == undefined ? this._geometry() : null
    return this.geometry
  }
  /**
   * Get mesh helper - return a mesh for the object instance
   * @method getMesh
   * @return {object} THREE.Mesh
   */
  getMesh(){
    this.geometry == undefined || this.material == undefined ? this.init() : null
    return this.mesh
  }
}
