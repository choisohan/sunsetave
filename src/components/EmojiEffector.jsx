import React, { useEffect , useMemo, useState ,useRef  } from 'react'
import { CanvasTexture , BufferAttribute , Vector3  } from 'three';
import { useFrame } from '@react-three/fiber';




const MAX_PARTICLES = 5;
const LIFETIME =.5 ; // frames

const EmojiParticles = ({ emoji })=>{

  const pointsRef = useRef();
  const positions = useMemo(() => new Float32Array(MAX_PARTICLES * 3), []);
  const alphas = useMemo(() => new Float32Array(MAX_PARTICLES), []);
  const ages = useRef( new Array(5).fill( Infinity )) ; // Infinity = dead
  const positionAttribute = useRef(null);
  const alphaAttribute = useRef(null);
  const texture = useMemo(()=>{
    return createEmojiTexture(emoji); 
  })
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

    // Emit a new particle every 5 frames
    if (frameCounter.current % 5 === 0) {
      const i = emitIndex.current;

      // Set initial position
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      // Reset age
      ages.current[i] = 0;
      alphas[i] = 1;

      emitIndex.current = (emitIndex.current + 1) % MAX_PARTICLES;
    }

    // Update all particles
    for (let i = 0; i < MAX_PARTICLES; i++) {
          // Update age
        ages.current[i] += delta;
        const t = ages.current[i] / LIFETIME; 

        if (t >= 1) {
          alphas[i] = 0;
          continue;
        }

        //update attribute
        alphas[i] = 1 - t;
        positions[ i * 3 + 1] +=  (delta *1.5    ) ; // only position Y

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
        size={2}
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




export default function EmojiEffector({text}) {
  const [emojis, setEmojis] = useState([]);

  function extractEmojis(str) {
    // Regex to match emoji, including multi-codepoint ones (like ❤️ or 🇰🇷)
    return [...str.matchAll(/([\p{Emoji_Presentation}\p{Emoji}\u200d]+)/gu)]
      .map(match => match[0])
      .filter(e => /\p{Emoji}/u.test(e));
  }
  
    useEffect(()=>{
      setEmojis(extractEmojis(text));
    },[text])
  return emojis.map((emoji, i)=><EmojiParticles key={i} emoji={emoji} />)
}




export const createEmojiTexture = (emoji, size = 32) => {
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
  texture.needsUpdate = true;
  return texture;
};

