import React, { useEffect , useMemo, useState ,useRef  } from 'react'
import { CanvasTexture } from 'three';
import { useFrame } from '@react-three/fiber';

export default function EmojiEmitter({emoji}) {

  const pointsRef = useRef();
  const [texture, setTexture] = useState(null);

    useEffect(()=>{
      const createEmojiTexture = (emoji, size = 32) => {
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
  
      setTexture( createEmojiTexture(emoji) );  // Set the texture
    },[emoji])

  const positions = useMemo(() => {
    const count = 5; 
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 1;
    }
    return arr;
  }, []);

  /*
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });
  */

  if (!texture) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial map={texture} size={1} sizeAttenuation transparent depthWrite={false} />
    </points>
  )
}


function extractEmojis(str) {
  // Regex to match emoji, including multi-codepoint ones (like ❤️ or 🇰🇷)
  return [...str.matchAll(/([\p{Emoji_Presentation}\p{Emoji}\u200d]+)/gu)]
    .map(match => match[0])
    .filter(e => /\p{Emoji}/u.test(e));
}
