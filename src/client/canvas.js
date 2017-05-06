// @flow

/* eslint-disable no-console */
import 'babel-polyfill'

import { Scene, WebGLRenderer, Clock, Vector3, PerspectiveCamera, AmbientLight, SpotLight, JSONLoader, TextureLoader, LoadingManager, BoxHelper, Mesh, MeshLambertMaterial } from 'three/src/Three'
import TweenMax from 'gsap'
import settings from './settings.js'
import ParticleSystem from './object/particleSystem'
import MeshDeformed from './object/meshDeformed'

export default class Canvas {
  constructor( width, height ) {
    this.renderer = new WebGLRenderer({ antialising: true, alpha: true  })
    // this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize( width, height )
    // this.renderer.setClearColor(0x000000)
    this.camera =  new PerspectiveCamera( 75, width / height, 1, 10000)
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 100
    // this.camera.lookAt(0, 20, settings.world.height)
    this.clock = new Clock()
    this.scene = new Scene()
    this.time = 0
    document.body.appendChild( this.renderer.domElement )

  }
  loader(){
    const self = this
    this.manager = new LoadingManager()
    this.manager.onLoad = function ( ) {
      self.onLoaderComplete()
    }
    this.loadTexture()
  }
  loadTexture(){
    const self = this

    this.textureLoader = new TextureLoader(this.manager)
    Object.keys(settings.textures).forEach(function(key) {
      self.textureLoader.load( settings.textures[key], function ( object ) {
        settings.textures[key] = object
      })
    })
  }
  onLoaderComplete() {
    this.meshDeformed = new MeshDeformed()
    this.scene.add(this.meshDeformed)

    this.particleSystem = new ParticleSystem()
    this.scene.add(this.particleSystem)

    this.isReady = true
  }
  resize(width, height) {
    this.width = width
    this.height = height

    if (this.composer) {
      this.composer.setSize(width, height)
    }

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
  }
  update() {
    if (!this.isReady) { return }
    let delta = this.clock.getDelta()
    this.time += 1/60
    this.particleSystem.update()
    this.meshDeformed.update(this.time)
  }
  render() {
    if (settings.usePostprocessing) {
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }
}
