// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { APP_CONTAINER_SELECTOR } from '../shared/config'
import * as THREE from 'three/src/Three'
import OrbitControls from 'three-orbitcontrols'
import MeshTruffle from './mesh/MeshTruffle'
import CameraTrack from './Camera/CameraTrack'
import DotScreenComposer from './postProcessing/DotScreenComposer'
import BokehComposer from './postProcessing/BokehComposer'

import Utils from './Utils'

const DEBUG = false;
const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
const OBJLines = require('file-loader!./assets/obj/lines.obj')
const OBJLine0 = require('file-loader!./assets/obj/line0.obj')
const JSONDDD = require('file-loader!./assets/json/DDD.json')

THREE.OBJLoader = require('imports-loader?THREE=three!exports-loader?THREE.OBJLoader!three/examples/js/loaders/OBJLoader')
// THREE.EffectComposer = require('imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer')
// THREE.RenderPass = require('imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass');
// THREE.FXAAShader = require('imports-loader?THREE=three!exports-loader?THREE.FXAAShader!three/examples/js/shaders/FXAAShader');
// THREE.MaskPass = require('imports-loader?THREE=three!exports-loader?THREE.MaskPass!three/examples/js/postprocessing/MaskPass');
// THREE.ShaderPass = require('imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass');
// THREE.CopyShader = require('imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader');
// THREE.ConvolutionShader = require('imports-loader?THREE=three!exports-loader?THREE.ConvolutionShader!three/examples/js/shaders/ConvolutionShader')
// THREE.LuminosityHighPassShader = require('imports-loader?THREE=three!exports-loader?THREE.LuminosityHighPassShader!three/examples/js/shaders/LuminosityHighPassShader')
// THREE.UnrealBloomPass = require('imports-loader?THREE=three!exports-loader?THREE.UnrealBloomPass!three/examples/js/postprocessing/UnrealBloomPass');
// THREE.FilmPass = require('imports-loader?THREE=three!exports-loader?THREE.FilmPass!three/examples/js/postprocessing/FilmPass');
// THREE.FilmShader = require('imports-loader?THREE=three!exports-loader?THREE.FilmShader!three/examples/js/shaders/FilmShader');
// THREE.TexturePass = require('imports-loader?THREE=three!exports-loader?THREE.TexturePass!three/examples/js/postprocessing/TexturePass');
// THREE.DotScreenPass = require('imports-loader?THREE=three!exports-loader?THREE.DotScreenPass!three/examples/js/postprocessing/DotScreenPass');
// THREE.DotScreenShader = require('imports-loader?THREE=three!exports-loader?THREE.DotScreenShader!three/examples/js/shaders/DotScreenShader');
// THREE.BokehShader = require('imports-loader?THREE=three!exports-loader?THREE.BokehShader!three/examples/js/shaders/BokehShader')
// THREE.BokehPass = require('imports-loader?THREE=three!exports-loader?THREE.BokehPass!three/examples/js/postprocessing/BokehPass')
//

require('./assets/css/main.css')

export default class Elektro {
  constructor() {
    this.state = {
      scene : new THREE.Scene(),
      camera : new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 ),
      image : {
        normal : imageNormal,
        base : imageBase
      },
      texture : {}
    }

    this._init()
  }
  _init(){
    this._renderer()
    this._camera()
    this._loader()
    this._loadTexture()
    this._loadDDD()

    this.controls = new OrbitControls(this.state.camera, this.state.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.25
    this.controls.enableZoom = false

    this.utils = new Utils()

  }
  _camera(){
    this.state.camera.position.z = 100;
  }
  _loader(){
    let self = this
    this.manager = new THREE.LoadingManager();
    this.manager.onLoad = function ( ) {
      self._onLoaded()
    }
  }
  _debug(){
    let self = this
    this.state.scene.traverse( function( node ) {
      if ( node.type == 'Mesh' ) {
        self.state.scene.add( new THREE.BoxHelper( node ) )
      }
    } );

  }
  _loadTexture(){
    let self = this
    this.textureLoader = new THREE.TextureLoader(this.manager)
    Object.keys(self.state.image).forEach(function(key) {
      self.textureLoader.load( self.state.image[key], function ( object ) {
        self.state.texture[key] = object
      })
    });
  }
  _loadDDD(){
    let self = this
    this.JSONLoader = new THREE.JSONLoader(this.manager)
    this.JSONLoader.load(JSONDDD , function ( object ) {
      self.geometryDDD = object

      // self._lights()

    })
  }
  _loadOBJ(){
    let self = this
    this.OBJLoader = new THREE.OBJLoader(this.manager)
    this.materialGlow = new MaterialGlow(self.state).init()
    this.materialLines = this.materialGlow.getMaterial()
    this.OBJLoader.load(OBJLines , function ( object ) {


      object.traverse( function ( child ) {

        child.material = self.materialLines
      });
      object.scale.set(26,26,26)
      object.rotation.x = self.utils.getDegreesToRadiant(90)
      self.OBJLines = object

    })
    // this.OBJLoader = new THREE.OBJLoader(this.manager)
    // this.OBJLoader.load(OBJLine0 , function ( object ) {
    //   object.rotation.x = self.utils.getDegreesToRadiant(90)
    //   self.state.OBJLine0 = object
    // })
  }
  _lights(){
    this.state.scene.add( new THREE.AmbientLight( 0x222222 ) );
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 0, 30, -200 );
    this.spotLight.angle = Math.PI / 7;
    this.spotLight.penumbra = 0.8;
    this.spotLight.castShadow = true;
    this.spotLight.lookAt(this.meshDDD.position)
    this.state.scene.add( this.spotLight );
  }
  _onLoaded(){

    // this.state.OBJLines = [];
    // for(let i=0; i<100; i++){
    //   let randomX = this.utils.getRandomIntInclusive(-100,100)
    //   let randomY = this.utils.getRandomIntInclusive(-100,100)
    //
    //   this.state.OBJLines[i] = this.state.OBJLine0.clone()
    //   this.state.OBJLines[i].position.x = randomX
    //   this.state.OBJLines[i].position.y = randomY
    //   // this.state.OBJLines[i].position.z = this.utils.getRandomIntInclusive(0,10)+i*this.utils.getRandomSign()
    //   this.state.OBJLines[i].rotation.y = this.utils.getDegreesToRadiant(this.utils.getRandomMultiply(45))
    //   this.state.OBJLines[i].scale.set(5,5,5)
    //    this.state.scene.add( this.state.OBJLines[i] )
    // }
    // this.state.scene.add( this.OBJLines )

    this.meshTruffle = new MeshTruffle(this.state).init()
    this.mesh = this.meshTruffle.getMesh()
    this.mesh.geometry.computeFaceNormals()
    this.mesh.geometry.computeVertexNormals()
    this.mesh.geometry.computeMorphNormals()

    this.mesh.position.z = 20

    if(DEBUG){
      this._debug()
    }
    this.materialDDD = new MeshTruffle(this.state).getMaterial()

    this.meshDDD = new THREE.Mesh( this.geometryDDD, this.materialDDD )
    this.meshDDD.position.z = -200
    this.meshDDD.rotation.x = this.utils.getDegreesToRadiant(90)
    this.meshDDD.rotation.z = this.utils.getDegreesToRadiant(180)

    this.meshDDD.scale.set(20,20,20)
    this.state.scene.add(this.meshDDD)

    let lookAt = this.meshDDD.position
    this.cameraTrack = new CameraTrack(this.state,{lookAt : [lookAt.x,lookAt.y,lookAt.z]}).init()






    this._initPostProcessing()
    this.render()
  }
  _renderer(){
    this.state.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.state.renderer.setSize( window.innerWidth, window.innerHeight )
    this.state.renderer.setPixelRatio( window.devicePixelRatio )
    document.body.appendChild( this.state.renderer.domElement )

  }
  _initPostProcessing0(){
    // this.postProcessingx = {}
    // this.state.renderScenex = new THREE.RenderPass(this.state.scene, this.state.camera);
    // this.copyShaderx = new THREE.ShaderPass(THREE.CopyShader);
    // this.copyShaderx.renderToScreen = true;
    // this.bloomPassx = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);//1.0, 9, 0.5, 512);
    // this.filmPassx = new THREE.FilmPass( 0.35, 0.025, 648, false );
    // this.dotScreenPassx = new THREE.DotScreenPass();
    // this.postProcessingx.composer = new THREE.EffectComposer(this.state.renderer);
    // this.postProcessingx.composer.setSize(window.innerWidth, window.innerHeight);
    // this.postProcessingx.composer.addPass(this.state.renderScenex);
    // //this.composer.addPass(this.bloomPass);
    // //
    // this.postProcessingx.composer.addPass(this.dotScreenPassx);
    // this.postProcessingx.composer.addPass(this.copyShaderx);
    // this.state.renderer.gammaInput = true;
    // this.state.renderer.gammaOutput = true;
    // console.log(this.postProcessingx.composer)

  }
  //
  _initPostProcessing(){
    this.composer = new BokehComposer(this.state).init()
    // this.composer.addPass(new DotScreenComposer(this.state).getPass())
    // this.composer.closeComposer()
  }

  render() {
    let self = this
    let timer = Date.now() * 0.0001;

    this.mesh.rotation.x += 0.01
    this.mesh.rotation.y += 0.02


    this.mesh.rotation.x = timer;
    this.mesh.rotation.y = Math.sin(timer*2);

    // this.state.renderer.render( this.state.scene, this.state.camera )
    //  self.composer.render(0.02)

    this.mesh.geometry = this.meshTruffle.getDeformedGeometry(timer)

    this.cameraTrack.loop();

    // this.postProcessing.composer.render(0.02)

    this.composer.render()
    requestAnimationFrame( this.render.bind(this) )


    // this.OBJLines.traverse( function ( child ) {
    //   child.material.needsUpdate = true
    //   if(Math.random() > .05){
    //     child.material.visible = false
    //   }else{
    //     child.material.visible = true
    //   }
    //
    //   child.material.uniforms.viewVector.value =
    //     new THREE.Vector3().subVectors( self.state.camera.position, child.position );
    // });
  }
}


const app = new Elektro()
