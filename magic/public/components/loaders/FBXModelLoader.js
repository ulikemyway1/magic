import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { gradToRad } from '../../helpers/modelOrientation';

const cabinetModelPath = 'assets/models/cabinet/painted_wooden_cabinet_02_2k.fbx';
const mountModelPath = 'assets/models/mount/mountainside_1k.fbx';


export default class FBXModelLoader {

    constructor() {
        this.loader = new FBXLoader();
    }

    async getCabinetModel() {
        return new Promise((resolve, reject) => {
          this.loader.load(cabinetModelPath, (cabinet) => {
            cabinet.position.set(-10, 0, 0);
            cabinet.scale.set(0.05, 0.05, 0.05);
            cabinet.rotation.set(0, gradToRad(45), 0)
            resolve(cabinet);
          }, undefined, reject);
        });
      }

      async getMountModel() {
        return new Promise((resolve, reject) => {
          this.loader.load(mountModelPath, (mount) => {
            mount.position.set(-5, 0, 0);
            mount.scale.set(0.05, 0.05, 0.05);
            mount.rotation.set(0, gradToRad(45), 0)
            resolve(mount);
          }, undefined, reject);
        });
      }

     
}