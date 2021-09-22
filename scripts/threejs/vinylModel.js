import * as THREE       from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader }   from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import * as dat         from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js";
var scene, camera, renderer;

function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight,1,50000);
    camera.rotation.x = -0.85;
    camera.rotation.y = 0.7;
    camera.rotation.z = -0.05;

    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;

    // var gui = new dat.GUI();
    // gui.add(camera.rotation, 'x').step(0.05);
    // gui.add(camera.rotation, 'y').step(0.05);
    // gui.add(camera.rotation, 'z').step(0.05);

    var hlight = new THREE.AmbientLight (0x404040, 100);
    scene.add(hlight);
    scene.background = null;

    var canvasElm = document.querySelector('#hero-canvas');

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: canvasElm });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var model;
    var loader = new GLTFLoader();
    loader.load('./static/objects/vinyl/scene.gltf', function(gltf){
        model = gltf.scene.children[0];
        model.scale.set(5, 5, 5);
        model.rotation.set(-1.45, 0.05, 0);

        // gui.add(model.rotation, 'x').step(0.05);
        // gui.add(model.rotation, 'y').step(0.05);
        // gui.add(model.rotation, 'z').step(0.05);

        // gui.add(model.scale, 'x').step(0.05);
        // gui.add(model.scale, 'y').step(0.05);
        // gui.add(model.scale, 'z').step(0.05);

        scene.add(gltf.scene);
    });

    function animate(){
        requestAnimationFrame(animate);
        if(model)
            model.rotation.z += 0.01;
        renderer.render(scene, camera);

    }

    animate();
}

init();