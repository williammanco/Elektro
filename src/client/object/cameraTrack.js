import { Object3D, Vector3, CatmullRomCurve3, PerspectiveCamera } from 'three'
import settings from '../settings.js'
import Utils from '../utils.js'

export default class CameraTrack extends PerspectiveCamera{
  constructor() {
    super()
    let self = this
    this._options = {
      spline : [
        [0,20,0],
        [300,25,0],
        [300,20,300],
        [0,25,0],
        [0,20,0]
      ],
      lookAt : [0,0,0]
    }

    this._points = []
    for ( let i = 0; i < this._options.spline.length; i ++ ) {
      this._points.push(new Vector3(...self._options.spline[i]))
    }
    this._spline = new CatmullRomCurve3(this._points)
    this._spline.closed = true
    this.camPosIndex = 0;
    this.position.z = 5;
  }
  update() {
    let self = this
    if(this._spline){

      this.camPosIndex += 1;
      if (this.camPosIndex > 1000) {
         this.camPosIndex = 0;
      }
      let camPos = this._spline.getPoint(this.camPosIndex / 1000);
      let camRot = this._spline.getTangent(this.camPosIndex / 1000);

      this.position.x = camPos.x;
      this.position.y = camPos.y;
      this.position.z = camPos.z;

      this.rotation.x = camRot.x;
      this.rotation.y = camRot.y;
      this.rotation.z = camRot.z;

      this.lookAt(new Vector3(...self._options.lookAt));
    }

  }
}
