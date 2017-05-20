import { Object3D, Matrix4, TextGeometry, MeshBasicMaterial, Mesh } from 'three'
import settings from '../settings.js'
import Utils from '../utils'

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
   		curveSegments: 30,
   		bevelEnabled: false
    })

  }
  setToCenter(){
    this.geometry.computeBoundingBox()
    this.geometry.applyMatrix( new Matrix4().makeTranslation( (-this.geometry.boundingBox.max.x/2), (-this.geometry.boundingBox.max.y/2), 300) )
  }
  setRotation(){
    // this.geometry.applyMatrix( new Matrix4().makeRotationX( settings.utils.getDegreesToRadiant(-45) ))
  }
  getGeometry(){
    this.geometry ? undefined : this.setGeometry()
    return this.geometry
  }
  setMaterial(){
    this.material = new MeshBasicMaterial( { color: 0x101010 } )
  }
  setMesh(){
    this.setGeometry()
    this.setMaterial()
    this.mesh = new Mesh(this.geometry, this.material)
    this.add(this.mesh)
  }
}
