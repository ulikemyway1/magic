import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import FBXModelLoader from './public/components/loaders/FBXModelLoader';
import GLTFModelLoader from './public/components/loaders/GLTFModelLoader';
import LilGUI from 'lil-gui';
import Particles from './public/components/particles/Particles';
import DynamicSphere, { uniforms } from './public/components/dynamicSphere/DynamicSphere';



class App {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 300);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.composer = new EffectComposer( this.renderer );
    this.renderModel = new RenderPass( this.scene, this.camera );
		this.effectBloom = new BloomPass( 1.25 );
		this.outputPass = new OutputPass();
    this.composer.addPass( this.renderModel );
		this.composer.addPass( this.effectBloom );
		this.composer.addPass( this.outputPass );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.EXRLoader = new EXRLoader();
    this.GLTFModelLoader = new GLTFModelLoader();
    this.FBXModelLoader = new FBXModelLoader();
    this.GUI = new LilGUI();
    this.particlesCreator = new Particles();
    this.dynamicSphere = null;
    this.particleMixer = null;
    this.clock = new THREE.Clock();
    this.timeline = gsap.timeline({ paused: false });
    this.pointerX = 0;
    this.pointerY = 0;
    this.windowHeightHalf = window.innerHeight / 2;
    this.windowWidthHalf = window.innerWidth / 2;
    this.magicLight = null;
    this.pointLight = null;
    this.sphereUniform = uniforms;

    this._initRenderer();
    this._addLights();
    this._addEnviroment()
    this._initOrbitsControl();
    this._initGUi();
    this._addEeventsListeners();


    this.addParticles()
    this.addParticlesInCube()
    this.addModels();
    this.addDynamicSphere();
  }


  addModels() {
    this._addCabinetModel();
    this._addDragonModel();
    // this._addMountModel();
    this._addBooksModel();
  }

  _addCabinetModel() {
    try {
      this.FBXModelLoader.getCabinetModel().then((cabinetModel) => this.scene.add(cabinetModel));
    } catch (error) {
      console.error(`Error loading cabinet model: ${error.message}`);
    }
  }

  _addDragonModel() {
    try {
      this.GLTFModelLoader.getDragonModel().then((cabinetModel) => this.scene.add(cabinetModel));
    } catch (error) {
      console.error(`Error loading cabinet model: ${error.message}`);
    }

  }

  _addMountModel() {
    try {
      this.FBXModelLoader.getMountModel().then((mountModel) => this.scene.add(mountModel));
    } catch (error) {
      console.error(`Error loading mount model: ${error.message}`);
    }
  }

  _addBooksModel() {
    try {
      this.GLTFModelLoader.getBookstModel().then((booksModel) => {
        this.scene.add(booksModel);
        this.magicLight.target = booksModel;
      });
    } catch (error) {
      console.error(`Error loading mount model: ${error.message}`);
    }
  }


  addParticles() {
    const particles = this.particlesCreator.getParticle();
    this.particles = particles
    console.log(particles)
    const positions = particles.geometry.attributes.position.array;
    const endPositions = [...positions];

    for (let i = 0; i < positions.length; i += 1) {
      if (positions[i])
        endPositions[i] = positions[i] + Math.sin(2 * i + i ** 3) * i ** 0.5 * Math.random() - 2 * Math.cos(i ^ 2);
    }

    const pointLightStartPosition = {
      x: positions[288],
      y: positions[289],
      z: positions[290]
    }

    this.pointLight.position.set(pointLightStartPosition.x, pointLightStartPosition.y, pointLightStartPosition.z)

    const pointLightEndPosition = {
      x: endPositions[288],
      y: endPositions[289],
      z: endPositions[290]
    }

    gsap.to(positions, {
      endArray: endPositions,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine',

      onUpdate: () => {
        particles.geometry.attributes.position.needsUpdate = true;
      },
    })

    gsap.to(this.pointLight.position, {
      x: pointLightEndPosition.x,
      y: pointLightEndPosition.y,
      z: pointLightEndPosition.z,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine',

    })

    this.scene.add(particles)
  }

  addParticlesInCube() {
    const particles = this.particlesCreator.getCubeParticleSystem();
    this.particles = particles
    this.scene.add(particles)
  }



  addDynamicSphere() {
    const sphere = new DynamicSphere().getSphere();
    this.dynamicSphere = sphere;
    
    gsap.to(sphere.position, {
      z: 9,
      y: -4,
      x: 0,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine',
    
    })
    this.scene.add(sphere)
  }

  _initRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.position.z = 20
    this.camera.position.y = 20
    // this.controls.maxAzimuthAngle = 2;
    // this.controls.minAzimuthAngle = 1;
    // this.controls.maxPolarAngle = 0.9;  
    // this.controls.minPolarAngle = 0.3;  
    // this.controls.enableZoom = false;
    this.renderer.setAnimationLoop(() => {
      const deltaTime = this.clock.getDelta();
      const totalDuration = 1; // Same as animation duration
      this.timeline.progress(deltaTime / totalDuration)

      this.sphereUniform[ 'time' ].value += 0.2 * deltaTime;
      // this.camera.position.x += ( this.pointerX - this.camera.position.x ) * 0.0005;
      // this.camera.position.y += ( - this.pointerY - this.camera.position.y ) * 0.0005;
      // this.camera.lookAt( this.scene.position );

      this.dynamicSphere.rotation.y += 0.8 * deltaTime;
      this.dynamicSphere.rotation.x += 0.85 * deltaTime;


      this.controls.update();
      // this.renderer.clear();
      // this.composer.render( 0.01 );
      this.renderer.render(this.scene, this.camera);

    });

    document.body.appendChild(this.renderer.domElement);
  }

  _addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const directionalLightMagic = new THREE.DirectionalLight(0x5651e0, 1);
    const pointLight = new THREE.PointLight(0x4047cf, 400);

    this.pointLight = pointLight;
    this.magicLight = directionalLightMagic;

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.scene.add(directionalLightMagic);
    this.scene.add(pointLight);
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
    this.controls.enableDamping = false;
  }


  _addEeventsListeners() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    // document.body.addEventListener( 'pointermove', this._onPointerMove.bind(this) );
  }

  _onWindowResize() {
    this.windowHeightHalf = window.innerHeight / 2;
    this.windowWidthHalf = window.innerWidth / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.composer.setSize( window.innerWidth, window.innerHeight );

  }

  _onPointerMove(event) {

    if (event.isPrimary === false) return;
    this.pointerX = event.clientX - this.windowHeightHalf;
    this.pointerY = event.clientY - this.windowWidthHalf;

  }


  _initGUi() {
    const controls = this.GUI.add({
      controls: () => {
        this.controls.enabled = !this.controls.enabled
      }
    }, 'controls').name('Toggle Orbits Controls');
  }


}

const app = new App()