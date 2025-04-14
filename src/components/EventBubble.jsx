import React ,{useEffect, useState} from 'react'

import { EmojiParticles, extractEmojis , findEmojiType, particleStyles  } from './EmojiEffector';



export default function EventBubble({ event  }) {

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

    setObjects(_objects);



  },[ event ])

  return objects; 

  /*
    if(!events || !text) return; 
  return (
    <Html className='bubble' zIndexRange={[0, 1]} position={[0, getMeshHeight(mesh) +.5, -0.25]} center style={{
        transform: 'translate(-50%,calc(-100% - 10px))', zIndex:1,}}>
            <span>{ text }</span>
    </Html>
          
    )
        */ 



}
