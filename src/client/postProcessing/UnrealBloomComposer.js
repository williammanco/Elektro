// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import Composer from './Composer'
import { Vector2 } from 'three/src/Three'

const ConvolutionShader = require('imports-loader?THREE=three!exports-loader?THREE.ConvolutionShader!three/examples/js/shaders/ConvolutionShader')
const LuminosityHighPassShader = require('imports-loader?THREE=three!exports-loader?THREE.LuminosityHighPassShader!three/examples/js/shaders/LuminosityHighPassShader')
const UnrealBloomPass = require('imports-loader?THREE=three!exports-loader?THREE.UnrealBloomPass!three/examples/js/postprocessing/UnrealBloomPass')


/**
* UnrealBloomPass
* Bloom pass
* @type Class
*/
export default class UnrealBloomComposer extends Composer {

  /**
  * [constructor description]
  * @method constructor
  * @param  {[type]}    state    [description]
  * @param  {[type]}    settings [description]
  * @return {[type]}    [description]
  */
  constructor( state, settings ) {
    super()
    const self = this

    this.state = {}
    state ? Object.assign( self.state, state ) : null

    this.settings = {}
    settings ? Object.assign( self.settings, settings ) : null
  }

  _setPass(){
		this.unrealBloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85 )
    this.unrealBloomPass.renderToScreen = true
  }

  _addPass(){
    this.state.postProcessing.composer.addPass( this.effectFXAA )
    this.state.postProcessing.composer.addPass( this.unrealBloomPass )
  }

  getPass(){
    this.unrealBloomPass == undefined ? this._setPass() : null
    return this.unrealBloomPass
  }
}
