import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { randInt } from 'three/src/math/MathUtils.js';
import { useHouseModel, useTexture } from '../contexts/modelContext';
import Sky from './Sky';
import { Pixelate } from '../shaders/CustomPostProcessing';
import { CozyButton } from './Buttons';
import CameraControls from './CameraControls';


export default function HouseBuilder(props) {
  const [property, setProperty]= useState( { time: .5 , mesh: 1 , roof : 1, wallA:1, wallB:1, door:1, shade:1, windowsA:1, windowsB:1 });
  const modelContext = useHouseModel(); 
  const textureContext = useTexture(); 

  useEffect(()=>{
    setProperty(_property=>({..._property,...props.property}))
  },[props.property])


  const swapGeometry=(changeNumb)=>{
    const maxNumb = Object.keys(modelContext).length-1; 
    var newNumb = property.mesh + changeNumb; 
    if(newNumb>maxNumb){ newNumb = 1}
    if(newNumb < 1){ newNumb = maxNumb}
    setProperty(x=>({...x, mesh: newNumb }))
  }

  const swapMap = ( selectedSection, changeNumb)=>{
    const currentInt = property[selectedSection] ; 
    var nextIndex = currentInt + changeNumb;


    var folderName = selectedSection;
    if( folderName[folderName.length-1] === "B"){
      folderName= folderName.replace('B','A');
    }

    const mapOptions = Object.keys(textureContext).filter(key=> key.includes(folderName) ).map(name=> parseInt(name.split('/')[1]));
    if(!mapOptions[nextIndex-1]){
      nextIndex = 1; 
    }

    setProperty(_property =>{
      const copy = {..._property};
      copy[selectedSection] = nextIndex ;
      return copy; 
    })

  }

  const generateRandom = ()=>{
    
    swapGeometry(randInt(1,7));
    swapMap('roof',randInt(0,5));
    swapMap('wallA',randInt(0,5));
    swapMap('wallB',randInt(0,5));
    swapMap('windowsA',randInt(0,5));
    swapMap('windowsB',randInt(0,5));
    swapMap('shade',randInt(0,3));
    swapMap('door',randInt(0,3));

  }

  return (<>
    <div className='flex gap-2 flex-col md:flex-row justify-center' >

      <Canvas className='aspect-[4/3]	lg:aspect-[1/1] lg:max-w-[500px]' camera={{position: [6,1,12], fov: 12 }}>
        <CameraControls target={[.25,1,0]} />
          <Pixelate />
          <House property={property}  onClick={()=>{}} updateTime={false} hoverable={false} onUpdateProperty={()=>{}}/>
      </Canvas>

      <div className='lg:p-2 self-center flex flex-wrap lg:flex-nowrap lg:flex-col' id='options'>
        <OptionSelector onChange={swapGeometry} >Geometry</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('roof',d) } } >Roof</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('wallA',d) } } >Wall A</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('wallB',d) } } >Wall B</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('windowsA',d) } } >Windows A</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('windowsB',d) } } >Windows B</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('door',d) } } >Door</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('shade',d) } } >Shade</OptionSelector>

        <CozyButton className='self-center pixelButton scale-75' onClick={generateRandom} tooltip="A random house">
          <img src='/images/game_die.png' alt='shuffle'/>
        </CozyButton>

      </div>

      
    </div>  
    </>
  )

}


const OptionSelector = props =>{
  return <div className='choice items-center relative flex justify-between w-[180px] scale-90 lg:w-full'>
    <CozyButton className='pixelButton scale-75 ' onClick={()=>{props.onChange(-1)}}><img src='/images/arrow_backward.png' alt='-1' /></CozyButton>
    {props.children}
    <CozyButton className='pixelButton scale-75 ' onClick={()=>{props.onChange(+1)}}><img src='/images/arrow_forward.png' alt='+1' /></CozyButton>
    </div>
} 

const OptionSelector2 = props =>{
  return <div>
    
  </div>
}