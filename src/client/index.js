// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import settings from './settings.js'
import Canvas from './canvas'
import Utils from './utils'
import DecibelMeter from 'decibel-meter'
import APP_CONTAINER_SELECTOR from '../shared/config'
import Emitter from 'event-emitter-es6'
import sono from 'sono';
import 'sono/effects';
import 'sono/utils'

const base = require('./assets/mp3/sound.mp3')
const kick = require('./assets/mp3/kick.mp3')
const meter = new DecibelMeter('unique-id')
const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
require('./assets/css/main.sass')

export default class Elektro {
  constructor(){
    this.state = {
      audio : {}
    }
    settings.emitter = new Emitter()

    this.mouse = {}
    const self = this
    this.canvas = new Canvas(window.innerWidth,window.innerHeight)
    this.onLoaderComplete()
    // meter.sources.then(sources => {
    //     meter.connect(sources[0])
    // })
    // meter.listen()
    // meter.on('sample', (dB, percent, value) => {
    //   settings.audio.db = dB
    //   settings.audio.delta = value
    //   settings.audio.percent = percent
    //   TweenMax.to(settings.audio, 1, { percentTween : percent, deltaTween : value , dbTween : dB  })
    // })
    this.squareWave = sono.create('square')
    this.squareWave.volume = 0
    this.squareWave.frequency = 10
    this.squareWave.effects = [ sono.reverb(), sono.echo()]
    this.base = sono.create({
    	id: 'base',
    	url: [base],
    	loop: true,
    	volume: 1,
    	effects: [
    		sono.reverb()
    	]
    })
    this.kick = sono.create(kick)
    this.base.play()
    this.squareWave.play()
    this.events()
    this.setInfoText()
  }

  setInfoText(){

    this.infoDiv = document.createElement("div")
    this.infoDiv.setAttribute("id", "info-container")
    this.infoDiv.innerHTML = `
      <div class="title">Nervous Ball</div>
      <div class="description">forever clicking ...</div>
      <div class="level">
        <div class="current inline">level <span id="current-level"></span></div>
        <div class="max inline">max <span id="max-level"></span></div>
      </div>
    `
    document.body.appendChild(this.infoDiv)
    document.getElementById('current-level').innerHTML = settings.level
    document.getElementById('max-level').innerHTML = ':('
    if(window.localStorage.level != undefined) {
      window.localStorage.level = settings.level
    }

  }

  events(){
    const self = this

    document.addEventListener( 'mousemove', function(event){
      let x = ( event.clientX / window.innerWidth ) * 2 - 1;
      let y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      settings.mouse = { x:x, y:y }
    }, false )

    settings.emitter.on('app.levelUpper', function(){
      if(window.localStorage.getItem('level') < settings.level) {
        window.localStorage.setItem('level', settings.level)
        document.getElementById('max-level').innerHTML = settings.level
      }
      self.kick.play()
      document.getElementById('current-level').innerHTML = settings.level
    })
  }

  onLoaderComplete() {
   this.canvas.loader()
   this.update()
  }

  update() {
    if(this.squareWave){
      this.squareWave.volume = settings.pressing*0.3
    }
    this.canvas.update(this.state)
    this.canvas.render()
    requestAnimationFrame( this.update.bind(this) )
  }
}

const app = new Elektro()
