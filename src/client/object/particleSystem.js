import { Object3D, TextureLoader, BufferAttribute, BufferGeometry, RingBufferGeometry, ShaderMaterial, Points, AdditiveBlending, Color } from 'three'
import settings from '../settings.js'
import Utils from '../utils.js'
const vert = require('../assets/shader/snow.vert')
const frag = require('../assets/shader/snow.frag')
// const particleImage = require('../textures/particle2.png')

export default class ParticleSystem extends Object3D{
  constructor(state) {
    super()

    this.utils = new Utils()
    this.explodeStart = false
    this.velocity = {
      x: 0.0,
      y: 0.5
    }
    this.zone = {
      x: settings.world.width/2,
      y: settings.world.height/2,
      z: settings.world.depth/2
    }

    this.particlesCount = 30000
    this.positions = new Float32Array(this.particlesCount * 3)
    this.alpha = new Float32Array( this.particlesCount * 1 )


    this.textWinnerBufferGeometry = new BufferGeometry().fromGeometry( settings.textWinnerGeometry );
    this.textPosition = this.textWinnerBufferGeometry.attributes.position.array
    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      this.positions[j + 0] = Math.sin(i) * this.zone.x - this.zone.x * 0.5
      this.positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5
      this.positions[j + 2] = Math.random() * this.zone.z - this.zone.z * 0.5
      this.alpha[j] = 1
    }

    this.geom = new BufferGeometry()
    this.geom.addAttribute('position', new BufferAttribute(this.positions, 3))
    this.geom.addAttribute( 'alpha', new BufferAttribute( this.alpha, 1 ) );
    this.geom.computeBoundingSphere()

    this.mat = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        'texture': { type: 't', value: new TextureLoader().load( 'textures/particle2.png') },
        'color': { type: 'c', value: new Color(0xd200ff) }
      },
      transparent: true,
      blending: AdditiveBlending
    })

    this.particles = new Points(this.geom, this.mat)
    this.add(this.particles)
  }

  timelineInit(){
    this.timelineExplode = new TimelineMax({ paused: true})
    this.timelineExplode.fromTo(this.velocity, settings.explode.time, {y: 0.5}, { y: 7.0, ease: Power3.easeInOut },0)

    //
    // this.timelineText = new TimelineMax({ paused: true})
    // this.timelineText.to(this.currentPosition, 1, this.textWinnerBufferGeometry,0)

  }



  update(state) {
    // if(this.explodeStart){
    //   this.explode()
    // }else{
    //   this.sparks()
    // }
    //
    if(this.explodeStart){
      // this.timelineText.play()

      if(state.audio.percent > settings.explode.limit){
        this.timelineExplode.play()
      }else{
        this.timelineExplode.reverse()

      }
    }else{
      this.timelineExplode.reverse()

    }


    let positions = this.particles.geometry.attributes.position.array
    // let positionsText = settings.textWinnerGeometry._bufferGeometry.attributes.position.array
    let alpha = this.particles.geometry.attributes.alpha.array
    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      // positions[j + 0] -= this.velocity.x
      // positions[j + 0] += Math.sin(i) * 0.7


if(!settings.explode.complete){
  if(!this.explodeStart){
        positions[j + 0] += Math.sin(i) * 0.7
        positions[j + 1] += this.velocity.y
  }

  if(positions[j + 1] > -(this.zone.y*0.1)) {
    if(this.explodeStart){
      alpha[i] += 0.1
    }else{

      alpha[i] -= 0.1
    }
  }
}





      if(this.explodeStart){
        positions[j + 0] += (this.textPosition[j + 0] - positions[j + 0]) * 0.01
        positions[j + 1] += (this.textPosition[j + 1] - positions[j + 1]) * 0.01
        positions[j + 2] += (this.textPosition[j + 2] - positions[j + 2]) * 0.01
      }


      if(positions[j + 1] > (this.zone.y*this.utils.getRandomArbitrary(0.5,1))) {
        positions[j + 0] = Math.random() * this.zone.x - this.zone.x * 0.5
        positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5
        positions[j + 2] = Math.random() * this.zone.z - this.zone.z * 0.5

        alpha[i] = 1

      }
    }
    this.particles.geometry.attributes.alpha.needsUpdate = true
    this.particles.geometry.attributes.position.needsUpdate = true
  }
}
