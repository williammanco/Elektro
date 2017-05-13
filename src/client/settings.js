const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
const textNormal = require('./assets/json/helvetiker_regular.typeface.json')

export default {
  debug: false,
  usePostprocessing: false,
  runSpeed: 2,
  textures:{
    normal : imageNormal,
    base : imageBase
  },
  fonts: {
    normal : textNormal
  },
  world: {
    width: window.innerWidth,
    height: window.innerHeight,
    depth : 1000,
    start: 0,
    end: -400
  },
  explode: {
    limit : 0.001,
    time : 8
  }
}
