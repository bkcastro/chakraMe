import * as THREE from "three";

import Shaders from "./shaders";
// To-do be able to change particle count

class Rasengan extends THREE.Object3D {
  constructor() {
    super();

    this.shaders = new Shaders();

    const geometry = new THREE.SphereGeometry(1, 60, 60);
    this.outerAuraMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("red") },
      },
      vertexShader: this.shaders.rasengan.outerAura.vertex,
      fragmentShader: this.shaders.rasengan.outerAura.fragment,
      transparent: true,
      opacity: 0.5,
    });

    this.outerAura = new THREE.Mesh(geometry, this.outerAuraMaterial);
    this.add(this.outerAura);
    this.outerAura.visible = false;
    
    this.innerAuraMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("black") },
      },
      vertexShader: this.shaders.rasengan.innerAura.vertex,
      fragmentShader: this.shaders.rasengan.innerAura.fragment,
    });

    this.innerAura= new THREE.Mesh(geometry, this.innerAuraMaterial);
    this.innerAura.scale.set(.25, .25, .25);
    this.add(this.innerAura);

    this.sphereRadius = 1;

    this.particleCount = 200;
    this.particleGeometry = new THREE.BufferGeometry();
    //const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: .01 });
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color("red") },
        innerColor: { value: new THREE.Color("red") },
        outerColor: { value: new THREE.Color("blue") },
      },
      vertexShader: this.shaders.rasengan.particles.vertex,
      fragmentShader: this.shaders.rasengan.particles.fragment,
    });

    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = [];

    for (let i = 0; i < this.particleCount; i++) {
      const vertex = new THREE.Vector3(
        (Math.random() - 0.5) * this.sphereRadius/4,
        (Math.random() - 0.5) * this.sphereRadius/4,
        (Math.random() - 0.5) * this.sphereRadius/4
      );
      vertex.toArray(this.positions, i * 3);

      this.velocities.push(
        new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).multiplyScalar(0.01)
      );
    }

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.particles = new THREE.Line(this.particleGeometry, this.particleMaterial);
    this.add(this.particles);
  }

  update(time) {
    // Update particle positions
    
    const positionAttribute = this.particles.geometry.attributes.position;
    if (positionAttribute == null) {return}
    for (let i = 0; i < this.particleCount; i++) {
      const index = i * 3;
      const velocity = this.velocities[i];

      positionAttribute.array[index] += velocity.x;
      positionAttribute.array[index + 1] += velocity.y;
      positionAttribute.array[index + 2] += velocity.z;

      // Check for collision with the sphere and reflect the velocity
      const position = new THREE.Vector3(
        positionAttribute.array[index],
        positionAttribute.array[index + 1],
        positionAttribute.array[index + 2]
      );

      const directionToCenter = position.clone().negate().normalize();
      const gravityStrength = 0.00001; // Adjust the strength of the gravitational pull
      velocity.add(directionToCenter.multiplyScalar(gravityStrength));

      if (position.length() >= this.sphereRadius / 1.2) {
        const normal = position.clone().normalize();
        velocity.reflect(normal);
      }
    }

    positionAttribute.needsUpdate = true;

    //this.rotateX(0.01);
    //this.rotateY(0.01);
    //this.rotateZ(0.05);
  }
}

export default Rasengan;
