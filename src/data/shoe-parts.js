// What's inside each shoe (the MVP build), labeled one at a time in "What we've built".
//   point  where the label's line starts on the Sketch shoe, as a share of the
//          image's width and height (0,0 = top-left, 1,1 = bottom-right; heel is on the right)
//   todo   shown as a TODO sticker next to the label
//   model  the objects in the real 3D model (shoe.glb) that are this part; the
//          label is pinned to the first one ("Inside each shoe" only)
//
// The Arduino UNO R4 Minima is set aside (2026-11-19, Veruzka): it's not shown
// in this scene. To bring it back, put this line back in the list:
//   { id: 'minima', name: 'Arduino UNO R4 Minima', note: 'Reads the sensors 50 times a second', point: { x: 0.5, y: 0.5 } },
export const shoeParts = [
  { id: 'fsr', model: ['fsr_heel', 'fsr_ball'], name: 'FSR pressure sensor', note: 'In the sole, under the heel', point: { x: 0.8, y: 0.62 } },
  { id: 'mpu', model: ['gyro_mpu6050'], name: 'MPU-6050 gyro', note: 'Feels tilt, kicks and spins', point: { x: 0.62, y: 0.3 } },
  { id: 'xiao', model: ['xiao_esp32c6'], name: 'XIAO ESP32-C6', note: 'Sends the data over Bluetooth', point: { x: 0.38, y: 0.42 } },
  { id: 'power', model: ['usb_cable', 'usb_c_plug'], name: 'USB power bank', note: 'Powers everything', point: { x: 0.86, y: 0.2 } },
  { id: 'case', model: ['tray', 'lid'], name: '3D-printed case', note: 'SLA resin print', point: { x: 0.72, y: 0.4 }, todo: 'final model' },
];
