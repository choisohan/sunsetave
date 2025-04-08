import { useEffect, useState } from "react";
import { useTimestamp, useUpdateTimestamp } from "../contexts/envContext"
import AddNewHouseForm from "./AddNewHouseForm";





export const CozyButton = (props)=>{

  return <button className="cozyButton" onClick={props.onClick}>{props.children}
      {props.tooltip ? <span className="tooltip">{props.tooltip}</span> : null }
    </button>
}

export const FastForwardButton = ()=>{
  const updateTimestamp = useUpdateTimestamp();
  const [isPlaying, setIsPlaying] = useState(false);


/*
  useEffect(() => {
    let animationFrameId;
    let count = 0;
    let lastUpdate = performance.now();
    const interval =1; // ms between updates (200ms = 5 times per second)
    
    const tick = (now) => {
      count+=1; 
      console.log( 'count',count)
      if (isPlaying) {
        if (now - lastUpdate >= interval) {
          updateTimestamp( x=> x + 3600000/30 ); // add 2 min per frame
          animationFrameId = requestAnimationFrame(tick); 
        }
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(tick); 
    }

    return () => cancelAnimationFrame(animationFrameId);


  }, [isPlaying]);
  */

  useEffect(() => {
    let count = 0;

    if (!isPlaying) return;
  
    const interval = setInterval(() => {
      count+=1; 
      console.log( 'count',count)
      updateTimestamp(x => x + 3600000 / 30);
    }, 200); // update every 200ms
  
    return () => clearInterval(interval);
  }, [isPlaying]);




  return <CozyButton tooltip="Play fast forward" onClick={()=>{setIsPlaying(!isPlaying);}} >{ !isPlaying ? "⏩" : "⏸️" } </CozyButton>
  

}

export const SkipBackwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp - 3600000 ); // subtract one hour
  }
  return(<CozyButton tooltip="An hour backward" onClick={ onClick} >⏮️</CozyButton>)
}

export const SkipForwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp + 3600000 ); //add one hour
  }
  return<CozyButton tooltip="An hour forward" onClick={ onClick}  >⏯️</CozyButton>
}



export const TimeTestButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp(  timestamp + 3600000*1000 ); //add one hour
  }
  return<CozyButton tooltip="timestamp = 0 " onClick={ onClick}  >🕵️</CozyButton>
}



export const ReloadButton = (props)=>{
  return <CozyButton tooltip="Reload the scene"  onClick={props.onClick} >🔄</CozyButton>
}




export const AddNewHouseButton =()=>{
  const [opened, setOpened] = useState(false);

  return <>
  <CozyButton tooltip="Add new calendar as a house" onClick={()=>{setOpened(true)}}>Add New House</CozyButton>
  {opened ? <AddNewHouseForm onClose={()=>{setOpened(false)}} onAddNew={()=>{}}/> :null }
  </>
}


export const EditModeButton = (props)=>{
  return <CozyButton tooltip="Edit My sunset Avenue" onClick={()=>{props.setEditMode(!props.editMode)}}>{props.editMode?"Exit Edit Mode":"Enter Edit Mode"}</CozyButton>
}



  /**
   * 
   * 
   * ▶
   * ⏩
   * ⏹⏪⏯️⏸️
   */