// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import settings from './settings.js'
import Canvas from './canvas'
import Utils from './utils'
import DecibelMeter from 'decibel-meter'
import APP_CONTAINER_SELECTOR from '../shared/config'
import sono from 'sono';
import 'sono/effects';
import 'sono/utils'
import 'blast-text'

const base = require('./assets/mp3/sound.mp3')
const kick = require('./assets/mp3/kick.mp3')
const meter = new DecibelMeter('unique-id')
const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
require('./assets/sass/main.sass')

export default class App {
  constructor(){
    this.state = {
      audio : {}
    }
    console.log('%c |||| ', 'background: #222; color: #fff; padding: 10px 0px; font-weight: bold; line-height: 50px')
    this.mouse = {}
    const self = this
    this.canvas = new Canvas(window.innerWidth,window.innerHeight)
    this.utils = new Utils()
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
    	volume: 1.5
    })
    this.kick = sono.create(kick)
    this.base.play()
    this.squareWave.play()
    this.events()
    this.setInfoText()
    this.removeIntro()
  }

  setInfoText(){

    this.infoDiv = document.createElement("div")
    this.infoDiv.setAttribute("id", "html-content")
    this.infoDiv.innerHTML = `
      <div id="fastBlack"></div>
      <div id="info-container">
        <div class="title">Nervous Ball</div>
        <div class="description">forever clicking ...</div>
        <div class="level">
          <div class="current inline">level <span id="current-level"></span></div>
        </div>
      </div>
      <div id="spot">
        <div>never</div>
        <div>ending</div>
        <div>click</div>
      </div>
      <div id="repeatClick">
        <div>Do not stop clicking, nervous the ball</div>
      </div>
    `
    $('body').append(this.infoDiv)
    $('#current-level').html(':(')
    if(window.localStorage.level != undefined) {
      window.localStorage.level = settings.level
    }
    $('#spot div')
    .blast({ delimiter: "character" })
    .css('visibility','visible')

    $('#repeatClick div')
    .blast({ delimiter: "character" })
    .css('visibility','visible')

  }

  removeIntro(){
    let caosLetter = this.utils.getShuffleArray($('#spot .blast'))
    this.timelineIntro = new TimelineMax({ onComplete : function(){
      setTimeout(function(){
        settings.introOut = true
        if(!settings.firstClick){
          TweenMax.staggerTo('#repeatClick .blast', 2, { opacity: 1, ease: Power4.easeIn },.02,1)
        }
      },2000)
    }})
    this.timelineIntro
    .staggerFromTo('#spot .blast', 2, {opacity:0},{ opacity: 1, ease: Power4.easeIn },.02,1)
    .to('#fastBlack', 4, { opacity: 0,ease: Power4.easeInOut },3)
    .staggerTo(caosLetter, 2, { opacity: 0, ease: Power4.easeInOut },.05)
  }

  events(){
    const self = this

    $(window).on('mouseup touchstart', (e) => {
      if(settings.pressingSource < 1.5){
        settings.pressingSource += .03
        // TweenMax.to(settings,.1,{ pressing : '+=.01'})
      }
      if(settings.introOut && !settings.firstClick){
        let caosLetter = this.utils.getShuffleArray($('#repeatClick .blast'))
        TweenMax.staggerTo(caosLetter, 2, { opacity: 0, ease: Power4.easeInOut },.05)
      }
      settings.firstClick = true
    })

    $(window).on( 'mousemove touchmove', function(event){
      let x = ( event.clientX / window.innerWidth ) * 2 - 1;
      let y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      settings.mouse = { x:x, y:y }
    }, false )

    $(window).on('app.levelUpper', function(){
      self.kick.play()
      $('#current-level').html(settings.level)
    })

  }

  onLoaderComplete() {
   this.canvas.loader()
   this.update()
  }

  update() {
    if(this.squareWave){
      this.squareWave.frequency = 10+settings.pressing*10
      this.squareWave.volume = settings.pressing*0.3
    }
    this.canvas.update(this.state)
    this.canvas.render()
    requestAnimationFrame( this.update.bind(this) )
  }
}

const app = new App()
