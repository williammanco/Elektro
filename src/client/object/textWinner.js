import { Object3D, TextGeometry, MeshLambertMaterial, SpotLight, Mesh } from 'three'
import settings from '../settings.js'
import Utils from '../utils'

export default class textWinner extends Object3D{
  constructor(){
    super()
    this.setGeometry()
  }

  setGeometry(){
    this.geometry = new TextGeometry('DDD', {
      font: settings.fonts.normal,
      size: 100,
      height: 1,
   		curveSegments: 20,
   		bevelEnabled: false,
   		bevelThickness: 0,
   		bevelSize: 0,
   		bevelSegments: 0
    })

    this.geometry.computeBoundingBox()
    this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -this.geometry.boundingBox.max.x/2, -this.geometry.boundingBox.max.y/2, 50) );



  }
  getGeometry(){
    this.geometry ? undefined : this.setGeometry()
    return this.geometry
  }
  setMaterial(){
    this.material = new MeshLambertMaterial({color: 0x7777ff})
  }
  setLight(){
    this.spotLight = new SpotLight(0xffffff)
    this.spotLight.position.set(-30, 60, 60)
    this.spotLight.castShadow = true
    this.add(this.spotLight)
  }
  setMesh(){
    this.setGeometry()
    this.setMaterial()
    this.mesh = new Mesh(this.geometry, this.material)
    this.add(this.mesh)

  }
}
