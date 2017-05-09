const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')

export default {
  debug: false,
  usePostprocessing: false,
  runSpeed: 2,
  textures:{
    normal : imageNormal,
    base : imageBase
  },
  world: {
    width: window.innerWidth,
    height: window.innerHeight,
    depth : 500,
    start: 0,
    end: -400
  }
}
