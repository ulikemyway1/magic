import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gradToRad } from '../../helpers/modelOrientation';

const dragonModelPath = 'assets/models/dragon/DragonAttenuation.glb';
const booksModelPath = 'assets/models/books/book.glb';

export default class GLTFModelLoader {

    constructor() {
        this.loader = new GLTFLoader();
    }

    async getDragonModel() {
        return new Promise((resolve, reject) => {
          this.loader.load(dragonModelPath, (dragon) => {
            const model = dragon.scene;
            model.position.set(15, 2, 4)
            resolve(model);
          }, undefined, reject);
        });
      }

      async getBookstModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(booksModelPath, (booksModelPath) => {
                const model = booksModelPath.scene;
                model.position.set(3.5, 2, 0)
                model.scale.set(10, 10, 10)
                model.rotation.set(gradToRad(45), 0 ,0)
                resolve(model);
              }, undefined, reject);
        });
      }

}