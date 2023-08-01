import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

function createIcosahedron() {
  
}

async function loadModel() {
  const loader = new GLTFLoader();
  const globeData = await loader.loadAsync('earth/scene.gltf', 
  function ( error ) { console.log( 'An error happened' );});
  const globe = globeData.scene.children[0];
  console.log('hello world', globeData);
  globe.position.set(0, 0, 0);
  const radiansPerSecond = THREE.MathUtils.degToRad(15);
  globe.tick = (delta) => {
    globe.rotation.z += radiansPerSecond * delta;
  };
  return globe;
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera(
      35, // fov = Field Of View
      1, // aspect ratio (dummy value)
      0.1, // near clipping plane
      100, // far clipping plane
    );
  
    // move the camera back so we can view the scene
    camera.position.set(0, 0, 1.7);
  
    return camera;
}

function createLights() {
    // Create a directional light
    const light = new THREE.DirectionalLight('white', 4);
  
    // move the light right, up, and towards us
    light.position.set(8, 7, 10);
  
    return light;
}

function createScene() {
    const scene = new THREE.Scene();
  
    scene.background = new THREE.Color('black');
  
    return scene;
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
  
    renderer.useLegacyLights = true;
    return renderer;
}

const clock = new THREE.Clock();

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = clock.getDelta();
    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  };
  
  class Resizer {
    constructor(container, camera, renderer) {
      // set initial size
      setSize(container, camera, renderer);
  
      window.addEventListener('resize', () => {
        // set the size again if a resize occurs
        setSize(container, camera, renderer);
        // perform any custom actions
        this.onResize();
      });
    }
  
    onResize() {}
}

let camera;
let renderer;
let scene;
let loop;

class World {
    constructor(container) {
      camera = createCamera();
      renderer = createRenderer();
      scene = createScene();
      loop = new Loop(camera, scene, renderer);
      container.append(renderer.domElement);
      const light = createLights();
      scene.add(light);
      const resizer = new Resizer(container, camera, renderer);
    }
    async initial() {
      const globe  = await loadModel();
      loop.updatables.push(globe);
      scene.add(globe)
    }
    render() {
      // draw a single frame
      renderer.render(scene, camera);
    }
  
    start() {
      loop.start();
    }
  
    stop() {
      loop.stop();
    }
}

async function main() {
    // Get a reference to the container element
    const container = document.querySelector('#scene-container');
  
    // create a new world
    const world = new World(container);
  
    // complete async tasks
    await world.initial();

    // start the animation loop
    world.start();
}

main().catch((err) => {
  console.error(err);
});