import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import { BoxGeometry  , MeshBasicMaterial, Vector3, Matrix4} from 'three'

const lerp = (start, end, t) => start.clone().lerp(end, t);
const loopArray = (array) => [...array, ...array.slice(0, array.length - 1).reverse()];

const generateRandomSpeeds = (numInstances) => {
    const speeds = [];
    for (let i = 0; i < numInstances; i++) {
      // Random speed between 0.05 and 0.2
      speeds.push( Math.random() * 0.15 + 0.05);
    }
    return speeds;
  };

function getForwardVector(euler) {
  let pitch = euler.x; // Rotation around X-axis
  let yaw = euler.y;   // Rotation around Y-axis

  return new Vector3(
      Math.cos(pitch) * Math.sin(yaw),
      -Math.sin(pitch),
      Math.cos(pitch) * Math.cos(yaw)
  ).normalize();
}

  
export default function InstancingOnGrid(props) {

    const [count, setCount ] = useState(1);
    const [speeds, setSpeeds] = useState([1.]); 
    const [targetPositions, setTargetPositions] = useState([new Vector3(-2,0,0),new Vector3(-1,0,1), new Vector3(0,0,0) , new Vector3(1,0,-1), new Vector3(2,0,0),new Vector3(3,0,1)]);
    const meshRef = useRef();
    const [ time, setTime ] = useState(0);
    


    useEffect(()=>{
      if(props.grid){
        const cells =  props.grid.children;
        const positions = cells.map(cell=> new Vector3(cell.position.x,cell.position.z, -cell.position.y +1) );
        cells.reverse().forEach(cell => {
          var pos = new Vector3(cell.position.x, cell.position.z , -cell.position.y +2 )
          positions.push(pos)
        });
        setTargetPositions(positions);
      }
    },[props.grid])


    useState(()=>{
      setCount(props.count);
      setSpeeds(generateRandomSpeeds(props.count));
    },[props.count])

    const getPathPosition = (time) => {
        const pathLength = targetPositions.length;
        const pathTime = (time % pathLength);  // loop the path
    
        // Find the two positions to interpolate between
        const startIdx = Math.floor(pathTime);
        const endIdx = (startIdx + 1) % pathLength;
        const t = pathTime - startIdx; // normalized value between 0 and 1
    
        // Linear interpolation between start and end positions
        const position =  lerp(targetPositions[startIdx], targetPositions[endIdx], t);
        return position;
    };
    

    useFrame(()=>{
        setTime( t => t + 0.1);
        for (let i = 0; i < count; i++) {
            const instanceSpeed = speeds[i] * props.speed; 
            const instanceTime = time * instanceSpeed;
            const newPos = getPathPosition(instanceTime + (i / count)  ); // distribute the start time for each instance
            const matrix = new Matrix4();
            matrix.setPosition(newPos);
            meshRef.current.setMatrixAt(i, matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;

    })





  return (<instancedMesh ref={meshRef} args={ [new BoxGeometry(.5,.5,.5), new MeshBasicMaterial({ color: 'blue' }), count]} />)
}


