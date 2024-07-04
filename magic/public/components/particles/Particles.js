import * as THREE from 'three';
const particleTexturePath = 'assets/textures/particle.png';

export default class Particles {

    constructor() {
        this.loader = new THREE.TextureLoader();
        this.particalTexture = this.loader.load(particleTexturePath);
        this.particle = null;
    }

    getParticle() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = new Float32Array(30 * 3);

        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 8;
            const y = Math.random() * 4;
            const z = Math.random() * 6;
            vertices.push(x, y, z);

            colors[i * 3] = Math.random(); 
            colors[i * 3 + 1] = Math.random(); 
            colors[i * 3 + 2] = Math.random();
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(vertices, 3));
        const particle = new THREE.Points(geometry, this.createMaterial());
        this.particle = particle;
        return particle;
    }

    createMaterial() {
        this.particalTexture.colorSpace = THREE.SRGBColorSpace;
        console.log(this.particalTexture)
        const material = new THREE.PointsMaterial({ size: 3, map: this.particalTexture, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
        material.color.setHSL(1.0, 0.2, 0.5, THREE.SRGBColorSpace);


        return material
    }


}