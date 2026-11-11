// Walks across one row (or down one column) of a picture and lists the bands
// it crosses, so you can find exact positions of lines and parts:
//   S = silver/white (bright)   K = black (dark)   m = in between   . = see-through
// Example output: "K6-31 S32-40" = dark from pixel 6 to 31, then bright from 32 to 40.
//   npm run image:bands -- src/assets/fsr-render-front.png row 264
import AppKit

let args = CommandLine.arguments
guard args.count == 4, let data = try? Data(contentsOf: URL(fileURLWithPath: args[1])),
      let rep = NSBitmapImageRep(data: data), let n = Int(args[3]) else {
  print("usage: bands <image.png> row|col <number>"); exit(1)
}
let isRow = args[2] == "row"
let length = isRow ? rep.pixelsWide : rep.pixelsHigh
var bands: [String] = []
var start = 0, last = ""
for i in 0..<length {
  let c = isRow ? rep.colorAt(x: i, y: n)! : rep.colorAt(x: n, y: i)!
  let brightness = (c.redComponent + c.greenComponent + c.blueComponent) / 3
  let kind = c.alphaComponent < 0.5 ? "." : (brightness > 0.55 ? "S" : (brightness < 0.25 ? "K" : "m"))
  if kind != last { if i > 0 { bands.append("\(last)\(start)-\(i - 1)") }; start = i; last = kind }
}
bands.append("\(last)\(start)-\(length - 1)")
print(bands.joined(separator: " "))
