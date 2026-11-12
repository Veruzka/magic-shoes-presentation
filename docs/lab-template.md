# Lab template: how to add an interaction

An **interaction** is one sensor, placed on one spot of the shoe, plus one movement and one sound. You get it working safely: you see how to wire it, then test it.

> **Example (the MVP):** FSR (sensor) at the heel (zone) + stomp (movement) + deep boom (sound) → Wokwi circuit + safety checklist (wiring) → press the heel, hear the boom (test).

The lab is built so a new interaction is **mostly new entries in lists**, not new code. This doc is the recipe. The plan and progress live in [lab-roadmap.md](lab-roadmap.md).

**Status key:**
- ✅ built and working
- 🔜 planned (built in the piece named)
- ⚠️ known gap: needs code the first time it's used

---

## 1. The building blocks

| Block | What it is | Where it lives | Status |
|---|---|---|---|
| **Sensor** | A part that measures something (pressure, motion, touch) | `src/lab/data/sensors.js` | ✅ |
| **Zone** | A spot on the shoe where sensors of a certain kind can go | `src/lab/data/zones.js` | ✅ |
| **Layer** | A layer of the shoe (outsole, midsole, insole, upper) that a zone sits in | `src/lab/data/layers.js` | ✅ |
| **Movement** | Something the wearer does (stomp, tiptoe, twist) and how to recognise it from the readings | `src/lab/data/movements.js` | 🔜 piece 3 |
| **Sound** | What plays, and how the movement's strength shapes it | `src/lab/data/sounds.js` (+ `sounds.json` for sound files) | 🔜 piece 4 |
| **Interaction** | One sensor + zone + movement + sound, joined together | `src/lab/data/interactions.js` | 🔜 piece 6 |

**How they connect.** Each block points to the others **by id**, never by position or file name:
```
sensor.kind  ──must match──  zone.fits
sensor.zone  ──points to──   zone.id
zone.layer   ──points to──   layer.id
movement.kinds ─must include─ sensor.kind
interaction = { sensor, movement, sound }   (all ids)
```

**What happens during a test:**
```
reading (simulated press, later the real shoe)
  → strength 0–1            (from the sensor's settings)
  → "stomp, strength 0.8"   (the movement's rule)
  → sound plays             (the sound's recipe, shaped by strength)
```
The code for each arrow is written **once** and driven by whatever entry it's given.

---

## 2. Checklist: add a new interaction

Work through it top to bottom. Each step says which file to change. One step per small piece is fine (see [how we work](#5-how-we-work-on-a-new-interaction)).

### Step 1: the sensor (`src/lab/data/sensors.js`) ✅
Copy the FSR entry and change every field. **Required:**

| Field | What to write | FSR example |
|---|---|---|
| `id`, `name` | Short id, display name | `'fsr'`, `'FSR'` |
| `kind` | What it senses; must match a zone's `fits` | `'pressure'` |
| `status` | `'active'` (pickable) or `'soon'` (greyed out) | `'active'` |
| `zone` | The zone's id | `'heel'` |
| `model` | The exact part, matching the picture | `'FSR 402 (round, 13 mm)'` |
| `signal` | `'analog'`, `'i2c'` or `'digital'` | `'analog'` |
| `boards` | Per board: pins, supply voltage, `adcMax` (highest reading) | Uno `A0`, `5V`, `1023`. ESP32 `GPIO34`, **`3.3V`**, `4095` |
| `currentMa` | Power it draws | `1` |
| `parts` | Extra parts: name, value, wiring | 10 kΩ resistor, `A0 → GND` |
| `resting` | Reading when untouched (fill in after testing) | `null` for now |
| `wokwi` | The part that stands in for it in Wokwi, and the project link | slide potentiometer, link 🔜 piece 5 |
| `realWiring` | How to wire the **real** part (if Wokwi uses a stand-in) | "FSR leg 1 → 5V …" |
| `safety` | The checklist shown in the Wiring step | "Unplug USB before changing any wire." … |
| `insideNote` | Optional: shown under "Show inside" when placed | "The FSR sits flat in a shallow pocket …" |

**Safety rules for every sensor (hardware-engineer review):**
- Write the voltage **per board**. 3.3V boards (ESP32) must never get 5V.
- No direct 5V → GND path.
- Check that no two placed sensors share a pin.
- Cables from a moving foot get a "test seated or tape it down" line.
- Batteries never go under the foot.

### Step 2: the zone (`src/lab/data/zones.js`) ✅
If the sensor's zone already exists with `views.sketch34`, skip this. Otherwise add or finish the entry:
- `id` (named after the body part), `name`, `fits` (kinds), `side` (`outer`, `inner` or `both`), `layer` (a layer id).
- `views.sketch34`, in the drawing's own pixels (1356 × 846, top-left = 0, 0):
  - `anchor`: where the crosshair sits
  - `outline`: an SVG path of the zone's shape
  - `label`: `{ bend, end, text }`, where the leader line bends and ends, and the label text
- The Gyro's `upper-top` and the Capacitive's `outer-midsole` zones already exist without views. Add their `views.sketch34` when they become active.

✅ **You then get, with no new code:** the sensor's row in the parts list, and its marker on the closed shoe (outline, red crosshair, leader and label, with the motion).

### Step 3: the inside view ("Show inside") ⚠️
- **Already generic:** the hardware note under the switch (`insideNote`).
- **FSR-only for now:** the picture of the part inside the open shoe, its label, and the "empty pocket" invitation. They come from the story's coming-apart shoe, which has the FSR built into the midsole tray (see `makeFsrInside` in `src/lab/lab-shoe.js`).
- **The first time a non-FSR sensor is added:** decide what its "inside" looks like. A gyro sits on top and may need no inside view at all. Then make `makeFsrInside` work from the sensor and zone data, and tick this step ✅ here.

### Step 4: the movement (`src/lab/data/movements.js`) 🔜 piece 3
Planned fields. Confirm them when piece 3 is built:
- `id`, `name`, `status`, `description` (one plain sentence, e.g. "Bring your heel down fast and hard").
- `kinds`: which sensor kinds can detect it (stomp → `['pressure']`).
- `rule`: the detection settings, as numbers. Stomp example (from the sound designer): starts when strength rises above `0.15`, can't fire again until it drops below `0.08`, and the strength is the peak in the first `30` ms.

### Step 5: the sound (`src/lab/data/sounds.js`) 🔜 piece 4
Planned fields. Confirm them when piece 4 is built:
- `id`, `name`, `status`.
- `source`:
  - `'synth'`: made in the browser with Tone.js, with its recipe and settings (see the boom recipe in [lab-roadmap.md](lab-roadmap.md))
  - `'file'`: an id from `sounds.json`. Never point at a file directly; follow [sound-library.md](sound-library.md).
- `shape`: how strength (0–1) changes it (volume, pitch, length, brightness).
- **License:** for files, it must be logged in `sound-library.md`. Never guess it.
- **Paid tools:** ask before generating a sound with a tool that costs credits.

### Step 6: wiring (Wokwi) 🔜 piece 5
- Make a Wokwi project for the sensor (with the hardware-engineer agent). Use the sensor's `wokwi.standIn` if Wokwi has no matching part.
- Put the link in the sensor's `wokwi.link`.
- The Wiring step then shows the project, the `realWiring` note (if a stand-in is used) and the `safety` checklist, from the data.
- `docs/hardware.md` (board, parts, pin map) must exist and include the new sensor.

### Step 7: the interaction (`src/lab/data/interactions.js`) 🔜 piece 6
- One entry: `{ id, name, sensor, movement, sound }` (ids), and a `status`.
- The Test step reads it: press (or the real shoe) → strength → movement → sound.
- Test **one interaction at a time**, not all together (for now).

### Step 8: finish
- [ ] Have the illustrator, motion-director, 3d-artist and hardware-engineer agents review the plan for this interaction (and the sound-designer agent for a new sound).
- [ ] `npm run build` passes.
- [ ] You look at it in the browser (no automatic screenshots).
- [ ] Update the docs: this template (anything that changed), [lab-roadmap.md](lab-roadmap.md) ("Where we left off"), [architecture.md](architecture.md), [how-to-change-things.md](how-to-change-things.md) and [changelog.md](changelog.md).
- [ ] When it works well, save a checkpoint.

---

## 3. Known gaps (code needed the first time)
| Gap | Where | When to fix |
|---|---|---|
| The open-shoe "inside" picture, label and empty pocket are FSR-only | `makeFsrInside` in `src/lab/lab-shoe.js` | When the second sensor becomes active |
| Only one shoe picture (`sketch34`); no 3D yet | `views` in `zones.js` and `layers.js` | When the 3D shoe is built (add `views.model3d`) |
| The FSR picture is the round 402; the square 406 would be more forgiving | `sketch-sensor.js` render and `sensors.js` `model` | When the 406 is chosen |
| Pins aren't checked for clashes between sensors yet | 🔜 the Wiring step (piece 5) | Piece 5 |

---

## 4. When to update this template
The template stays useful only if it matches the code. Update it at these moments:

| When | What to update here |
|---|---|
| **A piece of the MVP is finished** (3: movements, 4: sounds, 5: wiring, 6: test) | Turn that step's 🔜 into ✅, replace "planned fields" with the real ones and the FSR/stomp/boom example, and list any new file. |
| **A data entry gets a new field** (e.g. a sensor gains `debounce`) | Add the field to its table in section 2, with what to write and the MVP's example. |
| **A shortcut is taken for the MVP** (something that only works for the FSR, stomp or boom) | Add it to "Known gaps" right away, with where it is and when to fix it. |
| **A gap gets fixed** | Remove it from "Known gaps" and turn its ⚠️ into ✅. |
| **The first full interaction works end to end** (after piece 6) | Do a walk-through: follow the checklist on paper for the next interaction (e.g. gyro + twist) and fix any step that's unclear or missing. That's the real test of the template. |
| **The second interaction is built** | Note what the checklist missed, and whether any step could become data instead of code. |
| **A review (the agents or you) changes a rule** (safety, motion, style) | Update the rule here, so the next interaction follows it. |

The **"Where we left off"** section in [lab-roadmap.md](lab-roadmap.md) is the session handoff. This doc is the **recipe**. If they disagree, the code is the truth: fix whichever doc is wrong.

---

## 5. How we work on a new interaction
1. **One small piece at a time.** Brainstorm the smallest next step, build it, look at it, then the next.
2. **Brainstorm** with the Superpowers steps: one question at a time, 2–3 options with a recommendation.
3. **Review** the plan with the relevant agents before building.
4. **Build from data first.** If something needs new code, write it so the next sensor, movement or sound only needs an entry. If that isn't possible yet, log it in "Known gaps".
5. **Docs and a checkpoint** when it works.
