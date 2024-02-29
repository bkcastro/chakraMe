import "./index.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";

const clock = new THREE.Clock();

let canvas, camera, scene, renderer, controls;

init();
animate();

function init() {
  canvas = document.getElementById("myCanvas");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x808080);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1, 1);

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.innerWidth, canvas.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  renderer.sortObjects = false;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  document.body.appendChild(
    XRButton.createButton(renderer, { optionalFeatures: ["depth-sensing"] })
  );

  window.addEventListener("resize", onWindowResize);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // Get the elapsed time in seconds since the clock started
  const elapsedTime = clock.getElapsedTime();

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = canvas.innerWidth / canvas.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
