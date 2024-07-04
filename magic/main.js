import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import FBXModelLoader from './public/components/loaders/FBXModelLoader';
import GLTFModelLoader from './public/components/loaders/GLTFModelLoader';
import LilGUI from 'lil-gui';
import Particles from './public/components/particles/Particles';



class App {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.EXRLoader = new EXRLoader();
    this.GLTFModelLoader = new GLTFModelLoader();
    this.FBXModelLoader = new FBXModelLoader();
    this.GUI = new LilGUI();
    this.particlesCreator = new Particles();
    this.particleMixer = null;
    this.clock = new THREE.Clock();
    this._initRenderer();
    this._addLights();
    this._addEnviroment()
    this._initOrbitsControl();
    this._initGUi();
    this._addEeventsListeners();
    // this.addCabinetModel()
    // // this.addMountModel()
    // this.addDragonModel()
    this.addParticles()
  }

  addCabinetModel() {
    try {
      this.FBXModelLoader.getCabinetModel().then((cabinetModel) => this.scene.add(cabinetModel));
    } catch (error) {
      console.error(`Error loading cabinet model: ${error.message}`);
    }
  }

  addDragonModel() {
    try {
      this.GLTFModelLoader.getDragonModel().then((cabinetModel) => this.scene.add(cabinetModel));
    } catch (error) {
      console.error(`Error loading cabinet model: ${error.message}`);
    }

  }

  addMountModel() {
    try {
      this.FBXModelLoader.getMountModel().then((mountModel) => this.scene.add(mountModel));
    } catch (error) {
      console.error(`Error loading mount model: ${error.message}`);
    }
  }

  addParticles() {
    console.log(this.particlesCreator.getParticle())
    const particles = this.particlesCreator.getParticle()

    const mixer = new THREE.AnimationMixer(particles);
    this.particleMixer = mixer;

    const startPosition = new THREE.Vector3(0, 0, 0);
    const endPosition = new THREE.Vector3(10, 5, -5);
    const track = new THREE.VectorKeyframeTrack('.position', [0, 1], [
      startPosition.x, startPosition.y, startPosition.z,
      endPosition.x, endPosition.y, endPosition.z,
    ]);

    const clip = new THREE.AnimationClip('particleMove', 1, [track]);
    const action = mixer.clipAction(clip);
    action.play();

    this.scene.add(particles)
  }

  _initRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.position.set(10, 20, 15)
    this.scene.fog = new THREE.FogExp2(0x000000, 0.001);
    this.renderer.setAnimationLoop(() => {
      const deltaTime = this.clock.getDelta();
      this.particleMixer.update(deltaTime)
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    });

    document.body.appendChild(this.renderer.domElement);
  }

  _addLights() {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    this.scene.add(ambientLight);
  }

  _addEnviroment() {
    this.EXRLoader.load('assets/textures/cave.exr', (env) => {
      env.mapping = THREE.EquirectangularReflectionMapping;
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.exposure = 1;
      const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(env);
      const exrBackground = exrCubeRenderTarget.texture;
      this.scene.background = exrBackground;
    });
  }

  _initOrbitsControl() {
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
  }


  _addEeventsListeners() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _initGUi() {
    const sayHello = this.GUI.add({
      sayHello: () => {
        console.log('Hello!')
      }
    }, 'sayHello').name('Say Hello');
  }


}

const app = new App()