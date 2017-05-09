import { Object3D, Vector2, CubeGeometry, ShaderMaterial, Mesh, RepeatWrapping } from 'three'
import settings from '../settings.js'
import ImprovedNoise from 'improved-noise'
import Utils from '../utils'
import { TimelineMax } from 'gsap'

const shaderVert = require('../assets/shader/matcapSEM.vert')
const shaderFrag = require('../assets/shader/matcapSEM_blend.frag')

export default class meshDeformed extends Object3D{
  constructor() {
    super()
    const self = this

    this.options = {
      size : [60, 60, 60, 60, 60, 60],
      fragment : shaderFrag,
      vertex : shaderVert,
      uniforms : {
        time: { value: 1.0 },
        resolution: { value: new Vector2() },
        texture: { type: 't', value: null },
        tNormal: { type: 't', value: null },
        lightDir_value : { value: [0.0,-0.3,0.6]},
        viewDir_value : { value: [0.0,0.0,0.0]},
        exponent_value : { value: 0.34},
        fresnelCoef_value : { value: -0.98},
        rim_color : {value: [88,70,37]},
        rim_start : {value: 0.2},
        rim_end :  {value: 1.0},
        rim_coef : {value: 0.7},
        noise_value : {value: 0.0},
        normalScale : { value: 0.93},
        texScale : { value: 1.0},
        normalCoef : { value: 2.0}
      }
    }
    this.utils = new Utils
    this.geometry = new CubeGeometry(...this.options.size)
    this.material = new ShaderMaterial( {
      uniforms: self.options.uniforms,
      vertexShader: self.options.vertex,
      fragmentShader: self.options.fragment,
    })
    this.material.uniforms.texture.value = settings.textures.base
    this.material.uniforms.tNormal.value = settings.textures.normal

    if(this.material.uniforms.texture != undefined){
      this.material.uniforms.texture.value.wrapS = this.material.uniforms.texture.value.wrapT = RepeatWrapping
      this.material.uniforms.texture.value.needsUpdate = true
    }
    this.mesh = new Mesh( this.geometry, this.material )
    this.improvedNoise = new ImprovedNoise()
    this.mesh.geometry = this.getDeformedGeometry()
    this.mesh.scale.set(2,2,2)
    this.deform = {
      delta :1.5
    }
    this.add(this.mesh)
  }

  getDeformedGeometry(delta){
    this.geometry == undefined ? this._geometry() : null
    delta != undefined ? this.timer = delta : null
    this.geometry.verticesNeedUpdate = true;
	  this.geometry.normalsNeedUpdate = true;
	  this.geometry.uvsNeedUpdate = true;
    this.geometry.computeFaceNormals()
    this.geometry.computeVertexNormals()
    this.geometry.computeMorphNormals()
    for( let j = 0; j < this.geometry.vertices.length; j++ ) {
         let v = this.geometry.vertices[ j ]
         let n = v.clone()
         n.normalize()
         v.copy( n )
         v.multiplyScalar( 30 )
         let f = 0.07
         this.timer != undefined ? f = 0.0+(Math.cos(this.timer)*0.1) : false
         //var d = - 10 * this.turbulence( f * v.x, f * v.y, f * v.z )
         let d = 6 * this.improvedNoise.noise( f * v.x, f * v.y, f * v.z )
         v.add( n.multiplyScalar( d ) )
     }
     return this.geometry
  }

  explodeInit(){
    this.timelineExplode = new TimelineMax({ paused: true})
    this.timelineExplode
    .to(this.mesh.rotation, 10, { x : 5, y : 5, ease: Power4.easeInOut},0)
    .to(this.mesh.scale, 10, { x : 6, y : 6, z :6, ease: Power4.easeInOut},0)
    .to(this.deform, 10, { delta: .5, ease: Power4.easeInOut},0)
  }

  explodePlay(){
    this.timelineExplode.play()
  }

  explodeReturn(){
    this.timelineExplode.reverse().timeScale(1.5)
  }

  update(delta) {
    this.mesh.rotation.x = delta*.5
    this.mesh.rotation.y = delta*.2

    //this.mesh.rotation.y = Math.sin(delta*2)
    this.mesh.geometry = this.getDeformedGeometry(this.deform.delta + this.utils.getLoopInterval(delta,1,1.5))
    // this.mesh.rotation.x = delta
    // this.mesh.rotation.y = Math.sin(delta*2)
    // this.mesh.geometry = this.getDeformedGeometry(this.utils.getLoopInterval(delta,1,1.5))
  }
}
