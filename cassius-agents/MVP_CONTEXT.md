# Twinkle Toes / Music Sampling Shoes: MVP Context

The working prototype the team built for the 9 Nov 2026 deadline: how it plays, what's inside each shoe, how the data moves, who built what, and how Liz wrote it up. Companion to `PROJECT_CONTEXT.md` and `FIGMA_CONTEXT.md`.

Last compiled: 18 Nov 2026. Repo: **github.com/cassiusp-beep/tui-music-sampling-shoes**

---

## 1. Overview

Repo: **github.com/cassiusp-beep/tui-music-sampling-shoes** (README, firmware, sampler app, Tinkercad model, photos in `docs/`).

**How it plays:** two players, one shoe each. A song is split into 4 parts with Demucs (drums, bass, vocals, melody). Left player = drums + bass, right player = vocals + melody.

| Move | Left player | Right player |
|---|---|---|
| Stand on your shoe | drums in | vocals in |
| Lift your foot | part drops out | part drops out |
| Tip toes up or down | bass | melody |
| Shake your foot | echo | echo |
| **Both stomp within 0.25 s** | **swap parts** | |

The stomp swap became the heart of the instrument "because it only works if you're paying attention to each other" (Liz's post). Inspired by Kanye West's Stem Player.

**Per shoe:** FSR in the sole (A0, 220 ohm to GND) · MPU-6050 gyro/accelerometer (I2C) · Arduino UNO R4 Minima · XIAO ESP32-C6 sharing the gyro's I2C wires · USB power bank · 3D-printed tent-shaped case. No soldering.

**Data flow:** FSR + gyro → Minima (reads and smooths, 50x a second) → XIAO over I2C → Bluetooth LE (40x a second) → Chrome sampler app (Web Bluetooth joins L + R, calibrate "standing flat" / "foot lifted", thresholds turn numbers into moves) → laptop speakers.

**Parts in hand (both shoes):** 2 Minima, 3 XIAO, 3 MPU-6050, 3 FSR, 2 breadboards, 220 ohm resistors, jumpers, 2 power banks.

**Original build roles (MVP):** Veruzka + Vinay: Tinkercad · Kimney + Cash: code · Liz: interaction + Medium post · Cassius: ergonomics of mounting the Arduino and breadboard on the shoe (and built most of the MVP).

**Liz's Medium post, "Twinkle Toes":** constraints were sound from physical manipulation, at least four inputs, ideally multiple players. It covers the Stem Player inspiration, the concept sketched in FigJam, the 4-part split, the stomp swap, the parts, the Tinkercad practice model with two Unos, the tent case and the Chrome app. Its materials list includes copper tape; **copper tape has since been dropped.**

---

## 2. Repo layout

| Folder | What it is | Goes on |
|---|---|---|
| `minima_foot/` | Reads the FSR and the gyro, sends the numbers 50x a second | Each Arduino UNO R4 Minima |
| `xiao_radio/` | Listens on I2C and sends the numbers to the laptop over Bluetooth LE | Each XIAO ESP32-C6 |
| `sampler/` | The music app (Web Bluetooth + Web Audio, built-in demo song and simulator sliders) | The laptop, opened in Chrome |
| `tinkercad/` | The practice model: two Unos, each with a force sensor and a tilt sensor | Tinkercad |
| `docs/` | Photos: sampler app, Tinkercad circuit, two breadboard shots of the left shoe in its tent case | README and the website |

Set `FOOT` to `L` or `R` in both the Minima and the XIAO code before uploading.

## 3. Wiring (same on both shoes, no soldering)

- **FSR (in the sole):** one leg → 5V, other leg → A0, 220 ohm resistor (red red brown) from A0 → GND.
- **MPU-6050:** VCC → 5V, GND → GND, SCL → Minima A5/SCL, SDA → Minima A4/SDA.
- **XIAO:** 5V → Minima 5V, GND → GND, D4 → SCL, D5 → SDA. No resistors: the XIAO shares the gyro's I2C wires and the gyro board's pull-ups keep them at a safe 3.3 V. D4/D5 are swapped from the printed defaults so wires don't cross; the code knows this.
- **Power:** power bank → the Minima's USB-C, which powers everything.

## 4. Data format

- USB line from the Minima: `FOOT,fsr,pitch,roll,shake`, e.g. `L,1830,2.41,-0.87,12`. fsr 0 to 4095; pitch = toe up/down in degrees; roll = ankle in/out; shake = rotation speed in deg/s.
- Minima → XIAO and XIAO → laptop: the same 8-byte packet (fsr, pitch x100, roll x100, shake), little endian.
- Bluetooth names: `MusicShoe-L` and `MusicShoe-R`.

## 5. Test order

1. Open the sampler (`cd sampler && python3 -m http.server 8000`, then Chrome at localhost:8000). Press Start music and move the sliders: it works with no shoes.
2. Plug in one Minima, upload, open the Serial Monitor at 115200. Press the FSR and the second number goes up.
3. In the app, click **USB test** and pick the Minima: the bars move.
4. Add the XIAO; click **Connect Left shoe** and pick `MusicShoe-L`.
5. Build the right shoe the same way with `R`.
6. Put them on. Stand flat → **Set: standing flat**. Lift your foot → **Set: foot lifted**. Play.

To use a real song: `pip install demucs` then `demucs -n htdemucs song.mp3`, and load `drums.wav`, `bass.wav`, `vocals.wav` and `other.wav` into the app.

## 6. How the hardware got here (from the build sessions)

UNO R4 WiFi → Minima + XIAO (the Minima has no radio) → an Adafruit Bluefruit LE shield, dropped because it needs soldering → a no-solder build with pre-soldered XIAO ESP32-C6 and GY-521 MPU-6050 boards. A voltage divider (to protect the 3.3 V XIAO from the Minima's 5 V) was replaced by putting the XIAO on the gyro's I2C bus, leaving one 220 ohm resistor per shoe. The project was renamed from SonicStride to Music Sampling Shoes. The sampler was tested in a browser; the Arduino code was written without access to real boards, so first-shoe testing was the real check.

## 7. What changes for the final build

- Two players, each wearing a **full pair** (4 shoes). Needs +2 Minima, +1 XIAO, +1 MPU-6050, +1 FSR, +2 breadboards, +2 power banks, 2 more cases. Option to discuss: the XIAO reads the FSR and gyro itself and the Minima is dropped.
- Sound effects (the team's own library) instead of song stems; the stomp swap stays.
- **Copper tape has been dropped**, even though Liz's post lists it.
- Engineering decides the final per-shoe hardware.
