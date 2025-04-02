import { useEffect, useState } from "react";
import { useTimestamp, useUpdateTimestamp } from "../contexts/envContext"
import AddNewHouseForm from "./AddNewHouseForm";




export const FastForwardButton = ()=>{
  const updateTimestamp = useUpdateTimestamp();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let animationFrameId;

    const tick = () => {
      if (isPlaying) {
        updateTimestamp( x=> x + 3600000/30 ); // add 2 min per frame
        animationFrameId = requestAnimationFrame(tick); 
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(tick); 
    }
    
    return () => cancelAnimationFrame(animationFrameId);


  }, [isPlaying]);



  return <button className="bg-white" onClick={()=>{setIsPlaying(!isPlaying);}} >
        { !isPlaying ? "⏩" : "⏸️" }</button>

}

export const SkipBackwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp - 3600000 ); // subtract one hour
  }
  return<button onClick={ onClick} className="bg-white" >⏪</button>
}

export const SkipForwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp + 3600000 ); //add one hour
  }
  return<button onClick={ onClick} className="bg-white" >⏯️</button>
}

export const ReloadButton = (props)=>{
  return <button className="bg-white" onClick={props.onClick} >🔄</button>
}


export const AddNewHouseButton =()=>{
  const [opened, setOpened] = useState(false);

  return <>
  <button className="bg-white" onClick={()=>{setOpened(true)}}>Add New House</button>
  {opened ? <AddNewHouseForm onClose={()=>{setOpened(false)}} onAddNew={()=>{}}/> :null }
  </>
}


export const EditModeButton = (props)=>{
  return <button className="bg-white" onClick={()=>{props.setEditMode(!props.editMode)}}>{props.editMode?"Exit Edit Mode":"Enter Edit Mode"}</button>
}



  /**
   * 
   * 
   * ▶
   * ⏩
   * ⏹⏪⏯️⏸️
   */