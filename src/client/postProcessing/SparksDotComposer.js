// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import Composer from './Composer'

const SparksDotShader = require('imports-loader?THREE=three!exports-loader?THREE.SparksDotShader!./shaders/SparksDotShader')
const CustomShaderPass = require('imports-loader?THREE=three!exports-loader?THREE.CustomShaderPass!./pass/CustomShaderPass')

/**
* BokehPass
* Depth of field postprocessing
* @type Class
*/
export default class SparksDotComposer extends Composer {

  /**
  * [constructor description]
  * @method constructor
  * @param  {[type]}    state    [description]
  * @param  {[type]}    settings [description]
  * @return {[type]}    [description]
  */
  constructor(state,settings) {
    super()
    const self = this

    this.state = {}
    state ? Object.assign( self.state, state ) : null
    this.settings = {
      time: 		this.state.time,
      resolution : [window.innerWidth, window.innerHeight]
    }
    settings ? Object.assign( self.settings, settings ) : null
  }

  _setPass(){
    this.sparksDotPass = new CustomShaderPass(SparksDotShader)
    this.sparksDotPass.renderToScreen = true
  }

  _addPass(){
    this.state.postProcessing.composer.addPass( this.sparksDotPass )
  }

  getPass(){
    this.sparksDotPass == undefined ? this._setPass() : null
    return this.sparksDotPass
  }

}
