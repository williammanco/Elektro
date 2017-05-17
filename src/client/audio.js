// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import settings from './settings.js'
import Emitter from 'event-emitter-es6'
const sound = require('./assets/mp3/sound.mp3')

export default class Audio {
  constructor(){
    settings.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.load()
    this.events()
  }
  events(){
    let self = this
    settings.emitter.on('app.audioLoaded', function(){
      self.connectAudio()
    })
  }
  load(){
    let self = this
    let request = new XMLHttpRequest()
    request.open('GET', sound, true)
    request.responseType = 'arraybuffer'
    request.addEventListener('load', function(event,self){
      settings.audioCtx.decodeAudioData( event.target.response, function ( buffer ) {
        let source = settings.audioCtx.createBufferSource()
        source.buffer = buffer
        settings.audio.source = source
        settings.emitter.emit('app.audioLoaded')

      }, function ( e ) { console.log( e ) } )
    }, false)
    request.send()

  }
  base64ToArrayBuffer(base64) {
      var binaryString =  window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++)        {
          var ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
      }
      return bytes;
  }

  connectAudio(){



    // let mooSoundDataUri = "data:audio/ogg;base64,T2dnUwACAAAAAAAAAAAtBwAAAAAAAPot4ZgBHgF2b3JiaXMAAAAAARErAAAAAAAAuIgAAAAAAACZAU9nZ1MAAAAAAAAAAAAALQcAAAEAAABxp4/HCzv///////////+1A3ZvcmJpcysAAABYaXBoLk9yZyBsaWJWb3JiaXMgSSA ... ";
    // let mooSound = new Audio(mooSoundDataUri);
    // let impulseResponse = "T2dnUwACAAAAAAAAAADAewAAAAAAALxEBMUBHgF2b3JiaXMAAAAAAkSsAAAAAAAAAHECAAAAAAC4AU9nZ1MAAAAAAAAAAAAAwHsAAAEAAADuq7S9ElT/////////////////////kQN2b3JiaXMrAAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgM ... ";
    // let reverbNode = settings.audioCtx.createConvolver();
    //  var reverbSoundArrayBuffer = this.base64ToArrayBuffer(impulseResponse);
    //  audioContext.decodeAudioData(reverbSoundArrayBuffer,
    //    function(buffer) {
    //      reverbNode.buffer = buffer;
    //    },
    //    function(e) {
    //      alert("Error when decoding audio data" + e.err);
    //    }
    //  );



    this.gainNode = settings.audioCtx.createGain()


    this.gainNode.gain.value = 1 + settings.pressing
    settings.audio.source.connect(this.gainNode)
    this.gainNode.connect(settings.audioCtx.destination)
    settings.audio.source.start(0)


    // let bufferSize = 2 * settings.audioCtx.sampleRate,
    //     noiseBuffer = settings.audioCtx.createBuffer(1, bufferSize, settings.audioCtx.sampleRate),
    //     output = noiseBuffer.getChannelData(0);
    // for (let i = 0; i < bufferSize; i++) {
    //     output[i] = Math.random() * 2 - 1;
    // }
    //
    // let gainNoiseNode = settings.audioCtx.createGain()
    // let whiteNoise = settings.audioCtx.createBufferSource()
    // gainNoiseNode.gain.value = settings.pressing
    // whiteNoise.buffer = noiseBuffer
    // whiteNoise.loop = true
    // whiteNoise.start(0)
    // whiteNoise.connect(gainNoiseNode)
    // gainNoiseNode.connect(settings.audioCtx.destination)
  }
}
