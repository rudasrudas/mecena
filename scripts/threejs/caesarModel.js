import * as THREE       from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader }   from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import * as dat         from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/libs/dat.gui.module.js";
var scene, camera, renderer;

function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight,1,50000);
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;

    camera.position.x = -5;
    camera.position.y = 9;
    camera.position.z = 20;

    // var gui = new dat.GUI();
    // const guiCam = gui.addFolder('Camera Rotation')
    // guiCam.add(camera.rotation, 'x').step(0.05);
    // guiCam.add(camera.rotation, 'y').step(0.05);
    // guiCam.add(camera.rotation, 'z').step(0.05);

    // const guiPos = gui.addFolder('Camera Position')
    // guiPos.add(camera.position, 'x').step(0.05);
    // guiPos.add(camera.position, 'y').step(0.05);
    // guiPos.add(camera.position, 'z').step(0.05);

    var hlight = new THREE.AmbientLight (0xffffff, 100);
    scene.add(hlight);
    scene.background = null;

    // var pointLight = new THREE.PointLight(0xff0000, 2);
    // pointLight.position.set(1, 1, 1);
    // pointLight.intensity = 5;

    // gui.add(pointLight.position, 'x').step(0.1);
    // gui.add(pointLight.position, 'y').step(0.1);
    // gui.add(pointLight.position, 'z').step(0.1);

    var material = new THREE.MeshStandardMaterial();
    material.color = new THREE.Color(0x292929);
    material.metalness = 0.7;
    material.roughness = 0.2;



    var canvasElm = document.querySelector('#hero-canvas');

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: canvasElm });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var model;
    var loader = new GLTFLoader();
    loader.load('./static/objects/caesar/scene.gltf', function(gltf){
        model = gltf.scene.children[0];
        model.scale.set(1, 1, 1);
        // model.rotation.set(-1.45, 0.05, 0);
        model.rotation.z = 5;
        console.log(model);

        // const guiMod = gui.addFolder('Model Rotation')
        // guiMod.add(model.rotation, 'x').step(0.05);
        // guiMod.add(model.rotation, 'y').step(0.05);
        // guiMod.add(model.rotation, 'z').step(0.05);

        // gui.add(model.scale, 'x').step(0.05);
        // gui.add(model.scale, 'y').step(0.05);
        // gui.add(model.scale, 'z').step(0.05);

        scene.add(gltf.scene);
    });

    function animate(){
        requestAnimationFrame(animate);
        
        if(model){
            // model.rotation.z -= 0.002;
            document.getElementById('hero-canvas').style.filter = 'hue-rotate(' + (new Date().getMilliseconds() / 1) + 'deg) saturate(2)';
        }
        renderer.render(scene, camera);

    }

    var oldMouseX = 0;
    var newMouseX = 0;
    var oldMouseY = 0;
    var newMouseY = 0;
    document.getElementById('hero-canvas').addEventListener("mousemove", function(e){
        newMouseX = e.pageX;
        let xDiff = newMouseX - oldMouseX;
        model.rotation.z += xDiff/10000;
        oldMouseX = newMouseX;

        // newMouseY = e.pageY;
        // let yDiff = newMouseY - oldMouseY;
        // if (yDiff > 0){
        //     if(model.rotation.x < -1.6){
        //         model.rotation.x += yDiff/1000;
        //     }
        // }
        // else if (yDiff < 0){
        //     if(model.rotation.x > -2){
        //         model.rotation.x += yDiff/1000;
        //     }
        // }
        // oldMouseY = newMouseY;
    });

    animate();
}

init();