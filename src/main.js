import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import Rasengan from "./rasengan";
import Chidori from "./chidori";
import { ARButton } from "./ARButton";
import Hand from "./hand";

const clock = new THREE.Clock();

let container,
  camera,
  scene,
  renderer,
  controls,
  chidori,
  center,
  hand,
  rasengan = null;

var objects = [];

init();
animate();

function init() {
  if (rasengan != null) {
    return 0;
  }

  container = document.getElementById("container");
  scene = new THREE.Scene();

  center = new THREE.Vector3(0, 0, 0);

  camera = new THREE.PerspectiveCamera(
    50,
    container.getBoundingClientRect().width / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(4, 4, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.getBoundingClientRect().width, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  renderer.sortObjects = false;
  renderer.setClearColor(new THREE.Color(0xffffff));

  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  document.body.appendChild(
    XRButton.createButton(renderer, { optionalFeatures: [] })
  );

  container.appendChild(ARButton.createButton(render, {}));
  const axesHelper = new THREE.AxesHelper(0.4);
  scene.add(axesHelper);
  rasengan = new Rasengan();
  //scene.add(rasengan);
  hand = new Hand(scene, renderer);
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // Get the elapsed time in seconds since the clock started
  const elapsedTime = clock.getElapsedTime();
  if (rasengan != null) {
    rasengan.update(elapsedTime);
  }

  if (hand != null) {
    hand.update(elapsedTime);
  }

  objects.forEach((object) => {
    object.update(elapsedTime);
  });
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.getBoundingClientRect().width / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.getBoundingClientRect().width, window.innerHeight);
}
