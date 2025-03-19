import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import Rasengan from "./rasengan";
import Twirl from "./twirl";
import Hand from "./hand";

let camera, scene, renderer, controls, hand, clock, jutsu;

init();
animate();

function init() {
  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper(1, 1));

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(4, 4, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  renderer.sortObjects = false;
  renderer.setClearColor(new THREE.Color(0x111111));

  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.update();

  document.body.appendChild(
    XRButton.createButton(renderer, { optionalFeatures: [] })
  );

  hand = new Hand(scene, renderer);
  window.addEventListener("resize", onWindowResize);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") toggleJutsu();
  });
}

function toggleJutsu() {
  jutsu.visible = !jutsu.visible;
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // Get the elapsed time in seconds since the clock started
  const elapsedTime = clock.getElapsedTime();

  hand.update(elapsedTime);

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
