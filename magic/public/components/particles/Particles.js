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
        const colors = []

        const color = new THREE.Color();

        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 8;
            const y = Math.random() * 4;
            const z = Math.random() * 6;
            vertices.push(x, y, z);


            if (i > 92 && i < 95) {
                color.setRGB( 64 / 255, 71 / 255, 207 / 255 );
                colors.push( color.r, color.g, color.b );

            } else {

                color.setHSL( 6 / 100, 1.0, 0.5 );
                colors.push( color.r, color.g, color.b );
            }
        }


        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const particle = new THREE.Points(geometry, this.createMaterial());
        this.particle = particle;
        return particle;
    }


     randomSpherePoint(radius) {
        let u = Math.random();
        let v = Math.random();
        let theta = 2 * Math.PI * u;
        let phi = Math.acos(2 * v - 1);
        let x = radius * Math.sin(phi) * Math.cos(theta);
        let y = radius * Math.sin(phi) * Math.sin(theta);
        let z = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
    }


    getCubeParticleSystem() {
        const geometry = new THREE.BufferGeometry();;
        const vertices = [];
        const colors = [];
    
        const color = new THREE.Color();
    
        for (let i = 0; i < 1000; i++) {
            const x = Math.abs(Math.random() * 5 - 5) + 10 ;
            const y = Math.abs(Math.random() * 5- 5) + 10;
            const z = Math.abs(Math.random() * 5 - 5) + 10;


            // const x = Math.abs(Math.random() * 5 - 5) + 10 ;
            // const y = Math.abs(Math.random() * 5- 5) + 10;
            // const z = Math.abs(Math.random() * 5 - 5) + 10;
            vertices.push(x, y, z);
    
            if (i > 92 && i < 95) {
                color.setRGB(64 / 255, 71 / 255, 207 / 255);
                colors.push(color.r, color.g, color.b);
            } else {
                color.setHSL(6 / 100, 1.0, 0.5);
                colors.push(color.r, color.g, color.b);
            }
        }
    
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
        const particle = new THREE.Points(geometry, this.createMaterial());
        this.particle = particle;
        return particle;
    }
    

    createMaterial() {
        this.particalTexture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.PointsMaterial({ size: 3, map: this.particalTexture, blending: THREE.AdditiveBlending, depthTest: false, transparent: true, vertexColors: true });
     
        return material
    }


}