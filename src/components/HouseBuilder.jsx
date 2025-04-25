import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { randInt } from 'three/src/math/MathUtils.js';
import { useHouseModel, useTexture } from '../contexts/modelContext';
import { Pixelate } from '../shaders/CustomPostProcessing';
import { CozyButton } from './Buttons';
import { useThree , useFrame } from '@react-three/fiber';



export default function HouseBuilder(props) {
  const [design, setDesign] = useState({});
  const modelContext = useHouseModel(); 
  const textureContext = useTexture(); 

  const GetMapOptions = (folderName)=>(
    Object.keys(textureContext).filter( key=> key.split('/')[0]===folderName.toUpperCase() ).map(name=> name.split('/')[1])
  )

  const swapGeometry=(changeNumb)=>{
    const currentNumb = ('mesh' in design) ? parseInt(design.mesh) : 0 ; 
    const maxNumb = Object.keys(modelContext).length ; 
    var newNumb = currentNumb + changeNumb; 
    if(newNumb>maxNumb){ newNumb = 1}
    if(newNumb < 1){ newNumb = maxNumb }
    setDesign(x=>({...x, mesh: newNumb }))
  }

  const swapMap = ( selectedSection, changeNumb)=>{
    const optionNames = GetMapOptions(selectedSection);
    var currentInt = optionNames.indexOf(design[selectedSection]);
    if(!currentInt) currentInt = 0; 
    var nextIndex = currentInt + changeNumb;
    if(nextIndex>=optionNames.length ) nextIndex = 0;  


    setDesign(design =>{
      const copy = {...design};
      copy[selectedSection] = optionNames[nextIndex] ;
      return copy; 
    })


  }



  const swapRandomMap = (selectedSection)=>{
   const optionNames = GetMapOptions(selectedSection);

   const randomIndex = Math.floor(Math.random()*(optionNames.length-1));
   setDesign(_design =>{
      const copy = {..._design};
      copy[selectedSection] = optionNames[randomIndex] ;
      return copy; 
    })
    }

  const generateRandom = ()=>{
    if(!modelContext || !textureContext ) return;
    swapGeometry(randInt(1,7));
    swapRandomMap('R')
    swapRandomMap('P')
    swapRandomMap('p')
    swapRandomMap('W')
    swapRandomMap('w')
    swapRandomMap('S')
    swapRandomMap('D')
  }



  useEffect(()=>{
   generateRandom();
  },[modelContext, textureContext ])
  
  useEffect(()=>{
    if(!design) return;
    if(props.onUpdateProperty) props.onUpdateProperty(design);
  },[design])

  const onPointerMove =e=>{
    const selectedMaterial  = e.object.material[e.face.materialIndex];
    e.object.material.forEach(mat=>{
      mat.uniforms.uMouseOver.value = selectedMaterial === mat ; 
    })
  }

  const onPointerOut = e =>{
    e.object.material.forEach(mat=>{
      mat.uniforms.uMouseOver.value = false; 
    })
  }

  const itsValidHouse = ()=>{
    console.log('its valid')
      if(props.onValidHouse)props.onValidHouse();
  }

  useEffect(()=>{
    console.log( '🤔', props.id )
  },[props.id])

  const onClick = e =>{
    const selectedMaterial  = e.object.material[e.face.materialIndex];
    swapMap( selectedMaterial.name.replace('_mat','') , e.nativeEvent.type ==="contextmenu" ? -1: 1 );
  }

  return <div className={'relative  w-full max-w-[800px] ' +props.className} >

        <Canvas className='self-center aspect-[4/3]	lg:aspect-[1/1]' camera={{position: [6,1,12], fov: 12 }} > 
            <CameraLookAt/>
            <Pixelate />
            <House id={props.id} design={design} timeout={props.timeout} onClick={onClick}
                  onPointerMove={onPointerMove}
                  onPointerOut ={onPointerOut}
                  updateTime={false} hoverable={false}
                  onUpdateProperty={itsValidHouse}
                  
                  />
            <mesh>
              <boxGeometry args={[10,0,10]} />
          </mesh>
     
       
        </Canvas>

        <OptionSelector className='absolute bottom-0 left-0 w-full flex items-center justify-center  ' onChange={swapGeometry} >Geometry</OptionSelector>


        <div className='absolute bottom-0 right-0 '>
          <CozyButton className='pixelButton scale-75' onClick={generateRandom} tooltip="A random house">
              <img src='/images/game_die.png' alt='shuffle'/>
          </CozyButton>   
        </div>
    </div>  
  

}


const OptionSelector = props =>{
  return <div className={'choice '+props.className} >
    <CozyButton className='pixelButton scale-75 ' onClick={()=>{props.onChange(-1)}}><img src='/images/arrow_backward.png' alt='-1' /></CozyButton>
    {props.children}
    <CozyButton className='pixelButton scale-75 ' onClick={()=>{props.onChange(+1)}}><img src='/images/arrow_forward.png' alt='+1' /></CozyButton>
    </div>
} 

function CameraLookAt() {
  const { camera } = useThree()

  useFrame(() => {
    camera.lookAt(.35, 0.9 , 0)
  })
  return null
}


export const HouseCodeOutput = ({design}) =>{

  const [code, setCode] = useState('');
  const [copying, setCopying] =useState(false);

  useEffect(()=>{
    if(!design) return; 
    const sections = ["D","W","w","P","p","mesh"]
    var string = '';
    sections.forEach(section=>{
      string+= `${section}:${design[section]},`
    })
    string = '{'+ string.substring(0, string.length - 1)+'}';

    setCode(string);
  },[design])

  const CopyCode =()=>{
    setCopying(true);
    navigator.clipboard.writeText(code);
  
    setTimeout(()=>{
      setCopying(false)
    },500)
  }


  if(!design) return;
  return <div className=' flex ' >
    <div className ='[line-break:anywhere] bg-gray-100 p-2'>{code}</div>
    {copying? "Copied!" : <CozyButton className='pixelButton' onClick={CopyCode}>Copy</CozyButton> }
  </div>
}