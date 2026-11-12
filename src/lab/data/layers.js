// The shoe's layers, bottom to top (3d-artist review, 2026-11-12). The future 3D
// model will use these same names for its separate parts, so the "Show inside"
// switch can open either view.
//
//   id        – the layer's name (zones.js `layer` points here)
//   restsOn   – for a layer with no picture of its own: the layer it lies on
//   views     – how each picture of the shoe shows it:
//     sketch34 – the three-quarter Sketch. `piece` = the story's coming-apart piece
//                (separating-shoe.js names) or null if the drawing has none.
//                `label` = the technical label shown when the shoe is open, in the
//                drawing's own pixels (1356 × 846), riding along with its piece.
//     (later: model3d – the part's name inside the .glb)
export const layers = [
  {
    id: 'outsole',
    views: {
      sketch34: { piece: 'gray-sole', label: { anchor: [205, 760], bend: [160, 805], end: [-10, 805], text: 'Outsole' } },
    },
  },
  {
    id: 'midsole',
    views: {
      sketch34: { piece: 'white-midsole', label: { anchor: [300, 690], bend: [250, 640], end: [-10, 640], text: 'Midsole' } },
    },
  },
  { id: 'insole', restsOn: 'midsole', views: { sketch34: { piece: null } } }, // no piece in the drawing yet
  { id: 'upper', views: { sketch34: { piece: 'body' } } },
];

export const layerById = (id) => layers.find((layer) => layer.id === id);

// The drawing piece a layer shows up on (following `restsOn` when it has none).
export function pieceFor(layerId, view = 'sketch34') {
  const layer = layerById(layerId);
  if (!layer) return null;
  return layer.views[view]?.piece ?? (layer.restsOn ? pieceFor(layer.restsOn, view) : null);
}
