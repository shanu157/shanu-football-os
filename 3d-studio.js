import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const host = document.querySelector('#threeCanvas');
const status = document.querySelector('#studioStatus');
const label = document.querySelector('#viewerLabel');
const movementInfo = document.querySelector('#movementInfo');

let scene, camera, renderer, controls, model;
let rotating = true;
let view = 'football';
let clock = new THREE.Clock();

function material(color) {
  return new THREE.MeshStandardMaterial({color, roughness: 0.65});
}

function part(parent, geometry, color, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material(color));
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function createFootballer() {
  const group = new THREE.Group();
  const skin = 0xd9a078;
  const shirt = 0x9bdc42;
  const shorts = 0x183e2a;
  const limb = new THREE.CapsuleGeometry(0.12, 0.65, 4, 8);

  part(group, new THREE.SphereGeometry(0.22, 24, 16), skin, 0, 1.8, 0);
  part(group, new THREE.CapsuleGeometry(0.3, 0.65, 6, 12), shirt, 0, 1.15, 0);
  part(group, new THREE.BoxGeometry(0.52, 0.25, 0.32), shorts, 0, 0.65, 0);

  for (const side of [-1, 1]) {
    part(group, limb, skin, side * 0.39, 1.12, 0);
    part(group, limb, skin, side * 0.17, 0.12, 0);
    part(group, new THREE.BoxGeometry(0.23, 0.12, 0.4), 0xffffff,
      side * 0.17, -0.3, 0.08);
  }

  const ball = part(group, new THREE.SphereGeometry(0.22, 24, 16),
    0xffffff, 0.55, -0.25, 0.5);
  ball.name = 'football';
  group.userData.ball = ball;
  group.userData.arms = group.children.slice(3, 5);
  group.userData.legs = group.children.slice(5, 7);
  return group;
}

function createAnatomy() {
  const group = new THREE.Group();
  const body = 0xe0a47e;
  const muscle = 0xd34b42;
  part(group, new THREE.SphereGeometry(0.21, 24, 16), body, 0, 1.8, 0);
  part(group, new THREE.CapsuleGeometry(0.3, 0.7, 6, 12), body, 0, 1.15, 0);
  part(group, new THREE.BoxGeometry(0.52, 0.25, 0.32), body, 0, 0.65, 0);

  for (const side of [-1, 1]) {
    part(group, new THREE.SphereGeometry(0.17, 20, 16),
      muscle, side * 0.2, 1.38, 0.2);
    part(group, new THREE.CapsuleGeometry(0.11, 0.5, 4, 8),
      body, side * 0.4, 1.12, 0);
    part(group, new THREE.SphereGeometry(0.14, 20, 16),
      muscle, side * 0.17, 0.28, 0.15);
    part(group, new THREE.CapsuleGeometry(0.13, 0.55, 4, 8),
      body, side * 0.17, 0.1, 0);
  }
  return group;
}

function build() {
  const width = host.clientWidth || 320;
  const height = 420;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x071b13);

  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(3, 2.5, 6);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(width, height);
  host.replaceChildren(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x234331, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 5, 5);
  scene.add(light);

  const floor = new THREE.GridHelper(8, 16, 0x41664c, 0x183e2a);
  floor.position.y = -0.48;
  scene.add(floor);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.7, 0);
  controls.minDistance = 3;
  controls.maxDistance = 10;

  changeView(view);
  status.textContent = '3D viewer ready. Drag to rotate and zoom to explore.';
  animate();
}

function changeView(next) {
  view = next;
  if (model) scene.remove(model);
  model = view === 'football' ? createFootballer() : createAnatomy();
  scene.add(model);
  label.textContent = view === 'football'
    ? 'FOOTBALL MOVEMENT MODEL'
    : 'SIMPLIFIED MUSCLE ANATOMY';
  document.querySelectorAll('[data-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
  });
}

let movement = 'dribble';

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  if (model && rotating) {
    model.rotation.y += 0.004;
    if (view === 'football') {
      const legs = model.userData.legs;
      legs.forEach((leg, i) => {
        leg.rotation.x = Math.sin(t * 3 + i * Math.PI) * 0.22;
      });
      model.userData.ball.position.x =
        0.55 + Math.sin(t * 3) * 0.15;
    }
  }
  controls?.update();
  renderer.render(scene, camera);
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => changeView(button.dataset.view));
});

document.querySelectorAll('[data-move]').forEach(button => {
  button.addEventListener('click', () => {
    movement = button.dataset.move;
    const descriptions = {
      dribble: 'Dribbling: practise close ball control with both feet.',
      pass: 'Passing: practise accurate short passes with a partner.',
      sprint: 'Running posture: learn relaxed arm action and controlled steps.',
      balance: 'Balance: practise stable single-leg control with support nearby.'
    };
    movementInfo.textContent = descriptions[movement];
    document.querySelectorAll('[data-move]').forEach(b =>
      b.classList.toggle('active', b === button));
  });
});

document.querySelector('#rotateBtn').addEventListener('click', event => {
  rotating = !rotating;
  event.target.textContent = rotating ? 'Pause rotation' : 'Resume rotation';
});

document.querySelector('#resetBtn').addEventListener('click', () => {
  camera.position.set(3, 2.5, 6);
  controls.target.set(0, 0.7, 0);
  controls.update();
});

try {
  build();
  window.addEventListener('resize', () => {
    if (!renderer) return;
    const width = host.clientWidth || 320;
    camera.aspect = width / 420;
    camera.updateProjectionMatrix();
    renderer.setSize(width, 420);
  });
} catch (error) {
  console.error(error);
  status.textContent = '3D viewer could not start. Check WebGL support.';
}
