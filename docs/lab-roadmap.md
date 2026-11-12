# Prototyping lab: what we decided and what's next

The lab is a second page (`/lab/`) where you pick a **sensor**, a **movement** and a **sound** and place the sensor on the shoe. Then you see **how to wire it** safely and **test** it. We build it **one small piece at a time**: brainstorm a piece, build it, look at it, then brainstorm the next.

The MVP uses **one of each**: one sensor, one location, one movement, one sound, one wiring and one test. It's a **template**: once it works, other sensors, movements and sounds are added as new entries in lists, not as new code.

## Where we left off (update this at the end of every lab session)
- **Done:** piece 1 (the lab page and pill buttons), 2a (the parts list and the FSR marker at the heel) and 2b (the "Show inside" switch). Saved as `checkpoint-04-lab-show-inside`.
- **Next:** piece **2c**, a sketch-style FSR in the open shoe's pocket. Then piece 3, the movement list and stomp.
- **To add the next sensor, movement, sound or interaction:** follow [lab-template.md](lab-template.md).
- **How we work on the lab:**
  1. Brainstorm one small piece with the Superpowers brainstorming steps, one question at a time, with a recommendation each time.
  2. Have the illustrator, motion-director, 3d-artist and hardware-engineer agents review the plan.
  3. Build it, update the docs (including [lab-template.md](lab-template.md)), and tick it off here.
- **Don't** take screenshots after each change; you check the result yourself.
- **Not checked on screen yet:** 2b's FSR spot at the heel (`FSR_ALONG`) and the positions of the open-shoe labels.

## Decided (brainstorm, 2026-11-11 and 2026-11-12)

| Topic | Decision |
|---|---|
| Where the lab lives | A **separate page**, `/lab/`. A floating **pill button** in the bottom-right corner (left of the "i") switches between the story and the lab on both pages. |
| How the lab works | **One workspace with a progress checklist:** Sensor → Movement → Sound → Wiring → Test. Wiring and Test unlock once the first three are picked, in that safe order. |
| First sensor and movement | **FSR under the heel + stomp** (a quick, hard press; harder stomp = bigger sound). |
| Shoe view | The flat **three-quarter Sketch** (`shoe-sketch.png`, drawn from the outer side at an angle, heel on the right; it shows the top, the side and the sole at once) with marked zones: sole (pressure sensors), top (gyro), outer side along the top of the sole line (capacitive). A **"Show inside"** switch separates the shoe into its layers to show where the FSR sits. **3D comes later.** |
| Sound | Made **in the browser with Tone.js** for now. The recipe is below. A recorded impact layered on top comes later. |
| Wiring | **Wokwi**. You pick the **FSR**, and the Wokwi project uses a **slider (potentiometer)** in its place, wired the standard 3-pin way. A clear note says: *"In this simulation, a slider replaces the FSR. On the real shoe: FSR leg 1 → 5V, leg 2 → A0, 10 kΩ resistor from A0 → GND."* A safety checklist sits under the note. The Wokwi project is embedded if possible, or opens with an "Open in Wokwi" button. Wokwi is free for personal use and needs a free account. |
| Test | **Simulated first:** press and hold on the heel; harder or faster presses make bigger booms. Built so the **real shoe** (Arduino over USB, Chrome's Web Serial) can feed the same spot later. |

## The pieces, in order
1. ✅ **The lab page and the two pill buttons** (2026-11-12).
2. **The sensor list + the FSR on the shoe**, in two halves:
   - 2a. ✅ The Sketch, the parts list, and the FSR marker at the heel (2026-11-12).
   - 2b. ✅ The "Show inside" switch (2026-11-12). The story's coming-apart shoe opens straight down, with the FSR render in its pocket at the heel. Technical labels appear (OUTSOLE, MIDSOLE, FSR · HEEL), or "EMPTY · PLACE A SENSOR" when no FSR is placed, along with the hardware note.
   - 2c. A sketch-style FSR in the pocket instead of the glossy render: the chapter 3 sketch, squashed and tilted to lie in the pocket, with a red ring (the illustrator's suggestion).
3. **The movement list + stomp.**
4. **The sound list + the boom** (Tone.js), with a play button.
5. **Wiring:** the Wokwi FSR project, the note and the safety checklist.
6. **Test:** press on the heel, hear the boom.

Each piece gets its own short brainstorm before it's built, so this list can change.

## Later (not in the MVP)
- The real shoe connected over USB.
- The gyro (Wokwi has the MPU6050), the capacitive sensor, and the tiptoe movement.
- A recorded impact layered on the boom (prompts below).
- A custom Wokwi "FSR chip" in place of the slider (Wokwi's Custom Chips, beta; it looks like a generic chip).
- A rotatable 3D shoe (the 3d-artist agent, Blender, `<model-viewer>` with hotspots).

## How the pieces will connect (draft)
Each sensor, movement and sound is a **data entry** in `src/lab/data/`:
- **A sensor** has a name, the zones it fits, its Wokwi link and safety checklist, and how raw readings become a strength from 0 to 1.
- **A movement** has a name and a rule for detecting it ("a press that peaks quickly = stomp").
- **A sound** has a name and its recipe.

During a test, the parts pass the signal along like this:
press (or the real shoe) → strength 0–1 → movement detector ("stomp, 0.8") → sound engine → boom.

## Agent reviews of piece 2a (2026-11-12)
All four said it's a good MVP: no new images, video or 3D needed yet.
- **Illustrator:**
  - The drawing is a three-quarter view (not a side view) and in full colour. If it feels loud on the technical page, set `--lab-shoe-filter` in `src/lab/lab.css` (for example `sepia(0.35) saturate(0.7)`).
  - The marker: a dark dashed outline over a thin cream line, the crosshair as the only red, and the leader drawn like the chapter 3 callouts.
- **Motion director:**
  - Putting a sensor on takes about 0.4 s: outline, then crosshair, then leader line, then label.
  - Taking it off is a 0.12 s fade.
  - Never block clicks, no pulsing, instant if "reduce motion" is on.
- **3D artist:**
  - Name zones after body parts and refer to them by id.
  - Keep each zone's meaning (`fits`, `side`, `layer`) apart from where it's drawn (`views.sketch34`), so `views.model3d` can be added later.
  - Keep markers as code, not in the picture.
  - Name the layers (outsole, midsole, insole, upper) the same way in the future 3D model.
- **Hardware engineer:**
  - The heel is right for a stomp. Draw a square FSR 406 (38 mm), flat on the midsole under the insole, with the tail out the back.
  - Store the pins, voltage and highest reading for each board. That's 1023 on Uno and Nano, and 4095 on ESP32. **3.3V on an ESP32, never 5V.**
  - Store the resistor value so it can be changed (10 kΩ down to 3.3 kΩ), and the power use.
  - `docs/hardware.md` is needed before piece 5.
  - Test seated, or tape the cable down.
- **One detail decided by us:** positions are stored in the image's own pixels (1356 × 846).

## Agent reviews of piece 2b (2026-11-12)
All four said it's a good MVP.
- **3D artist:**
  - A lab `layers` list (outsole, midsole, insole, upper), with the drawing piece that shows each one. The insole has none yet, so it rests on the midsole.
  - The switch only stores open or closed; each view animates it.
  - The future `.glb` uses the same layer names.
- **Hardware engineer:**
  - The pocket is shallow (about 1 mm) with a firm flat bottom, under the insole. The tail leaves at the back of the heel, never through the outsole.
  - The data now says **FSR 402 (round, 13 mm)** to match the picture. The 406 comes later.
  - Fixed: on an ESP32 the FSR goes to GPIO34, not A0.
- **Motion director:**
  - Open in 0.8 s and close in 0.6 s, at a steady speed (the layers ease themselves). A click midway reverses the motion.
  - The markers fade out as the shoe opens, and replay once it has fully closed. The FSR in its pocket fades in 120 ms.
- **Illustrator:**
  - Technical labels when the shoe is open, and a labelled empty pocket.
  - The glossy render clashes, so a sketch FSR is next (2c).
  - It suggested disabling the switch during the motion. We kept the reverse-on-click instead, to match the "never block clicks" rule.

## The boom recipe (from the sound-designer agent, 2026-11-12)
- **Body:** Tone.js `MembraneSynth` at about G1 (49 Hz), `pitchDecay` 0.08, `octaves` 4, decay 1.0 s.
- **Thud:** brown-noise `NoiseSynth`, decay 0.06 s, through a low-pass filter at about 1.5 kHz.
- **Sub:** a sine at about 35 Hz, decay 1.2 s. It only joins in when strength is above 0.5, and it stays out of the reverb.
- **Chain:** reverb (decay 2.5, wet 0.2), then a compressor, then a limiter at −1 dB.
- **What strength (0 to 1) changes:**
  - volume, from −20 to −3 dB (strength^1.5, so light taps stay soft)
  - pitch drop (`octaves` 2 to 5)
  - length (0.5 to 1.5 s)
  - thud brightness (500 Hz to 3 kHz)
  - reverb (0.1 to 0.3)
- **Quick response:** start sound on the first click (`Tone.start()`), use `latencyHint: "interactive"` and `lookAhead: 0.01`, and build the instruments once.
- **Speakers:** laptop speakers can't play the sub, so check on both headphones and the laptop.
- **Real shoe later:** strength = (reading − resting) ÷ (adcMax − resting), where adcMax is 1023 on Uno/Nano and 4095 on ESP32. A stomp starts when strength rises above about 0.15 and can't fire again until it drops below about 0.08. Use the peak in the first ~30 ms.
- **Recorded impact later:**
  - Prompts:
    - ElevenLabs: "Single giant footstep on packed earth: massive deep boom, heavy low thud with sub-bass weight, short crunchy dirt impact, rumbling tail fading over 1.5 seconds, slight outdoor echo, no music, no voices."
    - Firefly: "One enormous stomp of a giant's foot hitting the ground, deep booming impact, low rumble, soft debris crunch, natural fade-out, dry with a little open-air echo."
  - Freesound searches: "giant footstep", "boom impact low", "deep thud".
  - Follow the sound library rules, and ask before using a tool that costs credits.
