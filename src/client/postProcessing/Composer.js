// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
const CopyShader = require('imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader')
const EffectComposer = require('imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer')
const RenderPass = require('imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass')
const ShaderPass = require('imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass')
const MaskPass = require('imports-loader?THREE=three!exports-loader?THREE.MaskPass!three/examples/js/postprocessing/MaskPass')

/**
* DOF
* Depth of field postprocessing
* @type Class
*/
export default class Composer {


  /**
  * [init description]
  * @return {[type]} [description]
  */
  init(noClose){
    this.initIsActive = true

    this._initPostprocessing()
    this._setPass()
    this._addPass()
    !noClose ? this._closeComposer() : null
    return this
  }
  /**
  * [init description]
  * @return {[type]} [description]
  */

  _initPostprocessing() {
    this.state.postProcessing = {}
    this.state.renderPass == undefined ? this.state.renderPass = new RenderPass( this.state.scene, this.state.camera ) : null
    this.state.effectComposer == undefined ? this.state.effectComposer = new EffectComposer( this.state.renderer ) : null
    this.copyShader = new ShaderPass(CopyShader)
    this.state.effectComposer.addPass( this.state.renderPass )
    this.state.postProcessing.composer = this.state.effectComposer
  }

  _closeComposer(){
    this.state.renderer.gammaInput = true;
    this.state.renderer.gammaOutput = true;
  }

  render(){
    this.state.postProcessing.composer.render( 0.1 );
  }

  getComposer(){
    return this.state.postProcessing.composer
  }

  addPass(pass){
    this.state.postProcessing.composer.addPass(pass)
  }

  closeComposer(){
    this._closeComposer()
  }


}
