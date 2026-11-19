# The 3D shoe model

**`shoe.glb`** is the real shoe, exported from Rhino (`twinkle_toes.3dm`, the left shoe; 2026-11-19). The site shows it **only in "Inside each shoe"**, where it comes apart in stacked layers with each part labeled. Every other scene uses the Sketch drawing. If the file is missing, "Inside each shoe" falls back to the drawing too.

## To swap in a new export
- **One file, `.glb`** (glTF binary), under about 10 MB so it loads fast. Replace `shoe.glb` and reload.
- **Keep the object names.** The site looks for these top-level objects:
  - the layers, bottom to top (`MODEL_LAYERS` in `src/three/shoe-stage.js`): `sole_toe`, `sole_heel` · `fsr_heel`, `fsr_ball` · `tray` · `breadboard`, `xiao_esp32c6`, `gyro_mpu6050`, `resistor`, `capacitor`, `usb_c_port`, `usb_c_plug`, `usb_cable` · `lid` · `insole`
  - the labels (`model: [...]` in `src/data/shoe-parts.js`): `fsr_heel`, `gyro_mpu6050`, `xiao_esp32c6`, `usb_cable`, `tray`
  - A renamed or new object needs its name added in those two places.
- **Orientation:** as exported, sole down (−Y) and toe toward +X. The site turns it so the toe is on the left, like the drawing. The size doesn't matter; it's scaled to fit.
