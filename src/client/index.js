// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import settings from './settings.js'
import Canvas from './canvas'
import Utils from './utils'
import DecibelMeter from 'decibel-meter'

const meter = new DecibelMeter('unique-id')
const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
require('./assets/css/main.css')

export default class Elektro {
  constructor(){
    this.state = {
      audio : {}
    }
    this.canvas = new Canvas(window.innerWidth,window.innerHeight)
    this.onLoaderComplete()
    meter.sources.then(sources => {
        meter.connect(sources[0])
    })
    meter.listen()
    meter.on('sample', (dB, percent, value) => this.state.audio.percent = value ) // display current dB level
  }

  onLoaderComplete() {
   this.canvas.loader()
   this.update()
  }

  update() {
    this.canvas.update(this.state)
    this.canvas.render()
    requestAnimationFrame( this.update.bind(this) )
  }
}

const app = new Elektro()
