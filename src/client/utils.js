// @flow

/* eslint-disable no-console */
import 'babel-polyfill'

/**
 * [multiply description]
 * @type {[type]}
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

  getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
  }

  getDegreesToRadiant(degrees){
    return degrees * Math.PI / 180;
  }

  getLoopInterval( number, min, max ){
    return Math.abs(Math.sin(number)) * (max - min) + min
  }

  getShuffleArray(array){
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}
