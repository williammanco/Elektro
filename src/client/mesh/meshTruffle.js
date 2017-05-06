// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { Vector2, CubeGeometry, ShaderMaterial, Mesh, RepeatWrapping } from 'three/src/Three'
import ImprovedNoise from 'improved-noise'

const shaderVert = require('../assets/shader/matcapSEM.vert')
const shaderFrag = require('../assets/shader/matcapSEM_blend.frag')

/**
 * MeshTruffle
 * @type Class
 */
export default class MeshTruffle {
  /**
   * [constructor description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  constructor(state, settings) {
    let self = this

    /**
     * [state description]
     * @param  {object} texture { texture1 : texture}
     * @type {Object}
     */
    this.state = {
      texture : { }
    }

    /**
     * [settings description]
     * @param {array} size [40, 40, 40, 40, 40, 40]
     * @param {string} fragment
     * @param {string} vertex
     * @type {Object}
     */
    this.settings = {
      size : [40, 40, 40, 40, 40, 40],
      fragment : shaderFrag,
      vertex : shaderVert,
      uniforms : {
        time: { value: 1.0 },
        resolution: { value: new Vector2() },
        texture: { type: 't', value: null },
        tNormal: { type: 't', value: null },
        lightDir_value : { value: [0.0,-0.3,0.6]},
        viewDir_value : { value: [0.0,0.0,0.0]},
        exponent_value : { value: 0.34},
        fresnelCoef_value : { value: -0.98},
        rim_color : {value: [88,70,37]},
        rim_start : {value: 0.2},
        rim_end :  {value: 1.0},
        rim_coef : {value: 0.7},
        noise_value : {value: 0.0},
        normalScale : { value: 0.93},
        texScale : { value: 1.0},
        normalCoef : { value: 2.0}
      }
    }

    //Merging settings and state if is not empty
    state ? Object.assign(self.state, state) : null
    settings ? Object.assign(self.settings, settings) : null

    this.improvedNoise = new ImprovedNoise()

  }

  _turbulence( x, y, z ) {
        let t = -0.5
        for( let f = 1 ; f <= 100/12 ; f *= 2) {
            t += Math.abs( this.improvedNoise.noise( f * x, f * y, f * z ) / f )
        }
        return t
  }
  _geometry(){
    this.geometry = new CubeGeometry(...this.settings.size)
  }
  _material(){
    const self = this

      this.material = new ShaderMaterial( {
        uniforms: self.settings.uniforms,
      	vertexShader: self.settings.vertex,
      	fragmentShader: self.settings.fragment,
      });

      this.material.uniforms.texture.value = this.state.texture.base
      this.material.uniforms.tNormal.value = this.state.texture.normal

      if(this.material.uniforms.texture != undefined){
        this.material.uniforms.texture.value.wrapS = this.material.uniforms.texture.value.wrapT = RepeatWrapping;
      	this.material.uniforms.texture.value.needsUpdate = true;
      }
    }
  _mesh(){
    this.mesh = new Mesh( this.geometry, this.material )
  }

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
   * [init description]
   * @return {[type]} [description]
   */
  init(){
    this.initIsActive = true;
    this._geometry()
    this._material()
    this._mesh()
    this.state.scene != undefined ? this.state.scene.add( this.mesh ) : false

    return this
  }
  /**
   * [setMaterial description]
   * @method setMaterial
   * @param  {[type]}    material [description]
   */
  setMaterial(material){
    this.material = material
  }
  /**
   * Get material helper - return the material for the object instance or from a new single instance
   * @method getMaterial
   * @return {object} Material
   */
  getMaterial(){
    this.material == undefined ? this._material() : null
    return this.material
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
  /**
   * Get mesh helper - return a mesh for the object instance
   * @method getMesh
   * @return {object} Mesh
   */
  getMesh(){
    this.geometry == undefined ? this._geometry() : null
    this.material == undefined ? this._material() : null
    this.mesh == undefined ? this._mesh() : null
    return this.mesh
  }

}
