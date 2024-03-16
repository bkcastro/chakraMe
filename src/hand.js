
import * as THREE from 'three';
import { Axes, Dot } from './tools';
import Rasengan from './rasengan';

class Hand {
    constructor(scene, renderer) {

        this.controller1 = renderer.xr.getController(0);
        this.controller1.addEventListener('selectstart', this.onSelectStart.bind(this));
        this.controller1.addEventListener('selectend', this.onSelectEnd.bind(this));

        //this.controller.add(Axes(.02, .02));
        this.dot = Dot(.01); 
        this.controller1.add(this.dot);
        scene.add(this.controller1);

        this.scene = scene;
        this.rasengan = null; 
        this.selected = false; 
    }

    onSelectStart() {
        console.log("selecting");

       if (this.rasengan == null) {
        this.controller1.remove(this.dot);
        this.rasengan = new Rasengan(); 
        this.rasengan.scale.set(.08, .08, .08);
        this.rasengan.position.set(0, 0, 0);
        } else {
            this.rasengan.randomize();
        } 

       this.controller1.add(this.rasengan);
    }

    onSelectEnd() {
        console.log("ending select start");
    }

    update(time) {

        if (this.rasengan != null) {
            this.rasengan.update(time);
        }
    }

}

export default Hand;