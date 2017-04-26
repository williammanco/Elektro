// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import * as THREE from 'three/src/Three'
import Composer from './Composer'

THREE.BokehShader = require('imports-loader?THREE=three!exports-loader?THREE.BokehShader!three/examples/js/shaders/BokehShader')
THREE.BokehPass = require('imports-loader?THREE=three!exports-loader?THREE.BokehPass!three/examples/js/postprocessing/BokehPass')

/**
* BokehPass
* Depth of field postprocessing
* @type Class
*/
export default class BokehComposer extends Composer {

  /**
  * [constructor description]
  * @method constructor
  * @param  {[type]}    state    [description]
  * @param  {[type]}    settings [description]
  * @return {[type]}    [description]
  */
  constructor(state,settings) {
    super()
    let self = this

    this.state = {}
    state ? Object.assign(self.state, state) : null

    this.settings = {
      focus: 		1.0,
      aperture:	0.25,
      maxblur:	1.0,
      width: window.innerWidth,
      height: window.innerHeight
    }
    settings ? Object.assign(self.settings, settings) : null
  }

  _setPass(){
    this.bokehPass = new THREE.BokehPass( this.state.scene, this.state.camera, this.settings)
    this.bokehPass.renderToScreen = true
    this.copyShader.renderToScreen = false

  }

  _addPass(){
    this.state.postProcessing.composer.addPass( this.bokehPass )
  }

  getPass(){
    this.bokehPass == undefined ? this._setPass() : null
    return this.bokehPass
  }


}
