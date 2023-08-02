import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function createIcosahedron() {
  const geometry = new THREE.IcosahedronGeometry(0.07, 0);
  const material = new THREE.MeshStandardMaterial( {
    metalness: 1,   // between 0 and 1
    roughness: 0.35, // between 0 and 1
  } );
  const icosahedron = new THREE.Mesh(geometry, material);
  icosahedron.position.set(0.25, 0.2, -0.2);
  const radiansPerSecond = THREE.MathUtils.degToRad(15);
  icosahedron.tick = (delta) => {
    icosahedron.rotation.z += radiansPerSecond * delta;
    icosahedron.rotation.x += radiansPerSecond * delta;
    icosahedron.rotation.y += radiansPerSecond * delta;
  };
  icosahedron.update = (time) => {
    icosahedron.position.y = Math.cos( time ) * 0.02 + 0.2;
  };
  icosahedron.castShadow = true;
  icosahedron.receiveShadow = false;
  
  return icosahedron;
}

function createTorus() {
  const geometry = new THREE.TorusGeometry();
  const material = new THREE.MeshStandardMaterial( {
    metalness: 1,   // between 0 and 1
    roughness: 0.35, // between 0 and 1
  } );
  const torus = new THREE.Mesh(geometry, material);
  torus.scale.set(0.06, 0.06, 0.06);
  torus.rotation.x = THREE.MathUtils.degToRad(-30);
  torus.rotation.y = THREE.MathUtils.degToRad(-20);
  torus.rotation.z = THREE.MathUtils.degToRad(30);
  torus.position.set(-0.2, 0.23, 0.2);
  torus.update = (time) => {
    torus.position.y = Math.cos( time ) * 0.03 + 0.2;
  };
  torus.castShadow = true;
  torus.receiveShadow = false;
  return torus;
}

function createSphere() {
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshStandardMaterial( {
    metalness: 1,   // between 0 and 1
    roughness: 0.35, // between 0 and 1
  } );
  const sphere = new THREE.Mesh(geometry, material);
  sphere.scale.set(0.08, 0.08, 0.08);
  sphere.position.set(-0.1, 0.5, -0.3);
  sphere.update = (time) => {
    sphere.position.y = Math.sin( time ) * 0.02 + 0.2;
  };
  sphere.castShadow = true;
  sphere.receiveShadow = false;
  return sphere;
}

function createDodecahedron() {
  const geometry = new THREE.DodecahedronGeometry();
  const material = new THREE.MeshStandardMaterial( {
    metalness: 1,   // between 0 and 1
    roughness: 0.35, // between 0 and 1
  } );
  const dodecahedron = new THREE.Mesh(geometry, material);
  dodecahedron.scale.set(0.05, 0.05, 0.05);
  dodecahedron.rotation.x = THREE.MathUtils.degToRad(-30);
  dodecahedron.rotation.y = THREE.MathUtils.degToRad(-20);
  dodecahedron.position.set(-0.15, -0.34, 0.3);
  const radiansPerSecond = THREE.MathUtils.degToRad(15);
  dodecahedron.tick = (delta) => {
    dodecahedron.rotation.z += radiansPerSecond * delta;
    dodecahedron.rotation.x -= radiansPerSecond * delta;
    dodecahedron.rotation.y -= radiansPerSecond * delta;
  };
  dodecahedron.update = (time) => {
    dodecahedron.position.y = Math.sin( time ) * 0.03 - 0.17;
  };
  dodecahedron.castShadow = true;
  dodecahedron.receiveShadow = false;
  return dodecahedron;
}

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  // damping and auto rotation require
  // the controls to be updated each frame

  // this.controls.autoRotate = true;
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;
  controls.minDistance = 1.7;
  controls.maxDistance = 1.7;
  controls.minPolarAngle = THREE.MathUtils.degToRad(60); // default
  controls.maxPolarAngle = THREE.MathUtils.degToRad(120); // default
  controls.tick = () => controls.update();

  return controls;
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
  globe.castShadow = false;
  globe.receiveShadow = true;
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
    // enabling casting shadows
    light.castShadow = true;
    // move the light right, up, and towards us
    light.position.set(8, 7, 10);
  
    return light;
}

function createAmbientLights() {
  const ambientlight = new THREE.AmbientLight( 0x404040, 2.5 ); // soft white light
  return ambientlight;
}
function createScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );
    scene.background = new THREE.Color('black');
  
    return scene;
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // setting type
    renderer.shadowMap.enabled = true;
    return renderer;
}

const clock = new THREE.Clock();

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.updatables2 = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();
      this.update();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  update() {
    const time = clock.getElapsedTime();
    for (const object of this.updatables2) {
      object.update(time);
    }
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
      const controls = createControls(camera, renderer.domElement);
      const light = createLights();
      const ambientlight = createAmbientLights();
      const icosahedron = createIcosahedron();
      const torus = createTorus();
      const dodecahedron = createDodecahedron();
      const sphere = createSphere();
      loop.updatables.push(icosahedron, dodecahedron, controls);
      loop.updatables2.push(icosahedron, torus, dodecahedron, sphere);
      scene.add(light, icosahedron, torus, dodecahedron, sphere, ambientlight);
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