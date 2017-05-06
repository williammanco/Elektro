// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { Color, ShaderMaterial, FrontSide } from 'three/src/Three'

const shaderVert = require('../assets/shader/simple.vert')
const shaderFrag = require('../assets/shader/sparks.frag')

/**
* MaterialGlow
* @type Class
*/
export default class MaterialSparks {
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
          "time":       { value: 0.0 },
          "resolution": { value: [512, 512] },
          "iMouse" : { value: [ 0, 0 ]}
        },
        side: FrontSide,
        transparent: true
      }
    }

    //Merging settings and state if is not empty
    settings ? Object.assign(self.settings, settings) : null


  }

  _material(){
    let self = this
    this.material = new ShaderMaterial(this.settings.material)
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
