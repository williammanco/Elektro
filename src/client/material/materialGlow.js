// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { APP_CONTAINER_SELECTOR } from '../shared/config'
import * as THREE from 'three/src/Three'

const shaderVert = require('./assets/shader/glow.vert')
const shaderFrag = require('./assets/shader/glow.frag')

/**
 * MaterialGlow
 * @type Class
 */
export default class MaterialGlow {
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
    }
    //Merging settings and state if is not empty
    state ? Object.assign(self.state, state) : null

    console.log(this.state)
    /**
     * [settings description]
     * @param {array} size [40, 40, 40, 40, 40, 40]
     * @param {string} fragment
     * @param {string} vertex
     * @type {Object}
     */
    this.settings = {
      material:{
        fragmentShader : shaderFrag,
        vertexShader : shaderVert,
        uniforms : {
            "c":   { type: "f", value: 1.0 },
            "p":   { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xffffff) },
            viewVector: { type: "v3", value: self.state.camera.position }
        },
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      }
    }

    //Merging settings and state if is not empty
    settings ? Object.assign(self.settings, settings) : null


  }

  _material(){
    let self = this
console.log(this.settings.material)
    this.material = new THREE.ShaderMaterial(this.settings.material)
  }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init(){
    this.initIsActive = true;
    this._material()

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


}
