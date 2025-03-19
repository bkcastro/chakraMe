import * as THREE from "three";
import Twirl from "./twirl";

class Hand {
  constructor(scene, renderer) {
    this.controller1 = renderer.xr.getController(0);
    this.controller1.addEventListener(
      "selectstart",
      this.onSelectStart.bind(this)
    );
    this.controller1.addEventListener("selectend", this.onSelectEnd.bind(this));

    //this.controller.add(Axes(.02, .02));
    this.dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 10, 10),
      new THREE.MeshBasicMaterial({ color: "blue", wireframe: true })
    );
    this.controller1.add(this.dot);
    scene.add(this.controller1);

    this.scene = scene;
    this.jutsu = new Twirl();
    //this.jutsu.visible = false;
    this.scene.add(this.jutsu);

    renderer.xr.addEventListener("sessionstart", () => {
      this.jutsu.scale.set(0.08, 0.08, 0.08);
      this.jutsu.position.set(0, 0, 0);

      scene.remove(this.jutsu);
      this.controller1.add(this.jutsu);
    });

    renderer.xr.addEventListener("sessionend", () => {
      this.jutsu.scale.set(1, 1, 1);
      this.jutsu.position.set(0, 0, 0);

      this.controller1.remove(this.jutsu);
      scene.add(this.jutsu);
    });
  }

  onSelectStart() {
    this.jutsu.visible = !this.jutsu.visible;
  }

  onSelectEnd() {
    console.log("ending select start");
  }

  update(time) {
    if (this.jutsu.visible) this.jutsu.update(time);
  }
}

export default Hand;
