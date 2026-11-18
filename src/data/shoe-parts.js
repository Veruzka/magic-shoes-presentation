// What's inside each shoe (the MVP build), labeled one at a time in "What we've built".
//   point  where the label's line starts on the Sketch shoe, as a share of the
//          image's width and height (0,0 = top-left, 1,1 = bottom-right; heel is on the right)
//   todo   shown as a TODO sticker next to the label
// TODO: confirm the per-shoe parts once engineering decides the final hardware.
export const shoeParts = [
  { id: 'fsr', name: 'FSR pressure sensor', note: 'In the sole, under the heel', point: { x: 0.8, y: 0.62 } },
  { id: 'mpu', name: 'MPU-6050 gyro', note: 'Feels tilt, kicks and spins', point: { x: 0.62, y: 0.3 } },
  { id: 'minima', name: 'Arduino UNO R4 Minima', note: 'Reads the sensors 50 times a second', point: { x: 0.5, y: 0.5 } },
  { id: 'xiao', name: 'XIAO ESP32-C6', note: 'Sends the data over Bluetooth', point: { x: 0.38, y: 0.42 } },
  { id: 'power', name: 'USB power bank', note: 'Powers everything', point: { x: 0.86, y: 0.2 } },
  { id: 'case', name: '3D-printed case', note: 'SLA resin print', point: { x: 0.72, y: 0.4 }, todo: 'final model' },
];
