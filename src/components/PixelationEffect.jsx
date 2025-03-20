import { Effect } from 'postprocessing';
import { Uniform } from 'three';
import { EffectComposer } from "@react-three/postprocessing";
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';

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

export {GrayscaleEffect}


