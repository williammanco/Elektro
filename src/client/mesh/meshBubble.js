// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { CubeGeometry, CubeCamera, ShaderMaterial, Mesh } from 'three/src/Three'
import ImprovedNoise from './assets/js/ImprovedNoise'

const FresnelShader = require('imports-loader?THREE=three!exports-loader?THREE.FresnelShader!three/examples/js/shaders/FresnelShader');


/**
 * MeshBubble
 * @type Class
 */
export default class MeshBubble {
  /**
   * [constructor description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  constructor(three,state,settings) {
    let self = this


    /**
     * [state description]
     * @param  {object} texture { texture1 : THREE.texture}
     * @type {Object}
     */
    this.state = {
      texture : { }
    }
    state ? Object.assign(self.state, state) : null

    /**
     * [settings description]
     * @param {array} size [40, 40, 40, 40, 40, 40]
     * @param {string} fragment
     * @param {string} vertex
     * @type {Object}
     */
    this.settings = {
      size : [40, 40, 40, 40, 40, 40],
      uniforms : {
    		"mRefractionRatio": { type: "f", value: 1.02 },
    		"mFresnelBias": 	{ type: "f", value: 0.1 },
    		"mFresnelPower": 	{ type: "f", value: 2.0 },
    		"mFresnelScale": 	{ type: "f", value: 1.0 },
    		"tCube": 			{ type: "t", value: this.refractSphereCamera.renderTarget } //  textureCube }
    	}
    }

    //Merging settings and state if is not empty
    settings ? Object.assign(self.settings, settings) : null

    this.improvedNoise = new ImprovedNoise()

  }

  _turbulence( x, y, z ) {
        var t = -0.5
        for( var f = 1 ; f <= 100/12 ; f *= 2) {
            t += Math.abs( this.improvedNoise.noise( f * x, f * y, f * z ) / f )
        }
        return t
  }
  _geometry(){
    this.geometry = new CubeGeometry(...this.settings.size)
    this.geometry.verticesNeedUpdate = true
    this.geometry.normalsNeedUpdate = true
    this.geometry.uvsNeedUpdate = true
    this.geometry.computeFaceNormals()
    this.geometry.computeVertexNormals()
    this.geometry.computeMorphNormals()
    for( var j = 0; j < this.geometry.vertices.length; j++ ) {
         var v = this.geometry.vertices[ j ]
         var n = v.clone()
         n.normalize()
         v.copy( n )
         v.multiplyScalar( 30 )
         var f = 0.07
         //var d = - 10 * this.turbulence( f * v.x, f * v.y, f * v.z )
         var d = 6 * this.improvedNoise.noise( f * v.x, f * v.y, f * v.z )
         v.add( n.multiplyScalar( d ) )
     }
  }
  _material(){
    let self = this
    this.refractSphereCamera = new CubeCamera( 0.1, 5000, 512 );


	// create custom material for the shader
	this.material = new ShaderMaterial({
	  uniforms: 		this.settings.uniforms,
		vertexShader:   this.shader.vertexShader,
		fragmentShader: this.shader.fragmentShader
	});



  }
  _mesh(){
    this.mesh = new Mesh( this.geometry, this.material )
  }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init(){
    this.initIsActive = true;
    this._geometry()
    this._material()
    this._mesh()

    if(this.state.scene != undefined){
      this.state.scene.add( this.refractSphereCamera )
      this.state.scene.add( this.mesh )
      this.refractSphereCamera.position = this.mesh.position;

    }

    return this
  }
  /**
   * [setMaterial description]
   * @method setMaterial
   * @param  {[type]}    material [description]
   */
  setMaterial(material){
    this.material = material
  }
  /**
   * Get material helper - return the material for the object instance or from a new single instance
   * @method getMaterial
   * @return {object} THREE.Material
   */
  getMaterial(){
    this.material == undefined ? this._material() : null
    return this.material
  }
  /**
   * Get geometry helper - return the geometry for the object instance or from a new single instance
   * @method getGeometry
   * @return {object} THREE.Geometry
   */
  getGeometry(){
    this.geometry == undefined ? this._geometry() : null
    return this.geometry
  }
  /**
   * Get mesh helper - return a mesh for the object instance
   * @method getMesh
   * @return {object} THREE.Mesh
   */
  getMesh(){
    this.geometry == undefined ? this._geometry() : null
    this.material == undefined ? this._material() : null
    this.mesh == undefined ? this._mesh() : null
    return this.mesh
  }

}
