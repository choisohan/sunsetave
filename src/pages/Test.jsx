import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sky from "../components/Sky";
import Ocean from '../components/Ocean'


export default function Test() {

  return <Canvas style={{width:"100vw", height: "100vh"}}  camera={{fov:50}}>
    <OrbitControls />
    <Sky />
    <Ocean />
  </Canvas>

}


