import React ,{useEffect, useState} from 'react'

import { EmojiParticles, extractEmojis , findEmojiType, particleStyles  } from './EmojiEffector';
import { Html } from '@react-three/drei';


export default function EventBubble({ calName, event , isHovered, timeout = 2800 }) {

    const [emojis, setEmojis ] = useState();
    const [bubbles, setBubbles] = useState();

  useEffect(()=>{
    if(!event) return; 
    const emojis = extractEmojis(event.summary);

    const _bubbles=[];
    const _emojis=[];

    emojis.forEach(emj =>{
      const emojiType = findEmojiType(emj)
      var style = {}
      if(emojiType){
        style = particleStyles[emojiType];
      }
      _emojis.push(<EmojiParticles key={_emojis.length} emoji={emj} style={style}/>)

    })

    _bubbles.push(<PlaneObject key={_bubbles.length} text={ timeout === 'infinite'? calName :  event.summary} timeout={timeout} />)
    setBubbles(_bubbles);
    setEmojis(_emojis)
    
  },[ event ])

  return <>
  
  {emojis}


  <Html className='flex min-w-[120px]' zIndexRange={[0, 1]} center style={{
    transform: 'translate(-50%,calc(-100% - 10px))', zIndex:1,}}>

        {!isHovered ? bubbles:
          <span className="bubble">{calName} {event ? "("+event.summary+")" : null }</span>
        }

  </Html>
  </>; 

}


function PlaneObject({text, timeout}){
  const [hidden, setHidden] = useState(false)

  useEffect(()=>{
    if(timeout!=='infinite'){
      setTimeout(()=>{setHidden(true)},timeout)
    }
  },[])

  return <span className={`bubble ${hidden ? '':''}`}>{ text }</span>

}