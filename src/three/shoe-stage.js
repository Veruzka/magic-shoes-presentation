// The one 3D shoe that travels through the whole story. A see-through 3D layer
// fixed over the page (clicks pass straight through it), with the shoe posed by
// src/three/shoe-director.js from the list in src/data/shoe-path.js.
//
// The shoe: the 3D model at /assets/models/shoe.glb (folder public/assets/models/).
// Until that file exists, a stand-in follows the same path: the Sketch drawing
// on a thin card, plus a small block for each part so breaking apart still works.
// TODO: replace the stand-in with the real model when the .glb arrives.
//
// It only draws a new picture when the pose changes (never in a constant loop).
import './shoe-stage.css';
import * as THREE from 'three';
import shoeUrl from '../assets/shoe-sketch.png';
import { shoeParts } from '../data/shoe-parts.js';
import { REST } from '../data/shoe-path.js';
import { slice, ease } from '../core/scene.js';

const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/shoe.glb`;
const CAMERA_DISTANCE = 8;
const FOV = 30; // degrees, top to bottom
const SKETCH_RATIO = 846 / 1356; // height / length of the Sketch drawing
const EXPLODE_DISTANCE = 0.55; // how far parts travel when fully apart, in shoe lengths
const SHOE_ON_FOOT = 1.9; // how long a shoe is on the sprite, compared with its foot

const turnsBetween = (a, b) => b - a - Math.round(b - a); // the short way round

// Blends two placements (used to slide a shoe from centre stage onto a foot).
function mix(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    pitch: a.pitch + (b.pitch - a.pitch) * t,
    yaw: a.yaw + turnsBetween(a.yaw, b.yaw) * t,
    tilt: a.tilt + (b.tilt - a.tilt) * t,
  };
}

export function shoeStage() {
  const element = document.createElement('div');
  element.className = 'shoe-stage';
  element.setAttribute('aria-hidden', 'true');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  element.append(renderer.domElement);

  const labelLayer = document.createElement('div');
  labelLayer.className = 'shoe-stage__labels';
  element.append(labelLayer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_DISTANCE);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8cbb5, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  // root: where the shoe is and how big · yawGroup: which way it faces ·
  // tiltGroup: toe up or down · then the model, 1 unit long, centred.
  const root = new THREE.Group();
  const yawGroup = new THREE.Group();
  const tiltGroup = new THREE.Group();
  root.add(yawGroup);
  yawGroup.add(tiltGroup);
  scene.add(root);

  // The shoes on the figures' feet in the concept (two players, a pair each).
  // They only show while pose.pair > 0. Until the .glb arrives, each one is a
  // simple solid shoe shape (not the flat card), so it still reads as a shoe
  // from the front and the side; with the model, each is a copy of it.
  const FEET = 4;
  const footMaterials = [];
  const footShoes = Array.from({ length: FEET }, () => {
    const r = new THREE.Group();
    const yaw = new THREE.Group();
    const tilt = new THREE.Group();
    r.add(yaw);
    yaw.add(tilt);
    r.visible = false;
    scene.add(r);
    return { root: r, yaw, tilt };
  });
  let fadeMain = () => {}; // fades the big shoe out as the small ones take over

  // A solid stand-in shoe, 1 unit long, toe toward -x: a sole and a rounded upper.
  function standInShoe() {
    const upper = new THREE.Shape();
    upper.moveTo(0.48, -0.15);
    upper.lineTo(-0.42, -0.15);
    upper.quadraticCurveTo(-0.52, -0.14, -0.5, -0.05);
    upper.quadraticCurveTo(-0.46, 0.04, -0.2, 0.08);
    upper.quadraticCurveTo(0.05, 0.12, 0.16, 0.22);
    upper.lineTo(0.44, 0.22);
    upper.quadraticCurveTo(0.52, 0.1, 0.48, -0.15);
    const upperMat = new THREE.MeshStandardMaterial({ color: 0xefe6d6, roughness: 0.75, transparent: true });
    const soleMat = new THREE.MeshStandardMaterial({ color: 0xfbfaf8, roughness: 0.9, transparent: true });
    footMaterials.push(upperMat, soleMat);
    const upperGeo = new THREE.ExtrudeGeometry(upper, { depth: 0.34, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 10 });
    upperGeo.translate(0, 0, -0.17);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.08, 0.42), soleMat);
    sole.position.y = -0.19;
    const shoe = new THREE.Group();
    shoe.add(new THREE.Mesh(upperGeo, upperMat), sole);
    return shoe;
  }

  // Each part: its object, where it sits when whole, which way it flies out, and its label.
  let parts = [];
  let fadeWhole = () => {}; // the stand-in card fades back as the parts fly out
  let lastPose = { ...REST, opacity: 0 };

  function makeLabels(list) {
    labelLayer.replaceChildren();
    list.forEach((part) => {
      const label = document.createElement('div');
      label.className = 'shoe-stage__label';
      label.innerHTML = '<span class="shoe-stage__dot"></span><span class="shoe-stage__name"></span>';
      label.querySelector('.shoe-stage__name').textContent = part.data.name;
      labelLayer.append(label);
      part.label = label;
    });
  }

  // The stand-in: the Sketch drawing on a card, and one block per part.
  function buildStandIn() {
    const texture = new THREE.TextureLoader().load(shoeUrl, () => render(lastPose));
    texture.colorSpace = THREE.SRGBColorSpace;
    const cardMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(1, SKETCH_RATIO), cardMaterial);
    tiltGroup.add(card);
    const sharedShoe = standInShoe();
    footShoes.forEach((f) => f.tilt.add(sharedShoe.clone()));
    let explodeFade = 1;
    let pairFade = 1;
    const applyFade = () => (cardMaterial.opacity = explodeFade * pairFade);
    fadeWhole = (explode) => {
      explodeFade = 1 - 0.65 * explode;
      applyFade();
    };
    fadeMain = (shown) => {
      pairFade = shown;
      applyFade();
    };

    parts = shoeParts.map((data) => {
      // Where the part sits, from its point on the drawing (0,0 top-left → 1,1 bottom-right).
      const home = new THREE.Vector3(data.point.x - 0.5, (0.5 - data.point.y) * SKETCH_RATIO, 0.02);
      const dir = new THREE.Vector3(home.x, home.y, 0.35).normalize();
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.055, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x3a332b, roughness: 0.6 }),
      );
      tiltGroup.add(block);
      return { data, object: block, home, dir, standIn: true };
    });
    makeLabels(parts);
  }

  // The real model. Each part must be a separate top-level object named after
  // its id in src/data/shoe-parts.js (fsr, mpu, minima, xiao, power, case).
  function useModel(gltf) {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 1 / Math.max(size.x, size.z); // 1 unit long
    model.scale.setScalar(scale);
    model.position.copy(center).multiplyScalar(-scale);
    tiltGroup.add(model);
    footShoes.forEach((f, i) => {
      const twin = model.clone(true);
      if (i % 2 === 0) twin.scale.z *= -1; // far feet get the mirrored (other-foot) shoe
      twin.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          footMaterials.push(o.material);
        }
      });
      f.tilt.add(twin);
    });
    fadeMain = (shown) => (root.visible = shown > 0.02);
    parts = shoeParts
      .map((data) => {
        const object = model.getObjectByName(data.id);
        if (!object) return null;
        const home = object.position.clone();
        const partCenter = new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
        const dir = (data.explode ? new THREE.Vector3(...data.explode) : partCenter.sub(center)).normalize();
        return { data, object, home, dir, modelScale: scale };
      })
      .filter(Boolean);
    makeLabels(parts);
    render(lastPose);
  }

  async function load() {
    try {
      const response = await fetch(MODEL_URL);
      const type = response.headers.get('content-type') ?? '';
      if (!response.ok || type.includes('text/html')) throw new Error('no model yet');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '');
      useModel(gltf);
    } catch {
      buildStandIn();
      render(lastPose);
    }
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render(lastPose);
  }

  const point = new THREE.Vector3();

  function place(r, yaw, tilt, at) {
    r.position.set(at.x, at.y, 0);
    r.scale.setScalar(at.scale);
    r.rotation.x = THREE.MathUtils.degToRad(at.pitch);
    yaw.rotation.y = at.yaw * Math.PI * 2;
    tilt.rotation.z = -THREE.MathUtils.degToRad(((at.tilt + 540) % 360) - 180); // the toe is on the left of the drawing
  }

  // Puts the shoe in a pose and draws one picture.
  function render(pose) {
    lastPose = pose;
    element.style.opacity = String(pose.opacity);
    if (pose.opacity <= 0.001) return; // nothing to draw

    const viewH = 2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const viewW = viewH * camera.aspect;
    const length = pose.size * viewH;
    const single = {
      x: (pose.ax * viewW) / 2 + pose.x * length,
      y: (pose.ay * viewH) / 2 + pose.y * length,
      scale: length,
      pitch: pose.pitch,
      yaw: pose.yaw + pose.turn,
      tilt: pose.tilt,
    };
    // On the figures' feet: the big shoe hands over to one small shoe per foot.
    // Each slides from centre stage onto its foot, seen the way the camera sees
    // that foot: from the side (toe the way the figure faces) or from the front.
    const feet = pose.pair > 0.001 && pose.feet ? pose.feet() : null;
    const onFoot = (foot) => {
      const front = foot.view === 'front';
      return {
        x: ((foot.x / window.innerWidth) * 2 - 1) * (viewW / 2),
        y: (1 - (foot.y / window.innerHeight) * 2) * (viewH / 2),
        scale: (foot.length / window.innerHeight) * viewH * SHOE_ON_FOOT,
        pitch: front ? 14 : 4,
        yaw: front ? (foot.flipped ? 0.2 : 0.3) : foot.flipped ? 0 : 0.5,
        tilt: front ? 0 : foot.flipped ? 180 - foot.angle : foot.angle,
      };
    };
    const handover = feet ? ease(Math.min(pose.pair * 2.5, 1)) : 0;
    place(root, yawGroup, tiltGroup, single);
    fadeMain(1 - handover);
    footMaterials.forEach((m) => (m.opacity = handover));
    footShoes.forEach((f, i) => {
      const foot = feet?.[i];
      f.root.visible = Boolean(foot) && handover > 0.01;
      if (f.root.visible) place(f.root, f.yaw, f.tilt, mix(single, onFoot(foot), pose.pair));
    });

    const apart = ease(pose.explode);
    fadeWhole(apart);
    parts.forEach((part) => {
      const offset = part.dir.clone().multiplyScalar(apart * EXPLODE_DISTANCE / (part.modelScale ?? 1));
      part.object.position.copy(part.home).add(offset);
      if (part.standIn) part.object.scale.setScalar(Math.max(apart, 0.0001));
    });

    scene.updateMatrixWorld();
    renderer.render(scene, camera);

    // Labels: each one appears in turn, pinned next to its part on screen.
    const n = parts.length;
    parts.forEach((part, i) => {
      const shown = apart > 0.5 && !feet ? ease(slice(pose.labels, i / n, (i + 0.7) / n)) : 0;
      part.label.style.opacity = String(shown);
      if (!shown) return;
      part.object.getWorldPosition(point).project(camera);
      const x = ((point.x + 1) / 2) * window.innerWidth;
      const y = ((1 - point.y) / 2) * window.innerHeight;
      part.label.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  window.addEventListener('resize', resize);
  resize();
  load();

  return { element, render };
}
