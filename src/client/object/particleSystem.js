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
    settings.explodeStart = false
    this.velocity = {
      x: 0.0,
      y: 0.1
    }
    this.zone = {
      x: settings.world.width/2,
      y: settings.world.height/2,
      z: settings.world.depth/2
    }
    this.particlesCountText = 0

    this.particlesCount = 40000
    this.positions = new Float32Array(this.particlesCount * 3)
    this.alpha = new Float32Array( this.particlesCount * 1 )


    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      this.positions[j + 0] = Math.sin(i) * this.zone.x - this.zone.x * 0.5
      this.positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5
      this.positions[j + 2] = Math.random() * this.zone.z - this.zone.z * 0.5
      this.alpha[i] = 1
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
    // this.timelineExplode.fromTo(this.velocity, 2, {y: 0.5}, { y: 7.0, ease: Power3.easeInOut },0)

    //
    // this.timelineText = new TimelineMax({ paused: true})
    // this.timelineText.to(this.currentPosition, 1, this.textCustomBufferGeometry,0)

  }



  update(state) {
    // if(settings.explodeStart){
    //   this.explode()
    // }else{
    //   this.sparks()
    // }
    //
    if(settings.explodeStart){
      // this.timelineText.play()
      this.timelineExplode.play()

      if(settings.audio.deltaTween > settings.explode.limit){
      }else{
        // this.timelineExplode.reverse()

      }
    }else{
      this.timelineExplode.reverse()

    }


    let positions = this.particles.geometry.attributes.position.array
    // let positionsText = settings.textCustomGeometry._bufferGeometry.attributes.position.array
    let alpha = this.particles.geometry.attributes.alpha.array
    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      // positions[j + 0] -= this.velocity.x
      // positions[j + 0] += Math.sin(i) * 0.7


      if(!settings.explode.complete){
        if(settings.explodeStart){

          if(positions[j + 0] > -100 && positions[j + 0] < 100){
            if(j < 10000 && settings.textDBPosition){
              positions[j + 0] += (settings.textDBPosition[j + 0] - positions[j + 0]) * 0.2
              positions[j + 1] += (settings.textDBPosition[j + 1] - positions[j + 1]) * 0.2
              positions[j + 2] += (settings.textDBPosition[j + 2] - positions[j + 2]) * 0.2
            }else{
              positions[j + 0] += Math.sin(i) * 0.7
              positions[j + 1] += this.velocity.y + (settings.pressing*10)
            }
          }else{
            positions[j + 0] += Math.sin(i) * 0.7
            positions[j + 1] += this.velocity.y + (settings.pressing*10)
          }

          if(positions[j + 1] > this.zone.y*this.utils.getRandomArbitrary(0.5,0.5) || alpha[i] == 0) {
            positions[j + 0] = Math.random() * this.zone.x - this.zone.x * 0.5
            positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5
            positions[j + 2] = Math.random() * this.zone.z - this.zone.z * 0.5
            alpha[i] = 1
          }
          if(settings.pressing > 0.1){
            alpha[i] += 0.1

          }

        }else{
          // if(positions[j + 0] > -80 && positions[j + 0] < 80 && alpha[i] > 10){
          //   alpha[i] -= 0.8
          // }
          positions[j + 0] += Math.sin(i) * 0.7
          positions[j + 1] += this.velocity.y + (settings.pressing)



          if(positions[j + 1] > -(this.zone.y*0.1)) {
            if(settings.pressing > 0.1){
              alpha[j] += 0.1
            }else{

              alpha[i] -= 0.1
            }
          }

          if(positions[j + 1] > (this.zone.y*this.utils.getRandomArbitrary(0.5,1))) {
            positions[j + 0] = Math.random() * this.zone.x - this.zone.x * 0.5
            positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5
            positions[j + 2] = Math.random() * this.zone.z - this.zone.z * 0.5

            alpha[i] = 1

          }
        }
      }else{
        if(j > 4000){
          positions[j + 0] += (this.textPosition[j + 0] - positions[j + 0]) * 0.05
          positions[j + 1] += (this.textPosition[j + 1] - positions[j + 1]) * 0.05
          positions[j + 2] += (this.textPosition[j + 2] - positions[j + 2]) * 0.05
        }else{
          positions[j + 0] += Math.sin(i) * 0.7
          positions[j + 1] += this.velocity.y
        }
        alpha[i] += 0.1
      }
    }
    this.particles.geometry.attributes.alpha.needsUpdate = true
    this.particles.geometry.attributes.position.needsUpdate = true
  }
}
