import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, createPortal, } from '@react-three/fiber';
import { OrthographicCamera, useCamera } from '@react-three/drei';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import { useSpring, animated } from '@react-spring/web'
// import { useDrag } from '@use-gesture/react'
//
// function Example() {
//   const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
//
//   // Set the drag hook and define component movement based on gesture data.
//   const bind = useDrag(({ down, movement: [mx, my] }) => {
//     api.start({ x: down ? mx : 0, y: down ? my : 0 })
//   })
//
//   // Bind it to a component.
//   return <animated.div {...bind()} style={{ x, y, touchAction: 'none' }} />
// }

//import * as VR from "!exports-loader?WEBVR!three/examples/js/vr/WebVR";

import { Scene, Matrix4 } from 'three'
import * as THREE from "three";
//import dynamic from "next/dynamic";
import { round } from "mathjs";

//const markers = dynamic(() => import('./data/marker_conf'));
//const xyzData = dynamic(() => import('./data/marker_data'));
//const xyzData =  import('./marker_data.json');


import * as data from './data/marker_data.json';
import * as markerConf from './data/marker_conf.json';
import url from "./videos/rest_example.mp4"

const xyzData = data;
const marConf = markerConf;
console.log(xyzData.length);
console.log(xyzData);
var index = 1;
var time = 0;
var marIndex = 0;

console.log(xyzData[1])

const sampleRate = 60;

var index = 0;
var position = [0,2];

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);
      controls.minDistance = 3;
      controls.maxDistance = 1000;
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
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCamera = useRef();
  const ref = useRef();
}


function Viewcube() {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const [hover, set] = useState(null);
  const matrix = new Matrix4();

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
    <>
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
      </>,
    virtualScene
  )
}





const VideoElement = () => {
  const { gl, scene, camera, size } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const ref = useRef();
  const matrix = new Matrix4();

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
  return createPortal(
      <>
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
        </>,
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

function Sphere(props) {
  //console.log(props);
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  ref.markerIndex = props.markerIndex;
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.position.set(
      xyzData[index].MarkerXYZ[ref.markerIndex*3+0],
      xyzData[index].MarkerXYZ[ref.markerIndex*3+1],
      xyzData[index].MarkerXYZ[ref.markerIndex*3+2]);
    ref.current.geometry.computeVertexNormals();
  }

  );
  //useFrame((state, delta) => (ref.index = ref.index ? 0 : 1))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <sphereGeometry args={[15, 64, 64]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : parseInt(marConf.markers[ref.markerIndex].color,16)} />
    </mesh>
  )
}

function Arena(props) {
  const ref = useRef();
  useFrame((state, delta) => {
    time += delta;
    index = THREE.MathUtils.euclideanModulo( round(time * sampleRate) ,xyzData.length);
    }
  );

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
      {[...Array(marConf.markers.length).keys()].map( m =>  { return <Sphere castShadow receiveShadow key={m} markerIndex={m} position={[  0,80, 0]} />})}
      <Viewcube />
      <VideoElement />
    </Canvas>

  )
}
