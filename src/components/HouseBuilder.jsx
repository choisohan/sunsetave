import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { randInt } from 'three/src/math/MathUtils.js';
import { useHouseModel, useTexture } from '../contexts/modelContext';
import Sky from './Sky';
import { Pixelate } from '../shaders/CustomPostProcessing';


export default function HouseBuilder(props) {
  const [property, setProperty]= useState( { time: .5 , mesh:1, roof : 1, wallA:3, wallB:2, door:1, shade:1, windowsA:3, windowsB:2 });
  const modelContext = useHouseModel(); 
  const textureContext = useTexture(); 
  const [currentInt, setCurrentInt] = useState(0)

  useEffect(()=>{
    setProperty(_property=>({..._property,...props.property}))
  },[props.property])



  const swapGeometry=(changeNumb)=>{

    const maxNumb = Object.keys(modelContext).length-1; 

    var newNumb = currentInt + changeNumb; 
    if(newNumb>maxNumb){ newNumb = 1}
    if(newNumb < 1){ newNumb = maxNumb}
    setCurrentInt(newNumb);

    const newHouseMesh = Object.values(modelContext)[newNumb]
    setProperty(x=>({...x, mesh: newHouseMesh.name }))
  }

  const swapMap = ( selectedSection, changeNumb)=>{
    const currentInt = property[selectedSection] ; 
    var nextIndex = currentInt + changeNumb;


    var folderName = selectedSection;
    if( folderName[folderName.length-1] == "B"){
      folderName= folderName.replace('B','A');
    }

    const mapOptions = Object.keys(textureContext).filter(key=> key.includes(folderName) ).map(name=> parseInt(name.split('/')[1]));
    if(!mapOptions[nextIndex-1]){
      nextIndex = 1; 
    }

    setProperty(_property =>{
      const copy = {..._property};
      console.log( selectedSection, nextIndex )

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
    <div style={{display:'flex', width:'100%', maxWidth:'800px', gap:'10px'}} >

      <Canvas style={{aspectRatio:1.725}} camera={{position: [3,1,12], fov: 10 }}>
          <OrbitControls  target={[0,.9,0]}/>
          <Sky /> 
          <Pixelate />
          <House property ={property} onClick={()=>{}} updateTime={false}/>
      </Canvas>

      <div className='options'>
        <OptionSelector onChange={swapGeometry} >Geometry</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('roof',d) } } >Roof</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('wallA',d) } } >Wall A</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('wallB',d) } } >Wall B</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('windowsA',d) } } >Windows A</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('windowsB',d) } } >Windows B</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('door',d) } } >Door</OptionSelector>
        <OptionSelector onChange={ d =>{ swapMap('shade',d) } } >Shade</OptionSelector>
        <button onClick={generateRandom}>R</button>

      </div>
    </div>

    <div>
      Out
    </div>
  
    </>
  )

}


const OptionSelector = props =>{
  return <div className='optionSelector'>
    <button onClick={()=>{props.onChange(-1)}}>←</button>
    {props.children}
    <button onClick={()=>{props.onChange(+1)}}>→</button>
    </div>
} 