import React ,{useEffect, useState} from 'react'

import { EmojiParticles, extractEmojis , findEmojiType, particleStyles  } from './EmojiEffector';
import { Html } from '@react-three/drei';


export default function EventBubble({ calName, event , timeout = 2800 }) {

   const [objects, setObjects ] = useState();
  
  useEffect(()=>{
    if(!event) return; 
    const emojis = extractEmojis(event.summary);

    const _objects=[];
    
    emojis.forEach(emj =>{
      const emojiType = findEmojiType(emj)
      var style = {}
      if(emojiType){
        style = particleStyles[emojiType];
      }
      _objects.push(<EmojiParticles key={_objects.length} emoji={emj} style={style}/>)

    })

    _objects.push(<PlaneObject text={timeout === 'infinite'? calName :  event.summary} timeout={timeout} />)
    setObjects(_objects);

  },[ event ])

  return objects; 

}


function PlaneObject({text, timeout}){
  const [hidden, setHidden] = useState(false)

  useEffect(()=>{
    console.log( timeout )
    if(timeout!=='infinite'){
      setTimeout(()=>{setHidden(true)},timeout)
    }
  },[])

  return <Html className={`bubble ${hidden ? 'hidden':''}`} zIndexRange={[0, 1]} center style={{
    transform: 'translate(-50%,calc(-100% - 10px))', zIndex:1,}}>
        <span>{ text }</span>
</Html>
}