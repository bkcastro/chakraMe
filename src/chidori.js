import * as THREE from "three";
import Jutsu from "./jutsu";

const shaders = {
  particles: {
    vertex: `
                attribute float size;
                uniform vec3 innerColor; 
                uniform vec3 outerColor; 
                uniform float uSize;

                varying vec3 vInnerColor; 
                varying vec3 vOuterColor; 
                varying vec3 vColor;
                varying vec3 vPosition;
                void main() {
                    vInnerColor = innerColor; 
                    vOuterColor = outerColor;
                    vPosition = position;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = uSize;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
    fragment: `
                varying vec3 vPosition;
                varying vec3 vInnerColor; 
                varying vec3 vOuterColor; 

                void main() {
                    float distance = length(vPosition);
                    vec3 color = mix(vInnerColor, vOuterColor, distance);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
  },
};

class Chidori extends Jutsu {
  constructor() {
    super();

    this.particleRadius = 1;
    this.particleSpeed = 1;
    this.particleCount = 10;
    this.renderAsParticles = false;
    this.positions = null;
    this.velocities = null;
    this.gravityStrength = 0.00001;
    this.particleGeometry = new THREE.BufferGeometry();
    //const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: .01 });
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        innerColor: { value: new THREE.Color("blue") },
        outerColor: { value: new THREE.Color("red") },
        uSize: { value: 3.0 },
      },
      vertexShader: shaders.particles.vertex,
      fragmentShader: shaders.particles.fragment,
    });

    this.createParticles();
  }

  createParticles() {
    if (this.position != null) {
      this.remove(this.particles);
    }

    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = [];

    for (let i = 0; i < this.particleCount; i++) {
      var vertex;
      if (i % 5 == 0) {
        vertex = new THREE.Vector3(0, 0, 0);
      } else {
        vertex = new THREE.Vector3(
          this.positions[(i - 1) * 3 + 0] + Math.random() / 5,
          this.positions[(i - 1) * 3 + 1] + Math.random() / 5,
          this.positions[(i - 1) * 3 + 2] + Math.random() / 5
        );
      }

      vertex.toArray(this.positions, i * 3);

      this.velocities.push(
        new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).multiplyScalar(0.01 * this.particleSpeed)
      );
    }

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );

    if (this.renderAsParticles) {
      this.particles = new THREE.Points(
        this.particleGeometry,
        this.particleMaterial
      );
    } else {
      this.particles = new THREE.Line(
        this.particleGeometry,
        this.particleMaterial
      );
    }

    this.add(this.particles);
  }

  upate() {}
}

export default Chidori;
