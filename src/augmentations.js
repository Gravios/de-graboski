import  React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { DragControls } from "three/examples/jsm/controls/DragControls";


// WRAP object in group which looks at the camera
export const OrthoToCamera = ({ children }) => {
    const ref = useRef(null);
    const { camera } = useThree();
    useFrame(() => {
      ref.current.lookAt(camera.position)
    });
    return <group ref={ref}>{children}</group>
  }
  
  
  // WRAP object in draggable group
export const Draggable = ({ children }) => {
      const ref = useRef(null);
      const { camera, gl, scene } = useThree();
  
      useEffect(() => {
          const controls = new DragControls(ref.current.children, camera, gl.domElement);
          controls.transformGroup = true;
  
          const orbitControls = scene.orbitControls;
  
          controls.addEventListener('dragstart', () => orbitControls.enabled = false );
          controls.addEventListener('dragend',   () => orbitControls.enabled = true  );
      }, [camera, gl.domElement, scene]);
  
      return <group ref={ref}>{children}</group>
  }