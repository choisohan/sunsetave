import React, {useRef , useMemo} from 'react'
import { BoxGeometry , MeshBasicMaterial , CatmullRomCurve3 , Object3D , Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

export default function InstanceOnPath({lineGeometry, maxCount = 10 }) {
    const meshRef = useRef();
    const progressRef = useRef(new Array(maxCount).fill(0).map((_, i) => i / maxCount));

    const curve = useMemo(() => {
        const pos = lineGeometry.attributes.position;
        const points = [];
        for (let i = 0; i < pos.count; i++) {
          points.push(new Vector3().fromBufferAttribute(pos, i));
        }
        return new CatmullRomCurve3(points);
      }, [lineGeometry]);



    useFrame((_, delta) => {
    const dummy = new Object3D();

    progressRef.current = progressRef.current.map(p => {
        let next = p + delta * 0.1; // speed
        return next > 1 ? next - 1 : next; // loop
    });

    progressRef.current.forEach((t, i) => {
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        dummy.position.copy(point);

        // Optional: orient toward the curve direction
        dummy.lookAt(point.clone().add(tangent));
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    });

  return (<instancedMesh ref={meshRef} args={ [
    new BoxGeometry(.5,.5,.5),
    new MeshBasicMaterial({ color: 'blue' }),
    maxCount]} />)

}
