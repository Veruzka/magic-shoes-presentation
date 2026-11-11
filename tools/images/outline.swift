// Measures a cut-out picture's outline: for every Nth row, where the object
// starts and ends (left, right) and how wide it is. Use it to find a part's
// centre and width (e.g. the widest rows of a round pad).
//   npm run image:outline -- src/assets/fsr-render-front.png 10
import AppKit

let args = CommandLine.arguments
guard args.count >= 2, let data = try? Data(contentsOf: URL(fileURLWithPath: args[1])),
      let rep = NSBitmapImageRep(data: data) else { print("usage: outline <image.png> [step]"); exit(1) }
let step = args.count > 2 ? Int(args[2]) ?? 10 : 10
print("size \(rep.pixelsWide) × \(rep.pixelsHigh)")
print("row  left  right  width")
var y = 0
while y < rep.pixelsHigh {
  var left = -1, right = -1
  for x in 0..<rep.pixelsWide where rep.colorAt(x: x, y: y)!.alphaComponent > 0.5 {
    if left < 0 { left = x }; right = x
  }
  print(y, left, right, left < 0 ? 0 : right - left)
  y += step
}
