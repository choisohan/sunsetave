import { useThree } from '@react-three/fiber';
import {  EffectComposer } from '@react-three/postprocessing';
import {  Effect,  } from 'postprocessing';
import { useState, useEffect } from 'react';
import {   Uniform } from 'three';
import { BloomEffect } from 'postprocessing';
import { NoBlending } from 'three';
class PixelationEffect extends Effect {
  constructor({ pixelSize =10 , resolution = [window.innerWidth, window.innerHeight] } = {}) {
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


        float offset = 1.5 / pixelSize;

        //https://blenderartists.org/t/can-i-somehow-set-up-a-sharp-low-resolution/1323775/5
      pixelUv = vec2( (floor(uv.x / dxy.x) + offset) * dxy.x,(floor(uv.y / dxy.y) + offset) * dxy.y);
    



        vec4 color = texture2D( tDiffuse , pixelUv );
        //color.rgb = pow( color.rgb , vec3(2.5) ); 

        //
        outputColor.rgb = pow( color.rgb , vec3(2.5) ); 
        outputColor.a = 1.;


        
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


const Pixelate = ({size = 4 })=> {

  const [pixelSize, setPixelSize] = useState(size); 
  const {gl } = useThree();

  gl.setClearColor('white')
    // Listen for camera zoom or FOV changes

    const updatePixelSize = (e) => {
      setPixelSize( ps => Math.max(2, ps - e.deltaY/500 ) );
    };

    useEffect(() => {
      gl.domElement.addEventListener('wheel', updatePixelSize)
    }, []);


  return <EffectComposer>
<primitive object={new PixelationEffect({pixelSize: pixelSize})} />
<primitive object={new BloomEffect({luminanceThreshold : .5 , intensity:.075  , blendFunction : NoBlending })} />
      </EffectComposer>
}

export { Pixelate }


