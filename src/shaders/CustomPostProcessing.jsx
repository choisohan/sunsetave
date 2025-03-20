import { Effect } from 'postprocessing';
import { Uniform } from 'three';
import { BlendFunction } from 'postprocessing';
class GrayscaleEffect extends Effect {
  constructor({ intensity =.5  } = {}) {
    super(
      'GrayscaleEffect', 
      `
      uniform float intensity;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        float avg = (inputColor.r + inputColor.g + inputColor.b) / 3.0;
        outputColor = mix(inputColor, vec4(vec3(avg), inputColor.a), intensity);
      }
      `,
      {
        uniforms: new Map([
          ['intensity', new Uniform(intensity)] // Grayscale intensity uniform
        ])
      }
    );
  }
}


class PixelationEffect extends Effect {
  constructor({ pixelSize = 5 , resolution = [window.innerWidth, window.innerHeight] } = {}) {
    // Define the shader code for pixelation
    super(
      'PixelationEffect',
      `
      uniform sampler2D tDiffuse;  // Input texture (scene image)
      uniform float pixelSize;     // Pixel size (controls the "pixelation")
      uniform vec2 resolution;     // Resolution of the screen or canvas

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

        // Calculate pixel grid size based on the pixel size and resolution
        vec2 dxy = pixelSize / resolution;
        vec2 pixelUv = floor(uv / dxy) * dxy;

        outputColor = texture2D(tDiffuse, pixelUv) ; 
        outputColor.rgb = pow(outputColor.rgb, vec3(2.2));  

      }
      `,
      {
        uniforms: new Map([
          ['pixelSize', new Uniform(pixelSize)],
          ['resolution', new Uniform(resolution)],
        ])
      }
    );
  }
}
  

export { GrayscaleEffect , PixelationEffect }


