import React, { useEffect, useState } from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'
import { randInt } from 'three/src/math/MathUtils.js';
import { useHouseModel, useTexture } from '../contexts/modelContext';
import { Pixelate } from '../shaders/CustomPostProcessing';
import { CozyButton } from './Buttons';
import { useThree , useFrame } from '@react-three/fiber';

export default function HouseBuilder(props) {
  const [property, setProperty]= useState( { ...props.property } );
  const modelContext = useHouseModel(); 
  const textureContext = useTexture(); 


  const swapGeometry=(changeNumb)=>{
    const currentNumb = ('mesh' in property) ? parseInt(property.mesh) : 0 ; 
    const maxNumb = Object.keys(modelContext).length-1; 
    var newNumb = currentNumb + changeNumb; 
    if(newNumb>maxNumb){ newNumb = 1}
    if(newNumb < 1){ newNumb = maxNumb}
    setProperty(x=>({...x, mesh: newNumb }))
  }

  const swapMap = ( selectedSection, changeNumb)=>{
    var folderName = selectedSection;

    const optionNames = Object.keys(textureContext).filter(key=> key.includes(folderName) ).map(name=> name.split('/')[1]);
    var currentInt = optionNames.indexOf(property[selectedSection]);
    if(!currentInt) currentInt = 0; 
    var nextIndex = currentInt + changeNumb;

    setProperty(_property =>{
      const copy = {..._property};
      copy[selectedSection] = optionNames[nextIndex] ;
      return copy; 
    })


  }

  const swapRandomMap = (selectedSection)=>{
    var folderName = selectedSection.toUpperCase();
   const optionNames = Object.keys(textureContext).filter(key=> key.includes(folderName) ).map(name=> name.split('/')[1]);
   const randomIndex = Math.floor(Math.random()*(optionNames.length-1));
   setProperty(_property =>{
    const copy = {..._property};
    copy[selectedSection] = optionNames[randomIndex] ;
    return copy; 
  })

  }

  const generateRandom = ()=>{
    if(!modelContext || !textureContext ) return;
    swapGeometry(randInt(1,4));
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


  const onClick = e =>{
    const selectedMaterial  = e.object.material[e.face.materialIndex];
    swapMap( selectedMaterial.name.replace('_mat','') , e.nativeEvent.type ==="contextmenu" ? -1: 1 );
  }

  return <>
    <div className='relative max-w-[800px]' >

        <Canvas className='self-center aspect-[4/3]	lg:aspect-[1/1]' camera={{position: [6,1,11], fov: 12 }} > 
            <CameraLookAt/>
            <Pixelate />
            <House id={props.id} design={property} timeout={props.timeout} onClick={onClick}  onPointerMove={onPointerMove} onPointerOut ={onPointerOut} updateTime={false} hoverable={false}/>
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
    <CodeOutput property={property} />

    </>
  

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


const CodeOutput = ({property}) =>{

  const [code, setCode] = useState('');
  const [copying, setCopying] =useState(false);

  useEffect(()=>{
    const sections = ["D","W","w","P","p","mesh"]
    var string = '';
    sections.forEach(section=>{
      string+= `${section}:${property[section]},`
    })
    string = '{'+ string.substring(0, string.length - 1)+'}';

    setCode(string);
  },[property])

  const CopyCode =()=>{
    setCopying(true);
    navigator.clipboard.writeText(code);
  
    setTimeout(()=>{
      setCopying(false)
    },500)
  }

  return <div className='w-[400px]' >
    <div className ='[line-break:anywhere] bg-gray-100 p-2'>{code}</div>
    {copying? "Copied!" : <CozyButton className='pixelButton' onClick={CopyCode}>Copy</CozyButton> }
  </div>
}