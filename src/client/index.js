// @flow

/* eslint-disable no-console */
import 'babel-polyfill'

import { APP_CONTAINER_SELECTOR } from '../shared/config'
import { Scene, WebGLRenderer, PerspectiveCamera, AmbientLight, SpotLight, JSONLoader, TextureLoader, LoadingManager, BoxHelper, Mesh, MeshLambertMaterial } from 'three/src/Three'
import OrbitControls from 'three-orbitcontrols'
import MeshTruffle from './mesh/MeshTruffle'
// import MaterialGlow from './material/MaterialGlow'
import CameraTrack from './Camera/CameraTrack'
import DotScreenComposer from './postProcessing/DotScreenComposer'
// import BokehComposer from './postProcessing/BokehComposer'
import ParticleEmber from './particle/ParticleEmber'
import GeometrySphereDeformed from './geometry/geometrySphereDeformed'

import Utils from './Utils'

const DEBUG = false;
const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
const OBJLines = require('file-loader!./assets/obj/lines.obj')
const OBJLine0 = require('file-loader!./assets/obj/line0.obj')
const JSONDDD = require('file-loader!./assets/json/DDD.json')

const OBJLoader = require('imports-loader?THREE=three!exports-loader?THREE.OBJLoader!three/examples/js/loaders/OBJLoader')
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
      scene : new Scene(),
      camera : new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 ),
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
    this._lights()
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
    const self = this
    this.manager = new LoadingManager();
    this.manager.onLoad = function ( ) {
      self._onLoaded()
    }
  }
  _debug(){
    const self = this
    this.state.scene.traverse( function( node ) {
      if ( node.type == 'Mesh' ) {
        self.state.scene.add( new BoxHelper( node ) )
      }
    } );

  }
  _loadTexture(){
    const self = this
    this.textureLoader = new TextureLoader(this.manager)
    Object.keys(self.state.image).forEach(function(key) {
      self.textureLoader.load( self.state.image[key], function ( object ) {
        self.state.texture[key] = object
      })
    });
  }
  _loadDDD(){
    const self = this
    this.JSONLoader = new JSONLoader(this.manager)
    this.JSONLoader.load(JSONDDD , function ( object ) {
      self.geometryDDD = object

      // self._lights()

    })
  }
  _loadOBJ(){
    const self = this
    this.OBJLoader = new OBJLoader(this.manager)
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
    // this.state.scene.add( new AmbientLight( 0x222222 ) );
    this.spotLight = new SpotLight( 0xffffff,.3 )
    this.spotLight.position.set( 0, 200, -100 )
    this.spotLight.angle = Math.PI / 7
    this.spotLight.penumbra = 0.8
    this.spotLight.castShadow = true
    // this.spotLight.lookAt(this.meshDDD.position)
    this.state.scene.add( this.spotLight )

    this.spotLight2 = new SpotLight( 0xffffff, 0.05 )
    this.spotLight2.position.set( 100, 100, 200 )
    this.spotLight2.angle = Math.PI / 7
    this.spotLight2.penumbra = 1.8
    this.spotLight2.castShadow = true
    // this.spotLight.lookAt(this.meshDDD.position)
    this.state.scene.add( this.spotLight2 )
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
    this.materialDDD = new MeshTruffle(this.state).getMaterial()

    this.geometryTruffle = new GeometrySphereDeformed()
    this.materialSimple = new MeshLambertMaterial({ color: 0xffffff })
    this.mesh = new Mesh(this.geometryTruffle.getDeformedGeometry(),this.materialDDD)
    this.state.scene.add(this.mesh)
    // this.meshTruffle = new MeshTruffle(this.state).init()
    // this.mesh = this.meshTruffle.getMesh()
    this.mesh.geometry.computeFaceNormals()
    this.mesh.geometry.computeVertexNormals()
    this.mesh.geometry.computeMorphNormals()

    this.mesh.position.z = 20

    if(DEBUG){
      this._debug()
    }

    this.meshDDD = new Mesh( this.geometryDDD, this.materialDDD )
    this.meshDDD.position.z = -200
    this.meshDDD.rotation.x = this.utils.getDegreesToRadiant(90)
    this.meshDDD.rotation.z = this.utils.getDegreesToRadiant(180)

    this.meshDDD.scale.set(20,20,20)
    this.state.scene.add(this.meshDDD)

    // let lookAt = this.meshDDD.position
    // this.cameraTrack = new CameraTrack(this.state,{lookAt : [lookAt.x,lookAt.y,lookAt.z]}).init()

    this.particle = new ParticleEmber(this.state).init()




    this._initPostProcessing()
    this.render()
  }
  _renderer(){
    this.state.renderer = new WebGLRenderer({ alpha: true })
    this.state.renderer.setSize( window.innerWidth, window.innerHeight )
    this.state.renderer.setPixelRatio( window.devicePixelRatio )
    document.body.appendChild( this.state.renderer.domElement )

  }

  _initPostProcessing(){
    // this.composer = new DotScreenComposer(this.state).init()
    // this.composer.addPass(new DotScreenComposer(this.state).getPass())
    // this.composer.closeComposer()
  }

  render() {
    let delta = Date.now();
    let timer = delta * 0.0001;

    this.mesh.rotation.x += 0.01
    this.mesh.rotation.y += 0.02


    this.mesh.rotation.x = timer;
    this.mesh.rotation.y = Math.sin(timer*2);

    this.state.renderer.render( this.state.scene, this.state.camera )
    //  self.composer.render(0.02)
    this.mesh.geometry = this.geometryTruffle.getDeformedGeometry(this.utils.getLoopInterval(timer,1,1.5))

    // this.cameraTrack.loop();

    this.particle.render(delta)
    // this.postProcessing.composer.render(0.02)

    // this.composer.render()
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
