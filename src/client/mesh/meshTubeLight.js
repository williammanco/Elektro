// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { APP_CONTAINER_SELECTOR } from '../shared/config'
import * as THREE from 'three/src/Three'

/**
 * meshTubeLight
 * @type Class
 */
export default class meshTubeLight {
  /**
   * [constructor description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  constructor(state,settings) {
    let self = this

    /**
     * [state description]
     * @param  {object} texture { texture1 : THREE.texture}
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
      size : [5, 5, 20, 32],
      fragment : shaderFrag,
      vertex : shaderVert,
      uniforms : {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
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

  _geometry(){
    this.geometry = new THREE.CylinderBufferGeometry(...this.settings.size)
  }
  _material(){
    let self = this
    this.material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
  }
  _mesh(){
    this.mesh = new THREE.Mesh( this.geometry, this.material )
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
    this.geometry == undefined ? this._geometry() : null
    this.material == undefined ? this._material() : null
    this.mesh == undefined ? this._mesh() : null
    return this.mesh
  }

}
