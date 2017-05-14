// @flow

/* eslint-disable no-console */
import 'babel-polyfill'

import { Scene, FontLoader, WebGLRenderer, Clock, Vector3, PerspectiveCamera, AmbientLight, SpotLight, JSONLoader, TextureLoader, LoadingManager, BoxHelper, Mesh, MeshLambertMaterial } from 'three/src/Three'
import TweenMax from 'gsap'
import settings from './settings.js'
import ParticleSystem from './object/ParticleSystem'
import MeshDeformed from './object/meshDeformed'
import TextCustom from './object/TextCustom'

export default class Canvas {
  constructor( width, height ) {
    this.renderer = new WebGLRenderer({ antialising: true, alpha: true  })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize( width, height )
    // this.renderer.setClearColor(0x000000)
    this.camera =  new PerspectiveCamera( 75, width / height, 1, 10000)
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 200

    this.camera.lookAt(0, 20, settings.world.height)
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
    this.loadFont()
    this.loadTexture()
  }
  loadFont(){
    const self = this

    this.textLoader = new FontLoader(this.manager);
    Object.keys(settings.fonts).forEach(function(key) {
      self.textLoader.load( settings.fonts[key], function ( object ) {
        settings.fonts[key] = object
      })
    })

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

    this.textCustom = new TextCustom('DDD',30)
    this.textCustom.setToCenter()
    settings.textCustomGeometry = this.textCustom.geometry
    this.scene.add(this.textCustom)

    this.textDB = new TextCustom('0db',30)
    this.textDB.setMesh()
    this.textDB.setRotation()
    this.textDB.setToCenter()
    settings.textDBGeometry = this.textDB.geometry
    this.scene.add(this.textDB)

    this.particleSystem = new ParticleSystem()
    this.scene.add(this.particleSystem)

    this.isReady = true
    this.particleSystem.timelineInit()

    this.meshDeformed.timelineInit()
    this.timelineCamera()
    this.events()

  }

  events(){
    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      if(event.code == 'Space'){
        this.meshDeformed.explodePlay()
        this.timelineCamera.play()
        this.particleSystem.explodeStart = this.meshDeformed.explodeStart = true
      }
    }, false);
    document.addEventListener('keyup', (event) => {
      const keyName = event.key;
      if(event.code == 'Space'){
        this.meshDeformed.explodeReturn()
        this.timelineCamera.reverse()
        this.particleSystem.explodeStart = this.meshDeformed.explodeStart = false

      }
    }, false);
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

  timelineCamera(){
    this.timelineCamera = new TimelineMax({ paused: true})
    this.timelineCamera
    .to(this.camera.position, settings.explode.time, { z: 400, ease: Power4.easeInOut},0)

    this.camera.needsUpdate = true
  }

  update(state) {
    if (!this.isReady) { return }
    let delta = this.clock.getDelta()
    this.time += 1/60
    this.particleSystem.update(state)
    this.meshDeformed.update(state, this.time)

  }
  render() {
    if (settings.usePostprocessing) {
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }
}
