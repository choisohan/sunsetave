import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { randInt } from 'three/src/math/MathUtils.js';
import { useModel, useTexture } from '../contexts/modelContext';

export default function HouseBuilder(props) {
  const [property, setProperty]= useState({name:'house_A1', roof:'R1', wall:'W1', windows:'W1' });
  const modelContext = useModel(); 
  const textureContext = useTexture(); 
  const [houseModels, setHouseModels] = useState([]);
  const [currentInt, setCurrentInt] = useState(0)

  useEffect(()=>{
    setProperty(_property=>({..._property,...props.property}))
  },[props.property])

  useEffect(()=>{
    setHouseModels(Object.values(modelContext).filter(m=>m.name.includes('house')))
  },[modelContext])

  const swapGeometry=(changeNumb)=>{

    const maxNumb = setHouseModels.length; 
    var newNumb = currentInt + changeNumb; 
    if(newNumb>maxNumb){ newNumb = 1}
    if(newNumb < 1){ newNumb = maxNumb}
    setCurrentInt(newNumb);

    const newHouseMesh = houseModels[newNumb]
    setProperty(x=>({...x, name: newHouseMesh.name }))
    
  }

  const swapMap = ( selectedSection, changeNumb)=>{
    const mapOptions = Object.keys(textureContext).filter(key=> key.includes(selectedSection) ).map(name=> name.split('/')[1]);
    const maxNumb = mapOptions.length; 
    const currentName = property[selectedSection]; 

    const currentIndex =mapOptions.indexOf(currentName);
    var nextIndex = currentIndex + changeNumb; 
    if(nextIndex>=maxNumb){nextIndex = 0}
    if(nextIndex < 0){ nextIndex = maxNumb-1}


    setProperty(_property =>{
      const copy = {..._property};
      copy[selectedSection] = mapOptions[nextIndex]
      return copy; 
    })
  }

  const generateRandom = ()=>{
    swapGeometry(randInt(1,4));
    swapMap('roof',randInt(0,0));
    swapMap('wall',randInt(0,0));
    swapMap('windows',randInt(0,0));
  }

  return (<>
    <div style={{display:'flex', width:'100%', maxWidth:'600px', gap:'10px'}} >

      <Canvas style={{aspectRatio:1.725}} camera={{position: [2,1,3], fov: 15}} >
        <OrbitControls />
        <House property ={property}/>
      </Canvas>

      <div className='options'>
        <OptionSelector onChange={swapGeometry} >Geometry</OptionSelector>
        <OptionSelector onChange={ d =>{swapMap('roof',d)} } >Roof</OptionSelector>
        <OptionSelector onChange={ d =>{swapMap('wall',d)} } >Wall</OptionSelector>
        <OptionSelector onChange={ d =>{swapMap('windows',d)} } >Windows</OptionSelector>
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