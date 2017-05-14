import { Object3D, Matrix4, TextGeometry, MeshLambertMaterial, SpotLight, Mesh } from 'three'
import settings from '../settings.js'
import Utils from '../utils'

// require('three/examples/js/utils/FontUtils')


export default class TextCustom extends Object3D{
  constructor(text,size){
    super()
    this.text = text
    this.size = size
    this.setGeometry()
  }

  setGeometry(){
    this.geometry = new TextGeometry(this.text, {
      font: settings.fonts.normal,
      size: this.size,
      height: 1,
   		curveSegments: 20,
   		bevelEnabled: false
    })

//     let textShapes = THREE.FontUtils.generateShapes( this.text, {
//       font: settings.fonts.normal,
//       size: this.size,
//       height: 1,
//    		curveSegments: 20,
//    		bevelEnabled: false
//     } );
// this.geometry = new THREE.ShapeGeometry( textShapes );
// textMesh.geometry = text;
// textMesh.geometry.needsUpdate = true;
  }
  setToCenter(){
    this.geometry.computeBoundingBox()
    this.geometry.applyMatrix( new Matrix4().makeTranslation( -this.geometry.boundingBox.max.x/2, -100, 100) )
  }
  setRotation(){
    this.geometry.applyMatrix( new Matrix4().makeRotationX( settings.utils.getDegreesToRadiant(-45) ))
  }
  // setPosition(){
  //   this.geometry.computeBoundingBox()
  //   // this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( window.innerWidth - this.geometry.boundingBox.max.x, -this.geometry.boundingBox.max.y/2, 50) )
  //   //this.geometry.matrixWorld.setPosition(new THREE.Vector3(100, 100, 100))
  //   let xFromCenter = (window.innerWidth/2) - this.geometry.boundingBox.max.x
  //   this.geometry.translate( xFromCenter, 0, 0 )
  // }
  getGeometry(){
    this.geometry ? undefined : this.setGeometry()
    return this.geometry
  }
  setMaterial(){
    this.material = new MeshLambertMaterial({color: 0x7777ff})
  }
  setLight(){
    this.spotLight = new SpotLight(0xffffff)
    this.spotLight.position.set(-30, 60, 200)
    this.spotLight.castShadow = true
    this.add(this.spotLight)
  }
  setMesh(){
    this.setGeometry()
    this.setMaterial()
    this.setLight()
    this.mesh = new Mesh(this.geometry, this.material)
    this.add(this.mesh)

  }
}
