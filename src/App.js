
import  React, { Component, Fragment, useRef, useEffect, useState, useCallback, useContext, useMemo } from 'react';
import ReactDOM from "react-dom/client";

import * as THREE from "three";

import { Canvas, useFrame, useThree, createPortal } from '@react-three/fiber';
import { OrbitControls,OrthographicCamera, Plane, Stats, useCamera } from '@react-three/drei';

import {gsap} from 'gsap';

import uuid from "short-uuid";
import { round } from "mathjs";

import { ViewCube } from "./objects"
import { Draggable, OrthoToCamera } from './augmentations';
import { useCodes } from "./inputs"


import * as data       from './data/marker_data.json';
import * as markerConf from './data/marker_conf.json';
import url             from "./videos/rest_example.mp4";
import gsapCore from 'gsap/gsap-core';


// LOAD data and configuration
const xyzData = data;
const marConf = markerConf;


const sampleRate = 60;
var paused = false;

const frameWindowLength = 360;
const halfFrameWindowLength = round(frameWindowLength/2);
var index = halfFrameWindowLength+1;
var time = index/sampleRate;
// TODO: add to marker or position data


function DisplayLine(props) {
  const ref = useRef();
  const points = [...Array(frameWindowLength)];
  for (var p=0; p<frameWindowLength;p++) points[p] = new THREE.Vector3(p,100,0);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame(() =>
    ref.current.geometry.setFromPoints([...Array(frameWindowLength)].map((v,i) =>
      new THREE.Vector3(xyzData[index+i-halfFrameWindowLength].MarkerXYZ[3*6+0],
                        xyzData[index+i-halfFrameWindowLength].MarkerXYZ[3*6+1],
                        xyzData[index+i-halfFrameWindowLength].MarkerXYZ[3*6+2])))
  );

  return (
    <Fragment>
      <line
        {...props}
        ref={ref}
        geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color={'#9c88ff'} linewidth={3} linecap={'round'} linejoin={'round'} />
      </line>
    </Fragment>
  )
};

function DisplayLine2(props) {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new THREE.Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const points = [...Array(frameWindowLength)];
  for (var p=0; p<frameWindowLength;p++) points[p] = new THREE.Vector3(p,100,0);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  useFrame(() => {
    ref.current.geometry.setFromPoints([...Array(frameWindowLength)].map((v,i) =>
      new THREE.Vector3(i,
                        xyzData[index+i-halfFrameWindowLength].MarkerXYZ[3*props['markerIndex']+1],
                        0)))

    //gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  },1);

  return createPortal(
        <Fragment>
          <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 1000]} />
          <line {...props} ref={ref} geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color={props["markerColor"]} linewidth={1} linecap={'round'} linejoin={'round'} />
          </line>
        </Fragment>,
        virtualScene
  );
}

function DisplayLine3(props) {
  const { gl,camera,scene } = useThree();

  const ref = useRef();
  const points = [...Array(frameWindowLength)];
  for (var p=0; p<frameWindowLength;p++) points[p] = new THREE.Vector3(p,100,0);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  useFrame(() => {
    ref.current.geometry.setFromPoints([...Array(frameWindowLength)].map((v,i) =>
      new THREE.Vector3(i,
                        xyzData[index+i-halfFrameWindowLength].MarkerXYZ[3*6+1],
                        20)))


    //gl.autoClear = true;
  },1);

return (
  <Fragment>
          <line {...props} ref={ref} geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color={"hotpink"} linewidth={1} linecap={'round'} linejoin={'round'} />
          </line>
  </Fragment>
  );
}

const VideoElement = (props) => {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new THREE.Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playbackRate = 1;
    vid.currentTime = time;
    vid.play();
    return vid;
  });

  useFrame(() => {
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  }, 1);

  return createPortal(
      <Fragment>
        <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 1000]} />
          <mesh {...props} ref={ref} >
            <planeGeometry args={[480,270, 2]} />
            <meshStandardMaterial emissive={"white"} side={THREE.DoubleSide}>
              <videoTexture attach="map" args={[video]} />
              <videoTexture attach="emissiveMap" args={[video]} />
            </meshStandardMaterial>
          </mesh>
        </Fragment>,
      virtualScene
    );
};

// TODO :: switch to instancing
function Marker(props) {
  const ref = useRef();

  ref.markerIndex = props.markerIndex;
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  const [paused, pause] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.position.set(
      xyzData[index].MarkerXYZ[ref.markerIndex*3+0],
      xyzData[index].MarkerXYZ[ref.markerIndex*3+1],
      xyzData[index].MarkerXYZ[ref.markerIndex*3+2]);
    //ref.current.geometry.computeVertexNormals();
  }
  );

  const [items, set] = useState([]);
  const handleClick  = useCallback(e => {
      click(!clicked);
      if (items.length<1) {
        set(items => [...items, uuid.generate()])
      }
    },
    [items,clicked]);
  //useFrame((state, delta) => (ref.index = ref.index ? 0 : 1))
  // Return the view, these are regular Threejs elements expressed in JSX

  return (
    <Fragment>
      <mesh
        {...props}
        ref={ref}
        name={marConf.markers[ref.markerIndex].name}
        scale={clicked ? 1.25 : 1}
        onClick={handleClick}
        onPointerOver={(event) => hover(true) }
        onPointerOut ={(event) => hover(false)}>
        <sphereGeometry       attach="geometry" args={[15, 16, 16]} />
        <meshStandardMaterial attach="material"
          color={hovered ? 'gold' : parseInt(marConf.markers[ref.markerIndex].color,16)} />
      </mesh>
      { items.map((key, index) => (
       <SpawnedLine key={key} ref={ref} visible={clicked} /> /*GENERATE line */
    ))}

    </Fragment>
  )
};

const SpawnedLine = React.forwardRef((props,ref) => {
  const { gl,scene,camera, size} = useThree();
  return (
    <Fragment>
      <Draggable>
        <DisplayLine2
          {...props}
          markerIndex={ref.markerIndex}
          markerColor={parseInt(marConf.markers[ref.markerIndex].color,16)}
          position={[ size.width/4 - 490 , size.height/2 - 200, 0]} >
        </DisplayLine2>
      </Draggable>
    </Fragment>
    );
});

const SpawnedVideo = React.forwardRef((props,ref) => {
  const { gl,scene,camera, size} = useThree();
  return (  <VideoElement {...props}  position={[ size.width/4 - 490 * ref.markerIndex, size.height/2 - 200, 0]} /> )
});

function Spawned(props) {
  return (
    <mesh {...props}>
      <sphereGeometry attach="geometry" args={[30, 16, 16]} />
      <meshStandardMaterial attach="material" color="hotpink" transparent />
    </mesh>
  )
}


function Arena(props) {
  const { gl,scene,camera, size} = useThree();
  const [paused,pause] = useState(false);
  const ref = useRef();
  const code = useCodes()
  useFrame((state, delta) => {
    if (!paused) {
      time += delta;
      index = THREE.MathUtils.euclideanModulo( round(time * sampleRate) ,xyzData.length-frameWindowLength-1);
    }
    pause(code.current.has('dblclick'));

  });

  return (
    <mesh
      {...props}
      ref={ref} >
      <cylinderGeometry args={[480, 480, 5, 64]} />
      <meshPhongMaterial color='grey' shininess={10} side={THREE.DoubleSide} />
    </mesh>
  )
}


export default function App() {
  return (
    <Fragment>
    <Canvas
      dpr={window.devicePixelRatio}
      shadows={{type:"ShawdowMap"}}
      colormanagment="true"
      shadowmap="true"
      camera={{ position: [1000, 1200, 5], fov: 50,far:2000}}>

      <OrbitControls
        attach="orbitControls"
        minDistance={100}
        maxDistance={1500}
        enablePan={false}  />


      <Draggable>
        <OrthoToCamera>
          <Plane args={[frameWindowLength*1.1,frameWindowLength/2]} position={[frameWindowLength/2,100,0]}>
            <meshStandardMaterial attach="material" emissive={"white"} side={THREE.DoubleSide} />
          </Plane>
          <DisplayLine3/>
        </OrthoToCamera>
      </Draggable>


      <pointLight position={[0, 300, 0]}
                  castShadow
                  shadow-mapSize-height={2048}
                  shadow-mapSize-width={2048}
                  shadow-camera-near={0.1}
                  shadow-camera-far={1000}
                  shadow-camera-right={1000}
                  shadow-camera-left={-1000}
                  shadow-camera-top={1000}
                  shadow-camera-bottom={-1000}/>

        <Arena  receiveShadow position={[  0, 0, 0]} />
        
        {[...Array(marConf.markers.length).keys()].map( m =>  { return <Marker castShadow receiveShadow key={m} markerIndex={m} position={[  0,80, 0]} />})}
      
      <ViewCube />
      
      <DisplayLine position={[0,0,0]} />
    </Canvas>
    {/*<Stats showPanel={0} className="stats" />*/}
    </Fragment>

  )
}
