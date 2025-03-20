
import { useThree } from '@react-three/fiber';
import { meshBasicMaterial , Vector3 , Vector2, BoxGeometry } from 'three'
import { useEffect, useRef } from 'react';
import { useState } from 'react';



export function GroundPlane(props) {

    const {scene,camera, raycaster} = useThree();
    const planeRef = useRef();
    const [spherePosition, setSpherePosition] = useState(new Vector3(0, 0, 0));
    const [editMode, setEditMode] = useState(false);


    useEffect(()=>{
        setEditMode(props.editMode);
    },[props.editMode] )

    const onPointerMove = evt=>{
        if(editMode){
            const position = getPositionOnGround(evt.clientX ,evt.clientY);
            props.onPointerMove(position);
        }
    }

    const getPositionOnGround=(x,y)=>{
        const mouse = new Vector2();
        mouse.x = (x/ window.innerWidth) * 2 - 1;
        mouse.y = -(y/ window.innerHeight) * 2 + 1;

        raycaster.ray.origin.copy(camera.position); // Set the ray origin to the camera position
        raycaster.ray.direction.set(mouse.x, mouse.y , 0.5).unproject(camera).sub(camera.position).normalize(); // Set the ray direction

        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
            var point = intersects[0].point;
            point.x = Math.floor(point.x)
            point.y = Math.floor(point.y)
            point.z = Math.floor(point.z)
            return point;
        }
    }
    const onFinish = ()=>{
        props.onFinish()
    }

  return (
    <mesh ref={planeRef} position={[0, 0, 0]} onPointerMove={onPointerMove} onPointerDown={onFinish}>
      <boxGeometry args={[10, 0, 10]} />
      <meshBasicMaterial color="lightGray" />
    </mesh>
  );
}

