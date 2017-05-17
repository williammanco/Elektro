// @flow

/* eslint-disable no-console */
import 'babel-polyfill'

import { Scene, FontLoader, BufferGeometry, WebGLRenderer, Clock, Vector3, PerspectiveCamera, AmbientLight, SpotLight, JSONLoader, TextureLoader, LoadingManager, BoxHelper, Mesh, MeshLambertMaterial } from 'three/src/Three'
import TweenMax from 'gsap'
import settings from './settings.js'
import ParticleSystem from './object/ParticleSystem'
import MeshDeformed from './object/meshDeformed'
import TextCustom from './object/TextCustom'
import Emitter from 'event-emitter-es6'

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


    ;(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})()


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

    this.particleSystem = new ParticleSystem()
    this.scene.add(this.particleSystem)

    this.isReady = true
    this.particleSystem.timelineInit()

    this.meshDeformed.timelineInit()
    this.timelineCamera()
    this.events()
    this.setText()
  }

  events(){
    const self = this

    // document.addEventListener('keydown', (event) => {
    //   const keyName = event.key;
    //
    // }, false);
    // document.addEventListener('keyup', (event) => {
    //   const keyName = event.key;
    //   if(event.code == 'Space'){
    //     if(settings.pressingSource < 1.5){
    //       settings.pressingSource += .01
    //       // TweenMax.to(settings,.1,{ pressing : '+=.01'})
    //     }
    //   }
    // }, false);

    let cameraPanRange = 1.0, cameraYawRange = cameraPanRange * 1.125;

    window.addEventListener('mouseup', (e) => {
      if(settings.pressingSource < 1.5){
        settings.pressingSource += .01
        // TweenMax.to(settings,.1,{ pressing : '+=.01'})
      }
    })

    window.addEventListener('mousemove', (e) => {
        const nx = e.clientX / window.innerWidth * 2 - 1;
        const ny = -e.clientY / window.innerHeight * 2 + 1;
        const ry = -THREE.Math.mapLinear(nx, -1, 1, cameraPanRange * -0.5, cameraPanRange * 0.5);
        const rx = THREE.Math.mapLinear(ny, -1, 1, cameraYawRange * -0.5, cameraYawRange * 0.5);

        TweenMax.to(this.camera.rotation, 2, {
          x: rx,
          y: ry,
          ease: Power4.easeOut,
        });
      });

    settings.emitter.on('app.levelUpper', function(){
      self.setText()
      self.setTimelineLevelUpper()
    })


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
    this.camera.up = new Vector3(0,0,1);
    this.camera.lookAt(new Vector3(0,0,0));
    this.camera.needsUpdate = true

  }

  setTimelineLevelUpper(){
    const self = this

    this.timelineLevelUpper = new TimelineMax()
    this.timelineLevelUpper
    // .to(this.textLevelUpper.mesh.scale, 2, {x:1,y:1,z:1 },0)
    .fromTo(this.textLevelUpper.material, .2, {opacity: 0},{opacity: 1},0)
    // .to(this.textLevelUpper.material, .3, {opacity: 0})

  }

  setText(){
    if(this.textLevelUpper){
      this.scene.remove(this.textLevelUpper)
    }
    this.textLevelUpper = new TextCustom(settings.level,50)
    this.textLevelUpper.setMesh()
    this.textLevelUpper.setRotation()
    this.textLevelUpper.setToCenter()
    this.textLevelUpper.material.transparent = true
    this.textLevelUpper.material.opacity = 0
    this.scene.add(this.textLevelUpper)
    this.timelineLevelUpper = null
  }

  update(state) {
    TweenMax.to(settings,2,{ pressing: Math.clamp(settings.pressingSource,0,1.5)})

    if(!settings.levelUpper){
      if(settings.pressing > 0.001){
        settings.explodeStart = true
        this.timelineCamera.progress(settings.pressing*5)
        // TweenMax.to(settings,1,{pressing : '-=0.0001'})
        settings.pressingSource -= settings.force
      }else{
        settings.pressingSource = 0
         settings.explodeStart = false
      }
    }else{
      settings.explodeStart = false

      if(settings.pressing < 0.001){
        settings.levelUpper = false
        settings.pressingSource = 0
      }else{
        settings.pressingSource -= .01
        this.timelineCamera.progress(settings.pressing*5)
      }
    }

    if(settings.pressing > settings.explode.limit && !settings.levelUpper){
      settings.level++
      settings.force += .0001
      settings.levelUpper = true
      settings.emitter.emit('app.levelUpper')

    }


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
