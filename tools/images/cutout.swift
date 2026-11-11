// Cuts the main object out of a picture (removes the background), using Apple's
// "lift subject" feature, and crops to the object. Saves a PNG with see-through edges.
//   npm run image:cutout -- design/originals/x.png src/assets/x.png
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count == 3, let input = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
  print("usage: cutout <in.png> <out.png>"); exit(1)
}
let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: input)
try handler.perform([request])
guard let result = request.results?.first else { print("No object found."); exit(1) }
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: true)
let out = CIImage(cvPixelBuffer: buffer)
let cg = CIContext().createCGImage(out, from: out.extent)!
let png = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!
try png.write(to: URL(fileURLWithPath: args[2]))
print("Saved \(args[2]): \(Int(out.extent.width)) × \(Int(out.extent.height))")
