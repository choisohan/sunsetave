import { useEffect, useState } from "react";
import { useTime, useUpdateTime } from "../contexts/envContext"




export const FastForwardButton = ()=>{
  const time = useTime();
  const updateTime = useUpdateTime();
  const [isPlaying, setIsPlaying] = useState(false);



  useEffect(() => {
    let animationFrameId;

    const tick = () => {
      if (isPlaying) {
        console.log( time )
        updateTime( x=> x + 15/1440 );
        animationFrameId = requestAnimationFrame(tick); // Continue logging each frame
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(tick); // Start logging when animation is playing
    }

    // Cleanup the animation frame on component unmount or when animation stops
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);



  return <button onClick={()=>{setIsPlaying(!isPlaying);}} >
        { !isPlaying ? "⏩" : "⏸️" }</button>

}

export const SkipForwardButton = ()=>{
  const time = useTime();
  const updateTime = useUpdateTime();
  
  const onClick = ()=>{
    updateTime( time+ 1/24 );
  }
  return<button onClick={ onClick} >⏯️</button>
}



  /**
   * 
   * 
   * ▶
   * ⏩
   * ⏹⏪⏯️⏸️
   */