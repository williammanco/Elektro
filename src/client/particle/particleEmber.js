// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { Vector3 } from 'three/src/Three'

const GPUParticleSystem = require('imports-loader?THREE=three!exports-loader?THREE.GPUParticleSystem!three/examples/js/GPUParticleSystem')


/**
 * ParticleEmber
 * @type Class
 */
export default class ParticleEmber {
  /**
   * [constructor description]
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  constructor(state,settings) {
    let self = this


    this.state = {
    }
    //Merging settings and state if is not empty
    state ? Object.assign(self.state, state) : null


    this.settings = {
      particleSystem : {
        maxParticles: 250000
      },
      options:{
				position: new Vector3(),
				positionRandomness: .3,
				velocity: new Vector3(),
				velocityRandomness: .5,
				color: 0xaa88ff,
				colorRandomness: .2,
				turbulence: .5,
				lifetime: 2,
				size: 5,
				sizeRandomness: 1
			},
      spawnerOptions : {
        spawnRate: 15000,
				horizontalSpeed: 1.5,
				verticalSpeed: 1.33,
				timeScale: 1
      }
    }

    //Merging settings and state if is not empty
    settings ? Object.assign(self.settings, settings) : null

this.tick = 0
  }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init(){
    this.initIsActive = true
    this._create()

    return this
  }

  _create(){
    this.particleSystem = new GPUParticleSystem(this.settings.particleSystem)

			this.state.scene.add( this.particleSystem )

			// options passed during each spawned

			this.options = this.settings.options

			this.spawnerOptions = this.settings.spawnerOptions
  }

  getParticleSystem(){
    this.particleSystem == undefined ? this._create() : null
    return this.particleSystem
  }

  render(delta){
			this.tick += delta * this.spawnerOptions.timeScale

			if ( this.tick < 0 ) this.tick = 0;

			if ( delta > 0 ) {

				this.options.position.x = Math.sin( this.tick * this.spawnerOptions.horizontalSpeed ) * 20;
				this.options.position.y = Math.sin( this.tick * this.spawnerOptions.verticalSpeed ) * 10;
				this.options.position.z = Math.sin( this.tick * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed ) * 5;
        this.particleSystem.spawnParticle( this.options );
				// for ( var x = 0; x < this.spawnerOptions.spawnRate * delta; x++ ) {
        //
				// 	// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
				// 	// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
        //
				// 	this.particleSystem.spawnParticle( this.options );
        //
				// }

			}

			this.particleSystem.update( this.tick );
  }


}
