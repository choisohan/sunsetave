import { Canvas } from "@react-three/fiber";
import Sky from "../components/Sky";
import { OrbitControls } from "@react-three/drei";

export default function Test() {

  return <Canvas style={{width:"100vw", height: "100vh"}}  camera={{fov: 50}}>
    <OrbitControls />
    <Sky />
  </Canvas>

}


