


import  React, { Component, Fragment, useRef, useEffect, useState, useCallback, useContext, useMemo } from 'react';
import ReactDOM from "react-dom/client";
import { useCodes } from "./inputs"

import gsap from 'gsap';

import * as THREE from "three";

import { useFrame, useThree, createPortal } from '@react-three/fiber';
import { OrthographicCamera, useCamera } from '@react-three/drei';
import math from 'mathjs';
import { Vector3 } from 'three';


const origin = new Vector3(0,0,0)

export function ViewCube() {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new THREE.Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const [hover, set] = useState(null);
  const [color, colorChange] = useState(['white']);
  const matrix = new THREE.Matrix4();
  const orientations = [ 
      new Vector3( 1.0, 0.1, -0.1),
      new Vector3(-1.0, 0.1, 0.1),
      new Vector3( 0.1, 1.0, 0.1),
      new Vector3( 0.1,-1.0, 0.1),
      new Vector3( -0.1, 0.1, 1.0),
      new Vector3( -0.1, 0.1,-1.0)
  ];
  const cameraDistance = camera.position.distanceTo(origin)
  
  useFrame(() => {
    matrix.copy(camera.matrix).invert();
    ref.current.quaternion.setFromRotationMatrix(matrix);
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  }, 1);

  return createPortal(
    <Fragment>
      <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 100]} />
      <mesh ref={ref}
            raycast={useCamera(virtualCam)}
            position={[size.width / 2 - 80, size.height / 2 - 80, 0]}
            color={color}
            onPointerOut = {(e) => set(null)}
            onPointerMove ={(e) => {console.log(Math.floor(e.faceIndex/2));set(Math.floor(e.faceIndex/2))}}
            onClick = {(e) => {
              const faceIndex = Math.floor(e.faceIndex*0.5);
              gsap.to(camera.position, 
                  { 
                      duration: 1,
                      x: orientations[faceIndex].x*cameraDistance,
                      y: orientations[faceIndex].y*cameraDistance,
                      z: orientations[faceIndex].z*cameraDistance,
                      onUpdate: function() {
                          camera.lookAt(origin)
                      }
                  });
             }}>
        <boxGeometry attach="geometry" args={[60, 60, 60]} />
        {[...Array(6)].map((_, index) => (
          <meshLambertMaterial key={index} attach={`material-${index}`} color={ hover === index ? 'lightgreen' : 'white'} />
        ))}
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      </Fragment>,
    virtualScene
  )
}


