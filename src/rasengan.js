import * as THREE from 'three';

import Shaders from './shaders';
// To-do be able to change particle count

class Rasengan extends THREE.Object3D {
    constructor() {
        super();

        this.shaders = new Shaders(); 

        const geometry = new THREE.SphereGeometry(1, 60, 60);
        const outerMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color("red") }
            },
            vertexShader: this.shaders.rasengan.outer.vertex,
            fragmentShader: this.shaders.rasengan.outer.fragment,
            transparent: true,
            opacity: 0.5,
        })

        const outerSphere = new THREE.Mesh(geometry, outerMaterial);
        //this.add(outerSphere);

        const auraMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color("red") }
            },
            vertexShader: this.shaders.rasengan.aura.vertex,
            fragmentShader: this.shaders.rasengan.aura.fragment,
            blending: THREE.AdditiveBlending,
            //side: THREE.BackSide,
            transparent: true, 
            opacity: .9
        })

        const auraSphere = new THREE.Mesh(geometry, auraMaterial);
        //this.add(auraSphere);

        this.sphereRadius = 1;

        this.particleCount = 40;
        const particleGeometry = new THREE.BufferGeometry();
        //const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: .01 });
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color("red") }
            },
            vertexShader: this.shaders.rasengan.particles.vertex, 
            fragmentShader: this.shaders.rasengan.particles.fragment,

        })

        this.positions = new Float32Array(this.particleCount * 3);
        this.velocities = [];

        for (let i = 0; i < this.particleCount; i++) {
            const vertex = new THREE.Vector3(
                (Math.random() - 0.5) * this.sphereRadius,
                (Math.random() - 0.5) * this.sphereRadius,
                (Math.random() - 0.5) * this.sphereRadius
            );
            vertex.toArray(this.positions, i * 3);

            this.velocities.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(.01));
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.particles = new THREE.Line(particleGeometry, particleMaterial);
        this.add(this.particles);
        
    }

    update(time) {

        // Update particle positions
        const positionAttribute = this.particles.geometry.attributes.position;
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            const velocity = this.velocities[i];

            positionAttribute.array[index] += velocity.x;
            positionAttribute.array[index + 1] += velocity.y;
            positionAttribute.array[index + 2] += velocity.z;

            // Check for collision with the sphere and reflect the velocity
            const position = new THREE.Vector3(positionAttribute.array[index], positionAttribute.array[index + 1], positionAttribute.array[index + 2]);
            const directionToCenter = position.clone().negate().normalize();
            const gravityStrength = .00002; // Adjust the strength of the gravitational pull
            velocity.add(directionToCenter.multiplyScalar(gravityStrength));

            if (position.length() >= this.sphereRadius/1.2) {
                const normal = position.clone().normalize();
                velocity.reflect(normal).multiplyScalar(-.1);
            }
        }

        positionAttribute.needsUpdate = true;

        //this.rotateX(.01);
        //this.rotateY(.01);
        //this.rotateZ(.05);
    }

    setParticleCount(count=0) {

    }
}

export default Rasengan;