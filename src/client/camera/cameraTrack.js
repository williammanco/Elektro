// @flow

/* eslint-disable no-console */
import 'babel-polyfill'
import { Vector3, CatmullRomCurve3 }  from 'three/src/Three'

/**
* CameraTrack
* @type Class
*/
export default class CameraTrack {
  
  /**
  * [constructor description]
  * @param  {[type]} state [description]
  * @return {[type]}       [description]
  */
  constructor(state,settings) {
    let self = this

    /**
    * [state description]
    * @type {Object}
    */
    this.state = {
    }
    state ? Object.assign(self.state, state) : null

    /**
    * [settings description]
    * @type {Object}
    */
    this.settings = {
      spline : [
        [0,0,300],
        [0,0,200],
        [-20,0,80],
        [-200,0,0],
        [-100,0,-300]
      ],
      lookAt : [0,0,0]
    }
    settings ? Object.assign(self.settings, settings) : null


  }

  init(){
    let self = this
    let camera = this.state.camera
    this.points = []
    for ( let i = 0; i < this.settings.spline.length; i ++ ) {
      this.points.push(new Vector3(...self.settings.spline[i]))
    }
    console.log(this.points)
    this.spline = new  CatmullRomCurve3(this.points);
    this.camPosIndex = 0;
    camera.position.z = 5;
    return this

  }

  loop() {
    let self = this
    let camera = this.state.camera
    this.camPosIndex++;
    // if (this.camPosIndex > 1000) {
    //   this.camPosIndex = 0;
    // }
    let camPos = this.spline.getPoint(this.camPosIndex / 1000);
    let camRot = this.spline.getTangent(this.camPosIndex / 1000);

    camera.position.x = camPos.x;
    camera.position.y = camPos.y;
    camera.position.z = camPos.z;

    camera.rotation.x = camRot.x;
    camera.rotation.y = camRot.y;
    camera.rotation.z = camRot.z;

    camera.lookAt(new Vector3(...self.settings.lookAt));
  }


}
