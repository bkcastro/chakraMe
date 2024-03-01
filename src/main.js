import "./index.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import Rasengan from "./rasengan";

const clock = new THREE.Clock();

let container, camera, scene, renderer, controls, rasengan;

init();
animate();

function init() {
  container = document.getElementById("contianer");

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(4, 4, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  renderer.sortObjects = false;
  
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // document.body.appendChild(
  //   XRButton.createButton(renderer, { optionalFeatures: ["depth-sensing"] })
  // );

  const axesHelper = new THREE.AxesHelper(1); 
  //scene.add(axesHelper);
  rasengan = new Rasengan(); 
  scene.add(rasengan);
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // Get the elapsed time in seconds since the clock started
  const elapsedTime = clock.getElapsedTime();
  rasengan.update(elapsedTime);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer. setSize(window.innerWidth, window.innerHeight);
}
