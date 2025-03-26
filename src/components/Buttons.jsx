import { useEffect, useState } from "react";
import { useTime, useUpdateTime } from "../contexts/envContext"
import AddNewHouseForm from "./AddNewHouseForm";




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

export const ReloadButton = ()=>{
  return <button>Reload</button>
}




export const AddNewHouseButton =()=>{
  const [opened, setOpened] = useState(false);
  return <>
  <button onClick={()=>{setOpened(true)}}>Add New House</button>
  {opened ? <AddNewHouseForm onAddNew={()=>{}}/> :null }
  </>
}


export const EditModeButton = (props)=>{
  return <button onClick={()=>{props.setEditMode(!props.editMode)}}>{props.editMode?"Exit Edit Mode":"Enter Edit Mode"}</button>
}



  /**
   * 
   * 
   * ▶
   * ⏩
   * ⏹⏪⏯️⏸️
   */