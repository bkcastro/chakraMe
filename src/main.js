import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import Rasengan from "./rasengan";
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

// Get the input UI and map to an action
var inputsFields = document.querySelectorAll("input");
inputsFields.forEach((input, i) => {
  input.onchange = action(i);
})

var button = document.getElementById("randomButton"); 

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

  document.body.appendChild( XRButton.createButton( renderer, { 'optionalFeatures': [] } ) );

  renderer.xr.addEventListener('sessionstart', () => {
    if (rasengan != null) {
      scene.remove(rasengan); 
    }
  });

  const axesHelper = new THREE.AxesHelper(.4);
  scene.add(axesHelper);
  rasengan = new Rasengan(); 
  scene.add(rasengan);
  hand = new Hand(scene, renderer);
  window.addEventListener("resize", onWindowResize);

  button.addEventListener("click", () => {
  rasengan.randomize(); 
  updateInput();
})
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
  })
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.getBoundingClientRect().width / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.getBoundingClientRect().width, window.innerHeight);
}

function updateInput() {
  inputsFields.forEach((input, i) => {
  input.id = i;

  switch (input.id) {
    case "0":
      input.value =
        "#" + rasengan.outerAuraMaterial.uniforms.uColor.value.getHexString();
      break;
    case "1":
      input.value = rasengan.outerAura.scale.x * 50;
      break;
    case "2":
      input.checked = rasengan.outerAura.visible;
      break;
    case "3":
      input.value =
        "#" + rasengan.innerAuraMaterial.uniforms.uColor.value.getHexString();
      break;
    case "4":
      input.value = rasengan.innerAura.scale.x * 50;
      break;
    case "5":
      input.checked = rasengan.innerAura.visible;
      break;
    case "6":
      input.checked = rasengan.renderAsParticles;
      break;
    case "7":
      input.value = rasengan.particleCount;
      break;
    case "8":
      input.value = rasengan.particleSpeed * 50;
      break;
    case "9":
      input.value = rasengan.particleMaterial.uniforms.uSize.value;
      break;
    case "10":
      input.value = rasengan.particleRadius * 50;
      break;
    case "11":
      input.value =
        "#" +
        rasengan.particleMaterial.uniforms.innerColor.value.getHexString();
      break;
    case "12":
      input.value =
        "#" +
        rasengan.particleMaterial.uniforms.outerColor.value.getHexString();
      break;
    case "13":
      input.value = rasengan.particles.visible;
      break;
    case "14":
      input.value = rasengan.rotationSpeed.x * 50;
      break;
    case "15":
      input.value = rasengan.rotationSpeed.y * 50;
      break;
    case "16":
      input.value = rasengan.rotationSpeed.z * 50;
      break;
  }
});
}

updateInput();

function action(id) {
  const actions = {
    0: (event) =>
      (rasengan.outerAuraMaterial.uniforms.uColor.value = new THREE.Color(
        event.target.value
      )),
    1: (event) =>
      rasengan.outerAura.scale.set(
        event.target.value / 50,
        event.target.value / 50,
        event.target.value / 50
      ),
    2: (event) => (rasengan.outerAura.visible = !rasengan.outerAura.visible),
    3: (event) =>
      (rasengan.innerAuraMaterial.uniforms.uColor.value = new THREE.Color(
        event.target.value
      )),
    4: (event) =>
      rasengan.innerAura.scale.set(
        event.target.value / 50,
        event.target.value / 50,
        event.target.value / 50
      ),
    5: (event) => (rasengan.innerAura.visible = !rasengan.innerAura.visible),
    6: (event) => {
      rasengan.renderAsParticles = !rasengan.renderAsParticles;
      rasengan.createParticles();
    },
    7: (event) => {
      rasengan.particleCount = event.target.value;
      rasengan.createParticles();
    },
    8: (event) => {
      rasengan.particleSpeed = event.target.value / 50;
      rasengan.createParticles();
    },
    9: (event) =>
      (rasengan.particleMaterial.uniforms.uSize.value = event.target.value / 2),
    10: (event) => {
      rasengan.particleRadius = event.target.value / 50;
      rasengan.createParticles();
    },
    11: (event) =>
      (rasengan.particleMaterial.uniforms.innerColor.value = new THREE.Color(
        event.target.value
      )),
    12: (event) =>
      (rasengan.particleMaterial.uniforms.outerColor.value = new THREE.Color(
        event.target.value
      )),
    13: (event) => (rasengan.particles.visible = !rasengan.particles.visible),
    14: (event) => (rasengan.rotationSpeed.x = event.target.value / 50),
    15: (event) => (rasengan.rotationSpeed.y = event.target.value / 50),
    16: (event) => (rasengan.rotationSpeed.z = event.target.value / 50),
    17: (event) => {
      rasengan.randomize(); 
      updateInput();
    }
  };

  return actions[id];
}