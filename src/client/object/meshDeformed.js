import {CatmullRomCurve3,Vector3, Object3D, Vector2, CubeGeometry, ShaderMaterial, Mesh, RepeatWrapping } from 'three'
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
      deformFactor : 10,
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
    this.deformInit()
  }
  setTrack(){
    let self = this
    this._options = {
      spline : [
        [0,20,0],
        [300,25,0],
        [300,20,300],
        [0,25,0],
        [0,20,0]
      ],
      lookAt : [0,0,0]
    }

    this._points = []
    for ( let i = 0; i < this._options.spline.length; i ++ ) {
      this._points.push(new Vector3(...self._options.spline[i]))
    }
    this._spline = new CatmullRomCurve3(this._points)
    this._spline.closed = true
    this.camPosIndex = 0;
    this.position.z = 5;
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
         v.multiplyScalar( 40 )
         let f = 0
         delta != undefined ? f = delta : 0
         //var d = - 10 * this.turbulence( f * v.x, f * v.y, f * v.z )
         let d = this.options.deformFactor * this.improvedNoise.noise( f * v.x, f * v.y, f * v.z )
         v.add( n.multiplyScalar( d ) )
     }
     return this.geometry
  }

  deformInit(){
    this.timelineDeform = new TimelineMax({ repeat: -1, yoyo: true})
    this.timelineDeform
    .fromTo(this.deform, 2, {delta: 1.1}, { delta: 1.3, ease: Linear.easeNone},0)
  }



  timelineInit(){
    this.timelineExplode = new TimelineMax({ paused: true, onComplete : function(){
      settings.explode.complete = true
    }})
    this.timelineExplode
    .to(this.mesh.rotation, 5, { x : 5, y : 5, ease: Power4.easeInOut},0)
    .to(this.mesh.scale, settings.explode.time, { x : 12, y : 12, z :12, ease: Power3.easeInOut},0)
    // .to(this.deform, 10, { delta: .5, ease: Power4.easeInOut},0)
  }

  explodePlay(){
    // this.timelineExplode.play()
  }

  explodeReturn(){
    this.timelineExplode.reverse().timeScale(1.5)
  }

  update(state, delta) {
    this.mesh.rotation.x = delta*.5
    this.mesh.rotation.y = delta*.2
    //this.mesh.rotation.y = Math.sin(delta*2)

    // TweenMax.to(this.deform,2,{ delta: (state.audio.percent ) })

    if(this.explodeStart){
      if(state.audio.percent > settings.explode.limit){
        TweenMax.to(this.deform,1,{ delta: settings.explode.limit })
        this.timelineExplode.play()
      }else{
        if(!settings.explode.complete){
          TweenMax.to(this.deform,1,{ delta: (state.audio.percent   ) })
          this.timelineExplode.reverse()
        }

      }

    }else{
      TweenMax.to(this.deform,2,{ delta: 0 })
    }
    // console.log('delta',this.deform.delta)

    this.mesh.geometry = this.getDeformedGeometry(this.deform.delta*.5)

    // this.mesh.rotation.x = delta
    // this.mesh.rotation.y = Math.sin(delta*2)
    // this.mesh.geometry = this.getDeformedGeometry(this.utils.getLoopInterval(delta,1,1.5))
    //
    // if(this._spline){
    //
    //   this.camPosIndex += 1;
    //   if (this.camPosIndex > 1000) {
    //      this.camPosIndex = 0;
    //   }
    //   let camPos = this._spline.getPoint(this.camPosIndex / 1000);
    //   let camRot = this._spline.getTangent(this.camPosIndex / 1000);
    //
    //   this.position.x = camPos.x;
    //   this.position.y = camPos.y;
    //   this.position.z = camPos.z;
    //
    //   this.rotation.x = camRot.x;
    //   this.rotation.y = camRot.y;
    //   this.rotation.z = camRot.z;
    //
    // }
  }
}
