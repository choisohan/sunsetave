import React, {  useEffect, useRef } from 'react'
import { useState } from 'react';
import House from '../components/House';
import { Canvas } from '@react-three/fiber';
import { useParams } from 'react-router-dom';
import CameraControls from '../components/CameraControls';
import { Pixelate } from '../shaders/CustomPostProcessing';
import Sky from '../components/Sky';
import * as Buttons from '../components/Buttons';
import {  Vector3 , Object3D } from 'three';
import { Clock, timestampToHourFloat } from '../components/Clock';
import { EventTable } from '../components/EventTable';
import TerrainMesh from '../components/TerrainMesh';
import moment from 'moment-timezone';

export default function HouseViewer(props) {
  const divRef = useRef();
  const { param } = useParams();
  const [ name , setName ] = useState('????')
  const canvasRef = useRef();  
  const [events, setEvents]= useState();
  //const setTimezoneOverride = useSetTimezoneOverride();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile , setIsMobile] = useState(false);
  const [timeDiff, setTimeDiff] = useState(0);
  const [cameraPosition, setCameraPosition] = useState( );
  const [cameraTarget, setCameraTarget] = useState( );
  const [property, setProperty] = useState({ id :props.id|| param  });

  const onUpdateProperty =( newProperty )=>{
  
    if(!newProperty){
      setName( 'NOT FOUND');
      return;
    }
    if(newProperty.name) setName(newProperty.name)
    if(newProperty.events) setEvents(newProperty.events);

    if(newProperty.timezone){
      const diff = moment.tz( "2025-04-16 12:00" , newProperty.timezone ).diff(moment("2025-04-16 12:00"))
      setTimeDiff(diff);
      setProperty(_prop=>({..._prop, timezone: newProperty.timezone}))
    }

  }

  useEffect(() => {
    var _isMobile = false; 

    if (divRef.current) {
      const width = divRef.current.getBoundingClientRect().width;
      if( width < 768 ){
        _isMobile = true; 
      }
      else{
        _isMobile =window.matchMedia("(max-width: 768px)").matches;
      }

      setIsMobile(_isMobile)

    }




  }, [divRef.current ]);


  const getGrids =(grids)=>{
    const i  =  Math.floor ( Math.random() * grids.length ) ;
    const transform = grids[i];
    setProperty(_prop=>({..._prop, ...transform}))

    const dummy = new Object3D();
    dummy.position.copy( transform.position);
    
    dummy.rotation.set( transform.rotation.x, transform.rotation.y, transform.rotation.z); 
    const forward = new Vector3(0,-1, 0); // forward in local space
    forward.applyQuaternion(dummy.quaternion); // convert to world space
    const camPos = forward.clone().multiplyScalar(15).add(transform.position).add(new Vector3(0,4,0))

    
    setCameraPosition(camPos)

    const camTarget = transform.position.clone().add(new Vector3(0,.5,0));
    setCameraTarget(camTarget)
    

  }


return (
<div className={`houseViewer ${ darkMode ? "darkMode" : ""} ${isMobile ? "small" :"" } ${props.className}`}
                ref={divRef} >

  <Canvas className="w-full h-full "  camera={{fov: 20}} ref={canvasRef}>
    <TerrainMesh editMode={false} timeDiff={timeDiff} setGrids={getGrids}/>
    <CameraControls position={cameraPosition} target={cameraTarget}/>

    <Sky timeDiff={timeDiff}/>
    <Pixelate />
    <House property={ property } onUpdateProperty ={ onUpdateProperty } hoverable={false} />
  </Canvas>




  <div className="houseInfo" >
    <div className='text-left title'>
      <span className='inline-flex '>
        <img src='/images/userProfile.png' className='w-[35px] h-[35px] lg:w-[70px] lg:h-[70px]' alt='profile'/>
       <a href={`/`+ props.id|| param  }>
        <span className='[line-break:anywhere]'>{ name }</span>
       </a>
      </span>
    </div>
    <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black justify-self-end' >
        <Clock /> {property.timezone}
    </div>


    <div className='flex column lg:gap-1 lg:p-2 w-full hideOnSmall '>
      <Buttons.SkipBackwardButton />
      <Buttons.FastForwardButton />
      <Buttons.SkipForwardButton />
      <Buttons.RecordButton canvasRef={canvasRef}/>
      <Buttons.ReloadButton />
    </div>
    <EventTable events={events}/>

  </div>


</div>
)

}




