// Entry point for the lab page (/lab/): the sensor parts list on the left, the
// shoe in the middle, the movements and sounds on the right, and the switch back to the story. Built one small piece at
// a time; the plan is in docs/lab-roadmap.md.
import '../styles/base.css';
import './lab.css';

import { pageSwitch } from '../components/page-switch.js';
import { infoButton } from '../components/info-panel.js';
import { sensorList } from './sensor-list.js';
import { labShoe } from './lab-shoe.js';
import { insideSwitch } from './inside-switch.js';
import { movementList } from './movement-list.js';
import { soundList } from './sound-list.js';

const lab = document.querySelector('#lab');
lab.className = 'lab';
lab.innerHTML = '<h1 class="lab__title">Magic Shoes Lab</h1>';

const workspace = document.createElement('div');
workspace.className = 'lab__workspace';
const centre = document.createElement('div');
centre.className = 'lab__centre';
centre.append(labShoe(), insideSwitch());
const right = document.createElement('div');
right.className = 'lab__right';
right.append(movementList(), soundList());
workspace.append(sensorList(), centre, right);
lab.append(workspace);

document.body.append(pageSwitch({ label: '← Back to the story', href: import.meta.env.BASE_URL }));
document.body.append(infoButton());
