import * as THREE from "three";
import Jutsu from "./jutsu";
// To-do be able to change particle count

const twirls = [];

// Parameters
const sphereRadius = 0.4;
const numTwirls = 30;
const pointsPerTwirl = 100;
const twistFactor = 4;
const animationSpeed = 0.02;

// Colors
const colors = [
  0xff0000, // Red
  0xff8800, // Orange
  0xffff00, // Yellow
  0x00ff00, // Green
  0x0088ff, // Light Blue
  0x0000ff, // Blue
  0x8800ff, // Purple
  0xff00ff, // Magenta
];

// Create twirls
for (let i = 0; i < numTwirls; i++) {
  // Random starting position on sphere
  const phi = Math.random() * Math.PI * 2;
  const theta = Math.random() * Math.PI;

  // Create curve points
  const points = [];
  for (let j = 0; j < pointsPerTwirl; j++) {
    const t = j / pointsPerTwirl;
    const angle = t * Math.PI * 2 * twistFactor + phi;

    // Calculate position on sphere with a twist
    const radius = sphereRadius * (0.7 + 0.3 * Math.sin(t * Math.PI * 4));
    const x = radius * Math.sin(theta + t * Math.PI) * Math.cos(angle);
    const y = radius * Math.cos(theta + t * Math.PI);
    const z = radius * Math.sin(theta + t * Math.PI) * Math.sin(angle);

    points.push(new THREE.Vector3(x, y, z));
  }

  // Create curve from points
  const curve = new THREE.CatmullRomCurve3(points);

  // Create tube geometry around curve
  const tubeGeometry = new THREE.TubeGeometry(
    curve,
    pointsPerTwirl,
    0.02,
    8,
    false
  );

  // Create material with random color
  const material = new THREE.MeshBasicMaterial({
    color: colors[i % colors.length],
    transparent: true,
    opacity: 0.8,
  });

  // Create mesh
  const twirl = new THREE.Mesh(tubeGeometry, material);

  // Store for animation
  twirls.push({
    mesh: twirl,
    phase: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 0.5,
  });
}

class Twirl extends Jutsu {
  constructor() {
    super();

    this.name = "Twirl";

    twirls.forEach((twirl) => {
      this.add(twirl.mesh);
    });
  }

  update(time) {
    // Update particle positions
    twirls.forEach((twirl) => {
      twirl.mesh.rotation.x +=
        animationSpeed * Math.sin(twirl.phase) * twirl.speed;
      twirl.mesh.rotation.y +=
        animationSpeed * Math.cos(twirl.phase) * twirl.speed;
      twirl.phase += 0.01;
      twirl.mesh.rotation.z +=
        animationSpeed * Math.sin(twirl.phase) * twirl.speed;
      twirl.phase += 0.005;
    });
  }
}

export default Twirl;
