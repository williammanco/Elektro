import { Object3D, BufferAttribute, BufferGeometry, ShaderMaterial, Points, AdditiveBlending, Color } from 'three'
import settings from '../settings.js'
import Utils from '../utils.js'
const vert = require('../assets/shader/snow.vert')
const frag = require('../assets/shader/snow.frag')
// const particleImage = require('../textures/particle2.png')

export default class ParticleSystem extends Object3D{
  constructor() {
    super()
    this.utils = new Utils()
    this.explodeStart = false
    this.velocity = {
      x: 0.0,
      y: -1.5
    }
    this.zone = {
      x: settings.world.width/2,
      y: settings.world.height/2,
      z: settings.world.depth/3
    }
    this.particlesCount = 100000
    this.positions = new Float32Array(this.particlesCount * 3)
    this.alpha = new Float32Array( this.particlesCount * 1 )

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
        'texture': { type: 't', value: new THREE.TextureLoader().load( 'textures/particle2.png') },
        'color': { type: 'c', value: new Color(0xd200ff) }
      },
      transparent: true,
      blending: AdditiveBlending
    })

    this.particles = new Points(this.geom, this.mat)
    this.add(this.particles)
  }

  sparks(){
    let positions = this.particles.geometry.attributes.position.array
    let alpha = this.particles.geometry.attributes.alpha.array
    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      // positions[j + 0] -= this.velocity.x
      positions[j + 0] -= Math.sin(i) * 0.5
      positions[j + 1]  += 0.5

      alpha[i] -= 0.1

      if(positions[j + 1] > (this.zone.y*0.5)) {
        positions[j + 0] = Math.random() * this.zone.x - this.zone.x * 0.5
        positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5
        alpha[i] = 1
      }
    }
  }
  explode(){
    let positions = this.particles.geometry.attributes.position.array
    let alpha = this.particles.geometry.attributes.alpha.array
    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      // positions[j + 0] -= this.velocity.x
      positions[j + 0] += Math.sin(i) * 0.7

      alpha[i] += 0.05

      if(positions[j + 1] > (this.zone.y*0.5)) {
        positions[j + 0] = Math.random() * this.zone.x - this.zone.x * 0.5
        positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5
      }
    }
  }

  update() {

    if(this.explodeStart){
      this.explode()

    }else{
      this.sparks()
    }

    this.particles.geometry.attributes.alpha.needsUpdate = true
    this.particles.geometry.attributes.position.needsUpdate = true
  }
}
