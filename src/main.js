import "./index.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import Rasengan from "./rasengan";

const clock = new THREE.Clock();

let container, camera, scene, renderer, controls, rasengan = null;

var inputsFields = document.querySelectorAll('input'); 

inputsFields.forEach((input, i) => {
  input.id = i; 
  input.onchange = action;
});


init();
animate();

function init() {

  if (rasengan != null) {return 0}

  container = document.getElementById("container");
  scene = new THREE.Scene();

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
  camera.aspect = container.getBoundingClientRect().width / window.innerHeight;
  camera.updateProjectionMatrix();  

  renderer.setSize(container.getBoundingClientRect().width, window.innerHeight);
}


function action(event) {
  if(event != null && rasengan != null) {
    
    switch(event.target.id) {
      case "0": 

        var newColor = new THREE.Color(event.target.value); 
        rasengan.outerAuraMaterial.uniforms.uColor.value = newColor; 
        break; 
      case "1": 
        var scale = event.target.value/50; 
        rasengan.outerAura.scale.set(scale, scale, scale);
        break; 
      case "2": 
        rasengan.outerAura.visible = !rasengan.outerAura.visible;
        break;
      case "3": 
        var newColor = new THREE.Color(event.target.value); 
        rasengan.innerAuraMaterial.uniforms.uColor.value = newColor; 
        break;
      case "4": 
      var scale = event.target.value/50; 
        rasengan.innerAura.scale.set(scale, scale, scale);
        break;
      case "5": 
        rasengan.innerAura.visible = !rasengan.innerAura.visible;
        break;
      case "6":
        var newParticles = null;
        console.log("hi")
        if (rasengan.particles instanceof THREE.Points) {
          rasengan.add(new THREE.Points(this.particleGeometry, this.particleMaterial))
        } else {
          rasengan.add(new THREE.Points(this.particleGeometry, this.particleMaterial))
        }
      break;
      case "7":
      break;
      case "8":
      break;
      case "9":
      break;
    }
  }
}