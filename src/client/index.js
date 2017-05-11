// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import settings from './settings.js'
import Canvas from './canvas'
import Utils from './utils'

const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
require('./assets/css/main.css')

export default class Elektro {
  constructor(){
    this.canvas = new Canvas(window.innerWidth,window.innerHeight)
    this.onLoaderComplete()
  }

  onLoaderComplete() {
   this.canvas.loader()
   this.update()
  }

  update() {
    this.canvas.update()
    this.canvas.render()
    requestAnimationFrame( this.update.bind(this) )
  }
}

const app = new Elektro()
