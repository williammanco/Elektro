// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import * as THREE from 'three/src/Three'
import Composer from './Composer'

THREE.DotScreenShader = require('imports-loader?THREE=three!exports-loader?THREE.DotScreenShader!three/examples/js/shaders/DotScreenShader');
THREE.DotScreenPass = require('imports-loader?THREE=three!exports-loader?THREE.DotScreenPass!three/examples/js/postprocessing/DotScreenPass');


/**
* DotScreenPass
* Depth of field postprocessing
* @type Class
*/
export default class DotScreenComposer extends Composer {

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

    this.settings = {}
    settings ? Object.assign(self.settings, settings) : null
  }


  _setPass(){
    this.dotScreenPass = new THREE.DotScreenPass()
  }

  _addPass(){
    this.state.postProcessing.composer.addPass( this.dotScreenPass )
  }

  getPass(){
    this.dotScreenPass == undefined ? this._setPass() : null
    return this.dotScreenPass
  }
}
