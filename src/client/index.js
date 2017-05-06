// @flow

/* eslint-disable no-console */
import 'babel-polyfill'

import { APP_CONTAINER_SELECTOR } from '../shared/config'
import { Scene, WebGLRenderer, Vector3, PerspectiveCamera, AmbientLight, SpotLight, JSONLoader, TextureLoader, LoadingManager, BoxHelper, Mesh, MeshLambertMaterial } from 'three/src/Three'
import MeshTruffle from './mesh/MeshTruffle'
import CameraTrack from './Camera/CameraTrack'
import GeometrySphereDeformed from './geometry/geometrySphereDeformed'
import 'jquery'

import Utils from './Utils'

const DEBUG = false
const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
const JSONDDD = require('file-loader!./assets/json/DDD.json')
const OBJLoader = require('three/examples/js/loaders/OBJLoader')

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


    this.utils = new Utils()

  }
  _camera(){
    this.state.camera.position.z = 100
  }
  _loader(){
    const self = this
    this.manager = new LoadingManager()
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
    } )
  }
  _loadTexture(){
    const self = this
    this.textureLoader = new TextureLoader(this.manager)
    Object.keys(self.state.image).forEach(function(key) {
      self.textureLoader.load( self.state.image[key], function ( object ) {
        self.state.texture[key] = object
      })
    })
  }
  _loadDDD(){
    const self = this
    this.JSONLoader = new JSONLoader(this.manager)
    this.JSONLoader.load(JSONDDD , function ( object ) {
      self.geometryDDD = object
    })
  }
  _lights(){
    this.spotLight = new SpotLight( 0xffffff,.3 )
    this.spotLight.position.set( 0, 200, -100 )
    this.spotLight.angle = Math.PI / 7
    this.spotLight.penumbra = 0.8
    this.spotLight.castShadow = true
    this.state.scene.add( this.spotLight )

    this.spotLight2 = new SpotLight( 0xffffff, 0.05 )
    this.spotLight2.position.set( 100, 100, 200 )
    this.spotLight2.angle = Math.PI / 7
    this.spotLight2.penumbra = 1.8
    this.spotLight2.castShadow = true
    this.state.scene.add( this.spotLight2 )
  }
  _onLoaded(){

    this.materialDDD = new MeshTruffle(this.state).getMaterial()

    this.geometryTruffle = new GeometrySphereDeformed()
    this.materialSimple = new MeshLambertMaterial({ color: 0xffffff })
    this.mesh = new Mesh(this.geometryTruffle.getDeformedGeometry(),this.materialDDD)
    this.state.scene.add(this.mesh)
    this.mesh.geometry.computeFaceNormals()
    this.mesh.geometry.computeVertexNormals()
    this.mesh.geometry.computeMorphNormals()

    this.mesh.position.z = 20

    this.meshDDD = new Mesh( this.geometryDDD, this.materialDDD )
    this.meshDDD.position.z = -200
    this.meshDDD.rotation.x = this.utils.getDegreesToRadiant(90)
    this.meshDDD.rotation.z = this.utils.getDegreesToRadiant(180)
    this.meshDDD.scale.set(20,20,20)
    this.state.scene.add(this.meshDDD)



    this.render()

    if(DEBUG){
      this._debug()
    }
  }
  _renderer(){
    this.state.renderer = new WebGLRenderer({ alpha: true })
    this.state.renderer.setSize( window.innerWidth, window.innerHeight )
    this.state.renderer.setPixelRatio( window.devicePixelRatio )
    document.body.appendChild( this.state.renderer.domElement )

  }
  render() {
    let delta = Date.now()
    let timer = delta * 0.0001

    this.mesh.rotation.x = timer
    this.mesh.rotation.y = Math.sin(timer*2)

    this.state.renderer.render( this.state.scene, this.state.camera )
    this.mesh.geometry = this.geometryTruffle.getDeformedGeometry(this.utils.getLoopInterval(timer,1,1.5))


    requestAnimationFrame( this.render.bind(this) )
  }
}

const app = new Elektro()
