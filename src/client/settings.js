import Utils from './utils.js'
const imageBase = require('./assets/img/matblender.png')
const imageNormal = require('./assets/img/fresh_snow-normal.jpg')
const textNormal = require('./assets/json/Russo One_Regular.json')

export default {
  utils : new Utils(),
  debug: false,
  usePostprocessing: false,
  runSpeed: 2,
  pressing: 0,
  pressingSource : 0,
  force : .004,
  level: 0,
  levelUpper : false,
  mouse : {
    x:0,
    y:0
  },
  audio : {
    db : 0,
    percent : 0,
    delta : 0,
    percentTween : 0,
    deltaTween : 0,
    dbTween : 0,
    source : null
  },
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
    limit : 0.15,
    time : 4
  }
}
