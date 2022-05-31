
import  { Component, Fragment, useRef, useEffect, useState, useCallback, useContext, useMemo } from 'react';
import * as THREE from "three";
import { Canvas, useFrame, useThree, createPortal } from '@react-three/fiber';
import { OrthographicCamera, useCamera } from '@react-three/drei';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import uuid from "short-uuid";
import { round } from "mathjs";
import ReactDOM from "react-dom/client";

import * as data       from './data/marker_data.json';
import * as markerConf from './data/marker_conf.json';
import url             from "./videos/rest_example.mp4";

// LOAD data and configuration
const xyzData = data;
const marConf = markerConf;
console.log(xyzData.length);
console.log(xyzData);
console.log(xyzData[1]);
var index = 1;
var time = 0;
//var marIndex = 0;
//var index = 0;
//var position = [0,2];

// TODO: add to marker or position data
const sampleRate = 60;
var paused = false;

const useCodes = () => {
  const codes = useRef(new Set())
  useEffect(() => {
    //const onKeyDown = (e) => codes.current.delete(e.code)
    const onKeyUp = (e) => {
      if (!codes.current.has(e.code)) {
      codes.current.add(e.code);
    }
      else {
        codes.current.delete(e.code);
      }
    }
    //window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      //window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])
  return codes
}

// function useDrag(onDrag, onEnd) {
//   const [active, setActive] = useState(false)
//   const [, toggle] = useContext(camContext)
//   const activeRef = useRef()
//   const down = useCallback((e) => (setActive(true), toggle(false), e.stopPropagation(), e.target.setPointerCapture(e.pointerId)), [toggle])
//   const up = useCallback((e) => (setActive(false), toggle(true), e.target.releasePointerCapture(e.pointerId), onEnd && onEnd()), [onEnd, toggle])
//   const move = useCallback((event) => activeRef.current && (event.stopPropagation(), onDrag(event.unprojectedPoint)), [onDrag])
//   useEffect(() => void (activeRef.current = active))
//   return { onPointerDown: down, onPointerUp: up, onPointerMove: move }
// }




const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);
      controls.minDistance = 100;
      controls.maxDistance = 1500;
      controls.enablePan = false;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

function DataViewPane1D() {
  const { gl, scene, camera,size } = useThree();
  const ref = useRef();
  return (
    <Fragment>
      <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 100]} />
      <mesh
        ref={ref}
        raycast={useCamera(camera)}
        position={[0, 0, 0]}>
        <meshLambertMaterial attachArray="material"  color= 'white' />
        <boxBufferGeometry attach="geometry" args={[60, 60, 60]} />
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      </Fragment>
    )
}


function Viewcube() {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new THREE.Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const [hover, set] = useState(null);
  const matrix = new THREE.Matrix4();

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
      <mesh
        ref={ref}
        raycast={useCamera(virtualCam)}
        position={[size.width / 2 - 80, size.height / 2 - 80, 0]}
        onPointerOut={(e) => set(null)}
        onPointerMove={(e) => set(Math.floor(e.faceIndex / 2))}>
        {[...Array(6)].map((_, index) => (
          <meshLambertMaterial attachArray="material" key={index} color={hover === index ? 'hotpink' : 'white'} />
        ))}
        <boxBufferGeometry attach="geometry" args={[60, 60, 60]} />
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      </Fragment>,
    virtualScene
  )
}


const VideoElementOld = () => {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new THREE.Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const matrix = new THREE.Matrix4();
  const aspect = size.width / camera.width;

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  });

  useFrame(() => {
    //matrix.copy(camera.matrix).invert();
    //ref.current.quaternion.setFromRotationMatrix(matrix);
    //gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  }, 1);
  // const bind = useDrag(({ offset: [x, y] }) => {
  //       const [,, z] = position;
  //       setPosition([x / aspect, -y / aspect, z]);
  // }, { pointerEvents: true });
  // let bindDrag = useDrag()
  return createPortal(
      <Fragment>
        <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 1000]} />
          <mesh
            ref={ref}
            rotation={[0, 0, 0]}
            position={[size.width / 4, size.height / 2-200, 0]}>
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
const VideoElement = () => {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const matrix = new Matrix4();
  const aspect = size.width / camera.width;

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  });

  useFrame(() => {
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  }, 1);

  return createPortal(
      <Fragment>
        <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 1000]} />
          <mesh
            ref={ref}
            rotation={[0, 0, 0]}
            position={[size.width / 4, size.height / 2-200, 0]}>
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

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[30, 30, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Marker(props) {
  //console.log(props);
  // This reference gives us direct access to the THREE.Mesh object
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
    ref.current.geometry.computeVertexNormals();
  }
  );

  const [items, set] = useState([]);
  const handleClick  = useCallback(e => (set(items => [...items, uuid.generate()]), click(!clicked), console.log(items)), [items,clicked]);
  //useFrame((state, delta) => (ref.index = ref.index ? 0 : 1))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Fragment>
      <mesh
        {...props}
        ref={ref}
        name={marConf.markers[ref.markerIndex].name}
        scale={clicked ? 1.5 : 1}
        onClick={handleClick}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <sphereGeometry args={[15, 64, 64]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : parseInt(marConf.markers[ref.markerIndex].color,16)} />
      </mesh>
      {items.map((key, index) => (
      <Spawned key={key} position={[ref.markerIndex*50, 1 + index * 100, 0]} />
    ))}
    </Fragment>
  )
}


function Spawned(props) {
  return (
    <mesh {...props}>
      <sphereGeometry attach="geometry" args={[30, 16, 16]} />
      <meshStandardMaterial attach="material" color="hotpink" transparent />
    </mesh>
  )
}


function Arena(props) {
  const ref = useRef();
  const code = useCodes()
  useFrame((state, delta) => {
    if (!paused) {
      time += delta;
      index = THREE.MathUtils.euclideanModulo( round(time * sampleRate) ,xyzData.length);
    }
    if (code.current.has('KeyP'))       paused = true;
    else if (!code.current.has('KeyP')) paused = false;

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
    <Canvas
     shadows={{type:"ShawdowMap"}}
      colormanagment="true"
      shadowmap="true"
      camera={{ position: [500, 800, 5], fov: 50,far:2000}}>
      <CameraController />
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
      <Arena             receiveShadow position={[  0, 0, 0]} />
      {[...Array(marConf.markers.length).keys()].map( m =>  { return <Marker castShadow receiveShadow key={m} markerIndex={m} position={[  0,80, 0]} />})}
      <Viewcube />
    </Canvas>

  )
}
