import * as THREE from 'three'

function Axes(x = 1, y = 1) {
    return new THREE.AxesHelper(x, y);
}


function Floor() {

}

function xWalls(x, y) {

    // 
}

function Dot(radius = 0.01) {
    return new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 10), new THREE.MeshBasicMaterial({ color: "blue", wireframe: true }))
}

export { Axes, Dot }