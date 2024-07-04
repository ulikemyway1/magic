import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const cloudTexture = textureLoader.load('assets/textures/lava/cloud.png');
const lavaTexture = textureLoader.load('assets/textures/lava/lavatile.jpg');
lavaTexture.colorSpace = THREE.SRGBColorSpace;

cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

export const uniforms = {

    'fogDensity': { value: 0.05 },
    'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
    'time': { value: 1.0 },
    'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
    'texture1': { value: cloudTexture },
    'texture2': { value: lavaTexture }

};



export default class DynamicSphere {

    constructor() {
        this.material = this._createShaderMaterial();
        this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 4, 32, 16 ), this.material );
        this.sphere.position.set(-26, 0, -10)
    }

    getSphere() {
        return this.sphere;
    }

  
    _createShaderMaterial() {
        return new THREE.ShaderMaterial({

            uniforms: uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent

        });

    }

}