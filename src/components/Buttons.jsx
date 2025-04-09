import { useEffect, useRef, useState } from "react";
import { useTimestamp, useUpdateTimestamp } from "../contexts/envContext"
import AddNewHouseForm from "./AddNewHouseForm";





export const CozyButton = (props)=>{
  const audioRef = useRef();

  const onEnter=()=>{
    audioRef.current.volume = .2;
    audioRef.current.play().catch(err=>{})
  }

  return <span className={"cozyButton "+ (props.className ? props.className :"") } onPointerEnter={onEnter} onClick={props.onClick}>
      {props.children}

      {props.tooltip ? <span className="tooltip">{props.tooltip}</span> : null }
      <audio ref={audioRef} src="/audios/blipSelect.wav" />
    </span>
}

export const FastForwardButton = ()=>{
  const updateTimestamp = useUpdateTimestamp();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let count = 0;

    if (!isPlaying) return;
  
    const interval = setInterval(() => {
      count+=1; 
      updateTimestamp(x => x + 3600000 / 30);
    }, 200); // update every 200ms
  
    return () => clearInterval(interval);
  }, [isPlaying]);




  return <CozyButton className='pixelButton' tooltip="Play fast forward" onClick={()=>{setIsPlaying(!isPlaying);}} >
   <img src={!isPlaying? '/images/fast_forward.png' : '/images/pause.png' } />
     </CozyButton>
  

}

export const SkipBackwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp - 3600000 ); // subtract one hour
  }
  return(<CozyButton  className='pixelButton'  tooltip="An hour backward" onClick={ onClick} ><img src='/images/arrow_skip_backward.png' />
</CozyButton>)
}

export const SkipForwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp + 3600000 ); //add one hour
  }
  return<CozyButton  className='pixelButton'  tooltip="An hour forward" onClick={ onClick}  >

<img src='/images/arrow_skip_forward.png' />

  </CozyButton>
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
  return <CozyButton  className='pixelButton'  tooltip="Reload the scene"  onClick={props.onClick} >
    <img src='/images/arrows_counterclockwise.png' />
</CozyButton>
}




export const AddNewHouseButton =(props)=>{
  const [opened, setOpened] = useState(false);

  return <>
  <CozyButton  className='pixelButton'  tooltip="Add new calendar as a house" onClick={()=>{setOpened(true)}}>
    <img src='/images/plus_sign.png' />
  </CozyButton>
  {opened ? <AddNewHouseForm currentIds={props.currentIds} onClose={()=>{setOpened(false)}} onAddNew={newProperty=>{
    setOpened(false);
    props.onAddNew(newProperty);
  }}/> :null }
  </>
}


export const EditModeButton = (props)=>{
  return <CozyButton  className='pixelButton'  tooltip="Edit My sunset Avenue" onClick={()=>{props.setEditMode(!props.editMode)}}>
        <img src='/images/hammer_and_pick.png' />    
    </CozyButton>
}



export const RecordButton = (props)=>{
  return <CozyButton  className='pixelButton'  tooltip="Startb Record" onClick={()=>{}}>
        <img src='/images/record.png' />    
    </CozyButton>
}




