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
import { Clock, GetColorByTZ, timestampToHourFloat } from '../components/Clock';
import { EventTable } from '../components/EventTable';
import TerrainMesh from '../components/TerrainMesh';
import moment from 'moment-timezone';
import { useTimestamp } from '../contexts/envContext';

export default function HouseViewer(props) {
  const { param } = useParams();

  const divRef = useRef();
  const canvasRef = useRef();  

  const [darkMode, setDarkMode] = useState(false);
  const [isMobile , setIsMobile] = useState(false);
  const [cameraPosition, setCameraPosition] = useState( );
  const [cameraTarget, setCameraTarget] = useState( );
  const [transform , setTransform ] = useState({}); 
  const timestamp = useTimestamp();
  const [loaded, setLoaded] = useState(false); 

  const [property, setProperty] = useState({
    name:'????',
    description:'', 
    timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeDiff: 0, 
    events: []
  });


  
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
  }, []);

  useEffect(()=>{
    if(!timestamp )return; 
    const tf = timestampToHourFloat(timestamp, property.timezone);
    setDarkMode( (tf < 7/24 || tf > 19/24))
  },[timestamp, property.timezone])


  const getGrids =(grids)=>{
    const i  =  Math.floor ( Math.random() * grids.length ) ;
    const _transform = grids[i];
    setTransform(_transform);

    const dummy = new Object3D();
    dummy.position.copy( _transform.position);
    
    dummy.rotation.set( _transform.rotation.x, _transform.rotation.y, _transform.rotation.z); 
    const forward = new Vector3(0,-1, 0); // forward in local space
    forward.applyQuaternion(dummy.quaternion); // convert to world space
    const camPos = forward.clone().multiplyScalar(15).add(_transform.position).add(new Vector3(0,4,0))

    
    setCameraPosition(camPos)

    const camTarget = _transform.position.clone().add(new Vector3(0,.5,0));
    setCameraTarget(camTarget)
    

  }
  const onUpdateProperty =( newProperty )=>{
    setProperty( x=>({...x,
      ...newProperty, 
      timeDiff: moment.tz( "2025-04-16 12:00" , newProperty.timezone ).diff(moment("2025-04-16 12:00"))
    }) )
    setLoaded(true)
  }

return (
<div className={`houseViewer ${ darkMode ? "darkMode" : ""} ${isMobile ? "small" :"" } ${props.className} `}
                ref={divRef} >

  <Canvas className={`w-full h-full transition-opacity duration-500 ${!loaded ? "opacity-0":"" }`}  camera={{fov: 20}} ref={canvasRef}>
    <Pixelate />
    {!cameraPosition ? null : <>
      <CameraControls position={cameraPosition} target={cameraTarget} enableZoom={false}/>
      <Sky timeDiff={property.timeDiff}/>

    </>}
    <TerrainMesh editMode={false} timeDiff={property.timeDiff } setGrids={getGrids}/>
    <House id={props.id|| param}  transform={transform} onUpdateProperty ={ onUpdateProperty } hoverable={false} />
  </Canvas>



  {!loaded ? <div className="loading-screen">LOADING...</div> : 
    <div className="houseInfo p-3" >
    <div className='text-left title'>
      <span className='inline-flex '>
        <img src='/images/userProfile.png' className='hidden w-[35px] h-[35px] lg:w-[70px] lg:h-[70px]' alt='profile'/>
       <a href={`/`+ props.id|| param  }>
        <span className='whitespace-nowrap text-3xl'>{ property.name }</span>
       </a>
      </span>
    </div>
    <span className='text-sm'>{ property.description.length > 60 ? property.description.slice(0, 55)+"..." : property.description}</span>

    <div className='bg-[#748060] p-1 m-1 w-fit border-4 border-black justify-self-end text-sm' >
        <Clock timezone={property.timezone}/> <div  style={{color: GetColorByTZ(property.timezone)}}>{property.timezone}</div>
    </div>


    <div className='flex column lg:gap-1 lg:p-2 w-full hideOnSmall '>
      <Buttons.SkipBackwardButton />
      <Buttons.SkipForwardButton />
      <Buttons.FastForwardButton />
      <Buttons.RecordButton canvasRef={canvasRef}/>
      <Buttons.ReloadButton />
    </div>
    <EventTable events={property.events}/>

  </div>
  
  } 



</div>

)

}




