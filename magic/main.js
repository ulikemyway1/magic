import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



class App {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer =  new THREE.WebGLRenderer({antialias: true });
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this._initRenderer();
    this._addEeventsListeners()
    this._initOrbitsControl()
    this.addGeometry()
  }

  _initRenderer() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  }

  _initOrbitsControl() {
			this.controls.target.set( 0, 0.5, 0 );
			this.controls.update();
			this.controls.enablePan = false;
			this.controls.enableDamping = true;
  }

  addGeometry() {

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
   
    function animate() {

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    
      this.renderer.render( this.scene, this.camera );
      this.controls.update();
    }
    this.renderer.setAnimationLoop( animate.bind(this) );
    this.scene.add( cube );
    this.camera.position.z = 5;
  }

  _addEeventsListeners() {
    window.addEventListener( 'resize', this._onWindowResize.bind(this) );
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }


}

const app = new App()