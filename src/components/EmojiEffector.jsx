import React, { useEffect , useMemo, useState ,useRef  } from 'react'
import { CanvasTexture , BufferAttribute , Vector3, NearestFilter  } from 'three';
import { useFrame } from '@react-three/fiber';

const DEFAULTPROPERTY = {
  count: 1, 
  speed : [.0, .0  , 0 ],
  lifetime: 1.,
  size: 3
}

export const EmojiParticles = ( { emoji , style } )=>{


  const PROPERTY= {...DEFAULTPROPERTY,...style}; 

  const pointsRef = useRef();
  const positions = useMemo(() => new Float32Array(PROPERTY.count * 3), []);
  const alphas = useMemo(() => new Float32Array(PROPERTY.count), []);
  const ages = useRef( new Array(PROPERTY.count).fill( Infinity )) ; // Infinity = dead
  const positionAttribute = useRef(null);
  const alphaAttribute = useRef(null);
  const texture = useMemo(()=>{return createEmojiTexture(emoji); })
  const frameCounter = useRef(0);
  const emitIndex = useRef(0);



  useEffect(() => {

    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      geometry.setAttribute('position',new BufferAttribute(positions, 3));
      positionAttribute.current = geometry.attributes.position;
      geometry.setAttribute('alpha', new BufferAttribute(alphas, 1) );
      alphaAttribute.current = geometry.attributes.alpha;
    }
  }, []);

  
  useFrame((state,delta) => {
    frameCounter.current++;

    // Emit a new particle every 30 frames
    if (frameCounter.current % 30 === 0) {
      const i = emitIndex.current;

      // Set initial position
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.0;

      // Reset age
      ages.current[i] = 0;
      alphas[i] = 1. ;

      emitIndex.current = (emitIndex.current + 1) % PROPERTY.count;
    }

    // Update all particles
    for (let i = 0; i < PROPERTY.count; i++) {
          // Update age
        ages.current[i] += delta;
        const t = ages.current[i] / PROPERTY.lifetime; 



        //update attribute
        if(PROPERTY.count > 1) {
          if (t >= 1) {
            alphas[i] = 0;
            continue;
          }
          alphas[i] = 1 - t;
        }


        positions[ i * 3 + 1] +=  (delta * PROPERTY.speed[0]  ) ;
        positions[ i * 3 + 1] +=  (delta * PROPERTY.speed[1]  ) ;
        positions[ i * 3 + 1] +=  (delta * PROPERTY.speed[2]  ) ;


    }


    // Mark attributes as needing update
    if (positionAttribute.current) {positionAttribute.current.needsUpdate = true;}
    if (alphaAttribute.current) {alphaAttribute.current.needsUpdate = true;}
  });

  
  if (!texture) return null;
  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        map={texture}
        size={PROPERTY.size}
        sizeAttenuation
        transparent
        depthWrite={false}
        onBeforeCompile={(shader) => {    

          shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            `
              attribute float alpha;
              varying float vAlpha;
              void main() {
                vAlpha = alpha  ;
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            'uniform vec3 diffuse;',
            `uniform vec3 diffuse;
            varying float vAlpha;
            `
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            'vec4 diffuseColor = vec4( diffuse, vAlpha );'
          );

        }}
      />
      
          </points>
  )
}


export function extractEmojis(str) {
  return [...str.matchAll(/\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*/gu)]
    .map(match => match[0]);
}

export const particleStyles = {
  "cloudy": { speed:[0,1,0], count: 5},
}

const emojiTypes ={
  "cloudy" : ["🥐","🥖" ,"🎵","💤","💤" ,"♫","♪" ]
}

export function findEmojiType(emoji) {
  return Object.entries(emojiTypes).find(([, emojis]) => emojis.includes(emoji))?.[0] || null;
}



export const createEmojiTexture = (emoji, size = 16) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.font = `${size * 0.8}px "Twemoji"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);
  const texture = new CanvasTexture(canvas);
  texture.magFilter = NearestFilter; 
  texture.needsUpdate = true;
  return texture;
};

