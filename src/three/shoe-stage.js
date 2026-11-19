// The one 3D shoe that travels through the whole story. A see-through 3D layer
// fixed over the page (clicks pass straight through it), with the shoe posed by
// src/three/shoe-director.js from the list in src/data/shoe-path.js.
//
// The shoe: the Sketch drawing on a thin card, plus a small block for each part,
// everywhere in the story. Only in "Inside each shoe" (pose.model = 1) is it
// swapped for the real 3D model, /assets/models/shoe.glb (folder
// public/assets/models/), which comes apart in stacked layers, in the order the
// shoe is assembled. If the model can't load, the card is used there too.
//
// It only draws a new picture when the pose changes (never in a constant loop).
import './shoe-stage.css';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
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

// The real model's layers, bottom to top, in the order the shoe is put together
// (see PRINT_SHEET.md next to the Rhino file). Coming apart, each layer lifts
// until it sits just above the one below it. Names are the model's object names.
const MODEL_LAYERS = [
  ['sole_toe', 'sole_heel'],
  ['fsr_heel', 'fsr_ball'],
  ['tray'],
  ['breadboard', 'xiao_esp32c6', 'gyro_mpu6050', 'resistor', 'capacitor', 'usb_c_port', 'usb_c_plug', 'usb_cable'],
  ['lid'],
  ['insole'],
];
const LAYER_GAP = 0.035; // space between layers when fully apart, in shoe lengths
const MODEL_FIT = 0.7; // when fully apart, the model shrinks to this size so the stack fits the screen

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
  // They only show while pose.pair > 0. Until the .glb arrives, each one is the
  // same Sketch drawing on a card as the hero's shoe; with the model, each is a
  // copy of it.
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
  let card = null; // the Sketch drawing on its card (the big shoe)
  let model = null; // the real model, once loaded: { group, layers, parts, lift }

  // A solid stand-in shoe, 1 unit long, toe toward -x: a sole and a rounded upper.
  // Set aside (2026-11-19): the players wear the Sketch card now (buildStandIn).
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
  let fadeWhole = () => {}; // (the stand-in card used to fade back as the parts flew out)
  let lastPose = { ...REST, opacity: 0 };

  function makeLabels(list) {
    list.forEach((part) => {
      const label = document.createElement('div');
      label.className = 'shoe-stage__label';
      label.innerHTML = '<span class="shoe-stage__dot"></span><span class="shoe-stage__name"></span>';
      label.querySelector('.shoe-stage__name').textContent = part.data.name;
      labelLayer.append(label);
      part.label = label;
    });
  }

  // One electronic part, drawn like a small relay (2026-11-19, from Veruzka's
  // reference photos): a matte dark green-grey box with softly rounded edges,
  // like a 3D print, tiny white markings on its face (not meant to be read) and
  // little metal pins underneath. Every part uses the same box, to keep it simple.
  const PART_BOX = { w: 0.075, h: 0.06, d: 0.055 };
  const partBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3e4a46, roughness: 0.88, metalness: 0 });
  const pinMaterial = new THREE.MeshStandardMaterial({ color: 0xc9cbc7, roughness: 0.35, metalness: 0.7 });
  function markings(seed) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 192;
    const g = canvas.getContext('2d');
    g.fillStyle = 'rgba(255,255,255,0.88)';
    g.font = '600 30px "Courier New", monospace';
    // Four short lines of maker's-mark style text, a little uneven, like print on a part.
    const chars = 'RK0S8LNE6CR5FHVOAQ27X';
    let n = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pick = () => chars[(n = (n * 31 + 7) % 997) % chars.length];
    const lines = [seed.toUpperCase().slice(0, 7), 'RN ' + pick() + pick() + pick() + pick(), pick() + pick() + ' ' + pick() + pick() + pick() + pick(), pick() + pick() + pick() + pick() + pick() + pick() + pick()];
    lines.forEach((line, i) => {
      g.save();
      g.translate(26 + i * 4, 44 + i * 40);
      g.rotate(-0.04);
      g.fillText(line, 0, 0);
      g.restore();
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  }
  function partBox(id) {
    const { w, h, d } = PART_BOX;
    const group = new THREE.Group();
    group.add(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, 0.006), partBodyMaterial));
    const label = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.82, h * 0.7), markings(id));
    label.position.z = d / 2 + 0.0006;
    group.add(label);
    // Pins: two rows of two, poking out of the bottom.
    [-1, 1].forEach((sx) =>
      [-1, 1].forEach((sz) => {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.014, 0.003), pinMaterial);
        pin.position.set(sx * w * 0.32, -h / 2 - 0.006, sz * d * 0.28);
        group.add(pin);
      }),
    );
    return group;
  }

  // The stand-in: the Sketch drawing on a card, and one relay-style box per part.
  function buildStandIn() {
    const texture = new THREE.TextureLoader().load(shoeUrl, () => render(lastPose));
    texture.colorSpace = THREE.SRGBColorSpace;
    const cardMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide });
    card = new THREE.Mesh(new THREE.PlaneGeometry(1, SKETCH_RATIO), cardMaterial);
    tiltGroup.add(card);
    // The players wear the same shoe as the hero: the Sketch drawing on a card
    // (2026-11-19; they wore standInShoe(), a simpler solid shape, before).
    // Every movement is seen from the side, so the flat drawing reads well.
    footShoes.forEach((f) => {
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide });
      footMaterials.push(material);
      f.tilt.add(new THREE.Mesh(new THREE.PlaneGeometry(1, SKETCH_RATIO), material));
    });
    let explodeFade = 1;
    let pairFade = 1;
    const applyFade = () => (cardMaterial.opacity = explodeFade * pairFade);
    // The card stays fully opaque while the parts fly out (2026-11-19,
    // Veruzka); it used to fade to 35% as the shoe came apart.
    fadeWhole = () => {
      explodeFade = 1;
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
      const block = partBox(data.id);
      tiltGroup.add(block);
      return { data, object: block, home, dir, standIn: true };
    });
    makeLabels(parts);
  }

  // The real model, for "Inside each shoe" only. It lies toe to +X in the file,
  // so it's turned round to match the drawing (toe on the left). Each label is
  // pinned to the first object listed in that part's `model` (src/data/shoe-parts.js).
  function useModel(gltf) {
    const inner = gltf.scene;
    // Measure everything first, in the file's own units (nothing is moved yet).
    inner.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(inner);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 1 / Math.max(size.x, size.z); // 1 unit long

    // How far each layer lifts when fully apart, so its bottom ends up just
    // above the top of the layer below.
    const gap = LAYER_GAP / scale;
    let top = -Infinity;
    const layers = MODEL_LAYERS.map((names) => {
      const objects = names.map((name) => inner.getObjectByName(name)).filter(Boolean);
      const layerBox = new THREE.Box3();
      objects.forEach((o) => layerBox.expandByObject(o));
      const lift = objects.length && top > -Infinity ? Math.max(0, top + gap - layerBox.min.y) : 0;
      if (objects.length) top = layerBox.max.y + lift;
      return { objects, lift };
    });
    const lift = (top - box.max.y) * scale; // how much taller the stack is, in shoe lengths

    // Labels: pinned to the middle of each part's first object.
    const modelParts = shoeParts
      .map((data) => {
        const object = (data.model ?? [data.id]).map((name) => inner.getObjectByName(name)).find(Boolean);
        if (!object) return null;
        const anchor = object.worldToLocal(new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3()));
        return { data, object, anchor };
      })
      .filter(Boolean);

    // Then size it to 1 unit long, centre it, and turn it toe-left like the drawing.
    inner.scale.setScalar(scale);
    inner.position.copy(center).multiplyScalar(-scale);
    const turned = new THREE.Group();
    turned.rotation.y = Math.PI;
    turned.add(inner);
    const group = new THREE.Group();
    group.add(turned);
    group.visible = false;
    tiltGroup.add(group);

    makeLabels(modelParts);
    model = { group, layers, parts: modelParts, lift };
    // Warm up: draw it once now (off screen, nothing visible changes), so the
    // graphics card has it ready and the first scroll into the scene doesn't stall.
    const wasAt = root.position.clone();
    group.visible = true;
    root.position.set(0, 0, 0);
    scene.updateMatrixWorld();
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    group.visible = false;
    root.position.copy(wasAt);
    renderer.render(scene, camera);
    render(lastPose);
  }

  async function load() {
    buildStandIn();
    render(lastPose);
    try {
      const response = await fetch(MODEL_URL);
      const type = response.headers.get('content-type') ?? '';
      if (!response.ok || type.includes('text/html')) throw new Error('no model yet');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '');
      useModel(gltf);
    } catch {
      // No model: "Inside each shoe" keeps the Sketch card and its part blocks.
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
    // Only touch the page's styles when the fade really changes (the hero's
    // float redraws every frame).
    const opacity = String(pose.opacity);
    if (element.style.opacity !== opacity) element.style.opacity = opacity;
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
    // `foot.front` (0 → 1) turns the shoe between the two views, so a change of
    // movement turns it instead of snapping it round.
    const onFoot = (foot) => {
      const front = foot.front ?? (foot.view === 'front' ? 1 : 0);
      const at = {
        x: ((foot.x / window.innerWidth) * 2 - 1) * (viewW / 2),
        y: (1 - (foot.y / window.innerHeight) * 2) * (viewH / 2),
        scale: (foot.length / window.innerHeight) * viewH * SHOE_ON_FOOT,
      };
      // Side view: the toe points the way the player faces, and turns smoothly with the spin.
      const side = { ...at, pitch: 4, yaw: (foot.facing < 0 ? 0 : 0.5) + (foot.spin ?? 0), tilt: foot.angle };
      const ahead = { ...at, pitch: 14, yaw: foot.facing < 0 ? 0.2 : 0.3, tilt: 0 };
      return mix(side, ahead, front);
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
    // The real model takes over from the card only in "Inside each shoe".
    // (The switch happens while the shoe is hidden, between scenes.)
    const real = Boolean(model) && (pose.model ?? 0) >= 0.5 && !feet;
    if (card) card.visible = !real;
    if (model) {
      model.group.visible = real;
      if (real) {
        // Stacked layers: each lifts into place; the stack shrinks and stays centred.
        model.layers.forEach((layer) => layer.objects.forEach((o) => (o.position.y = layer.lift * apart)));
        const fit = 1 + (MODEL_FIT - 1) * apart;
        model.group.scale.setScalar(fit);
        model.group.position.y = (-model.lift / 2) * apart * fit;
      }
    }
    parts.forEach((part) => {
      const offset = part.dir.clone().multiplyScalar(apart * EXPLODE_DISTANCE);
      part.object.position.copy(part.home).add(offset);
      part.object.scale.setScalar(Math.max(apart, 0.0001));
      part.object.visible = !real;
    });

    scene.updateMatrixWorld();
    renderer.render(scene, camera);

    // Labels: each one appears in turn, pinned next to its part on screen.
    const showLabels = (list, on) => {
      const n = list.length;
      list.forEach((part, i) => {
        const shown = on && apart > 0.5 && !feet ? ease(slice(pose.labels, i / n, (i + 0.7) / n)) : 0;
        part.label.style.opacity = String(shown);
        if (!shown) return;
        if (part.anchor) point.copy(part.anchor).applyMatrix4(part.object.matrixWorld).project(camera);
        else part.object.getWorldPosition(point).project(camera);
        const x = ((point.x + 1) / 2) * window.innerWidth;
        const y = ((1 - point.y) / 2) * window.innerHeight;
        part.label.style.transform = `translate(${x}px, ${y}px)`;
      });
    };
    showLabels(parts, !real);
    if (model) showLabels(model.parts, real);
  }

  window.addEventListener('resize', resize);
  resize();
  load();

  return { element, render };
}
