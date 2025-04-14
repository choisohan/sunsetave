import { useEffect, useRef, useState } from "react";
import { useTimestamp, useUpdateTimestamp } from "../contexts/envContext"
import AddNewHouseForm from "./AddNewHouseForm";
import Info from "./Info";





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
    if (!isPlaying) return;

    const interval = setInterval(() => {
      updateTimestamp(x => x + 3600000 / 30);
    }, 200); // update every 200ms
  
    return () => clearInterval(interval);
  }, [isPlaying, updateTimestamp]);




  return <CozyButton className='pixelButton' tooltip="Play fast forward" onClick={()=>{setIsPlaying(!isPlaying);}} >
   <img alt='fast_forward' src={!isPlaying? '/images/fast_forward.png' : '/images/pause.png' } />
     </CozyButton>
  

}

export const SkipBackwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp - 3600000 ); // subtract one hour
  }
  return(<CozyButton  className='pixelButton'  tooltip="An hour backward" onClick={ onClick} ><img alt='backward' src='/images/arrow_skip_backward.png' />
</CozyButton>)
}

export const SkipForwardButton = ()=>{
  const timestamp = useTimestamp();
  const updateTimestamp = useUpdateTimestamp();
  
  const onClick = ()=>{
    updateTimestamp( timestamp + 3600000 ); //add one hour
  }
  return<CozyButton  className='pixelButton'  tooltip="An hour forward" onClick={ onClick}  >

<img alt='skip_forward' src='/images/arrow_skip_forward.png' />

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

  const updateTimestamp = useUpdateTimestamp();

  const onClick = ()=>{
    updateTimestamp(new Date().valueOf() )
  }
  return <CozyButton  className='pixelButton'  tooltip="Reload the scene"  onClick={onClick} >
    <img alt='reload' src='/images/arrows_counterclockwise.png' />
</CozyButton>
}




export const AddNewHouseButton =(props)=>{
  const [opened, setOpened] = useState(false);

  return <>
  <CozyButton  className='pixelButton'  tooltip="Add new calendar as a house" onClick={()=>{setOpened(true)}}>
    <img alt='add' src='/images/plus_sign.png' />
  </CozyButton>
  {opened ? <AddNewHouseForm currentIds={props.currentIds} onClose={()=>{setOpened(false)}} onAddNew={newProperty=>{
    setOpened(false);
    props.onAddNew(newProperty);
  }}/> :null }
  </>
}

export const InfoButton = (props)=>{
  const [opened, setOpened] = useState(false);

  return <>
  <CozyButton  className='pixelButton'  tooltip="???" onClick={()=>{setOpened(true)}}>
        <img alt='info' src='/images/house.png' />    
    </CozyButton>
    
    {opened ? <Info onClose={()=>{setOpened(false)}} /> :null }
  
  </>
}



export const EditModeButton = (props)=>{
  return <CozyButton  className='pixelButton'  tooltip="Edit My sunset Avenue" onClick={()=>{props.setEditMode(!props.editMode)}}>
        <img alt='edit' src='/images/hammer_and_pick.png' />    
    </CozyButton>
}


export const RecordButton = (props)=>{

  const [isRecording , setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chunksRef = useRef([]);  // Ref to store video chunks
  const downloadLink= useRef(document.createElement('a'));
  const updateTimestamp = useUpdateTimestamp();

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      updateTimestamp(x => x + 3600000 / 30);
    }, 200); // update every 200ms
  
    return () => clearInterval(interval);
  }, [isRecording, updateTimestamp]);


  const StartRecording = ()=>{
    setIsRecording(true)
    // Get the canvas element from the ref (ensure it's your Three.js canvas)
    const canvas = props.canvasRef.current;

    if (canvas) {
      const stream = canvas.captureStream(30);  // Capture the stream at 30 FPS

      const options = {
        mimeType: 'video/webm;codecs=vp8', 
        videoBitsPerSecond: 5000000 // high bitrate = better quality
      };
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);  // Store video chunks
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        downloadVideo(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);  // Store the recorder reference for stopping
    }
  }

  const StopRecording = ()=>{
    setIsRecording(false)
    if (mediaRecorder) {
      mediaRecorder.stop();  // Stop the recording
    }
  }

  const downloadVideo = (blob) => {
    if (blob) {
      downloadLink.current.href =  URL.createObjectURL(blob);
      downloadLink.current.download = 'output-video.webm';
      downloadLink.current.click();
    }
  };


  return (
    <div>
      {!isRecording ? (
        <CozyButton
          className={`pixelButton  ${isRecording? 'pressed':''}`}
          tooltip="Start Record"
          onClick={StartRecording}
        >
          <img src="/images/record.png" alt="Start Recording" />
        </CozyButton>
      ) : (
        <CozyButton
          className={`pixelButton  ${isRecording? 'pressed':''}`}
          tooltip="Stop Record"
          onClick={StopRecording}
        >
          <img src="/images/stop.png" alt="Stop Recording" />
        </CozyButton>
      )}
      
    </div>
  );


}




export const TimeShiftButton = (props)=>{
  return <CozyButton  className='pixelButton'  tooltip="Shift Timezone" onClick={()=>{}}>
        <img alt='edit' src='/images/clock.png' />    
    </CozyButton>
}

