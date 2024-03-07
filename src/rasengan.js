import * as THREE from "three";
import Jutsu from "./jutsu";
// To-do be able to change particle count

const shaders = {
  innerAura: {
    vertex: `
                varying vec3 vertexNormal; 

                void main() {
                    vertexNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
                }
`,
    fragment: `
                uniform vec3 uColor;

                varying vec3 vertexNormal; 

                void main() {
                    float intensity = pow(1.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(uColor, 1.0) * intensity;
                }
`,
  },
  outerAura: {
    vertex: `
                varying vec3 vertexNormal; 

                void main() {
                    vertexNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
                }
`,
    fragment: `
                uniform vec3 uColor;

                varying vec3 vertexNormal; 

                void main() {
                    float intensity = pow(1.0 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(uColor, 1.0) * intensity;
                }

`,
  },
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

class Rasengan extends Jutsu {
  constructor() {
    super();

    const geometry = new THREE.SphereGeometry(1, 60, 60);
    this.outerAuraMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("white") },
      },
      vertexShader: shaders.outerAura.vertex,
      fragmentShader: shaders.outerAura.fragment,
      transparent: true,
      opacity: 0.5,
    });

    this.outerAura = new THREE.Mesh(geometry, this.outerAuraMaterial);
    this.add(this.outerAura);

    this.innerAuraMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("black") },
      },
      vertexShader: shaders.innerAura.vertex,
      fragmentShader: shaders.innerAura.fragment,
    });

    this.innerAura = new THREE.Mesh(geometry, this.innerAuraMaterial);
    this.innerAura.scale.set(0.25, 0.25, 0.25);
    this.add(this.innerAura);

    this.particleRadius = 1;
    this.particleSpeed = 1;
    this.particleCount = 200;
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

    this.rotationSpeed = {
      x: 1,
      y: 1,
      z: 0,
    };
  }

  createParticles() {
    if (this.position != null) {
      this.remove(this.particles);
    }

    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = [];

    for (let i = 0; i < this.particleCount; i++) {
      const vertex = new THREE.Vector3(
        ((Math.random() - 0.5) * this.particleRadius) / 4,
        ((Math.random() - 0.5) * this.particleRadius) / 4,
        ((Math.random() - 0.5) * this.particleRadius) / 4
      );
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

  update(time) {
    // Update particle positions

    if (this.particles != null) {
      const positionAttribute = this.particles.geometry.attributes.position;
      if (positionAttribute == null) {
        return;
      }
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
        // Apply the strength of the gravitational pull
        velocity.add(directionToCenter.multiplyScalar(this.gravityStrength));

        if (position.length() >= this.particleRadius / 1.2) {
          const normal = position.clone().normalize();
          velocity.reflect(normal);
        }
      }

      positionAttribute.needsUpdate = true;
    }

    this.rotateX(this.rotationSpeed.x / 100);
    this.rotateY(this.rotationSpeed.y / 100);
    this.rotateZ(this.rotationSpeed.z / 100);
  }
}

export default Rasengan;
