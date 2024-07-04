import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gradToRad } from '../../helpers/modelOrientation';

const dragonModelPath = 'assets/models/dragon/DragonAttenuation.glb';

export default class GLTFModelLoader {

    constructor() {
        this.loader = new GLTFLoader();
    }

    async getDragonModel() {
        return new Promise((resolve, reject) => {
          this.loader.load(dragonModelPath, (dragon) => {
            const model = dragon.scene;
            resolve(model);
          }, undefined, reject);
        });
      }

}