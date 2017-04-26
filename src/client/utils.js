// @flow

/* eslint-disable no-console */
import 'babel-polyfill'

/**
 * Utils
 * @type Class
 */
export default class Utils {

  getRandomMultiply(multiply){
    multiply == undefined ? multiply = 45 : null
    return Math.floor(Math.random()*11)*multiply
  }
  getRandomSign(){
    return Math.sign(Math.random() < 0.5 ? -1 : 1)
  }
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getDegreesToRadiant(degrees){
    return degrees * Math.PI / 180;
  }
}
