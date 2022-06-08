
import  React, { Component, Fragment, useRef, useEffect, useState, useCallback, useContext, useMemo } from 'react';
import * as THREE from "three";
import { Canvas, useFrame, useThree, createPortal } from '@react-three/fiber';
import { OrbitControls,OrthographicCamera, Plane, Stats, useCamera } from '@react-three/drei';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
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

const sampleRate = 60;
var paused = false;
const frameWindowLength = 360;
const halfFrameWindowLength = round(frameWindowLength/2);
var index = halfFrameWindowLength+1;
var time = index/sampleRate;
// TODO: add to marker or position data

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



const OrthoToCamera = ({ children }) => {
  const ref = useRef(null);
  const { camera } = useThree();
  useFrame(() => {
    ref.current.lookAt(camera.position)
  });
  return <group ref={ref}>{children}</group>
}


const Draggable = ({ children }) => {
    const ref = useRef(null);
    const { camera, gl, scene } = useThree();

    useEffect(() => {
        const controls = new DragControls(ref.current.children, camera, gl.domElement);
        controls.transformGroup = true;

        const orbitControls = scene.orbitControls;

        controls.addEventListener('dragstart', () => {
            orbitControls.enabled = false;
        });
        controls.addEventListener('dragend', () => {
            orbitControls.enabled = true;
        });
    }, [camera, gl.domElement, scene]);

    return <group ref={ref}>{children}</group>
}

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
  )}

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


function ViewCube() {
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

function Marker(props) {
  //console.log(props);
  // This reference gives us direct access to the THREE.Mesh object
  const { gl , scene } = useThree();

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
       <SpawnedLine key={key} ref={ref} visible={clicked} />
    ))}

    </Fragment>
  )
}
    //   { items.map((key, index) => (
    //    <SpawnedVideo key={key} ref={ref} visible={clicked} />
    // ))}

const SpawnedLine = React.forwardRef((props,ref) => {
  const { gl,scene,camera, size} = useThree();
  return (
    <Fragment>
      <Draggable>
      <DisplayLine2
      {...props}
      markerIndex={ref.markerIndex}
      markerColor={parseInt(marConf.markers[ref.markerIndex].color,16)}
      position={[ size.width/4 - 490 , size.height/2 - 200, 0]} />
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
  const ref = useRef();
  const code = useCodes()
  useFrame((state, delta) => {
    if (!paused) {
      time += delta;
      index = THREE.MathUtils.euclideanModulo( round(time * sampleRate) ,xyzData.length-frameWindowLength-1);
    }
    if (code.current.has('Space'))       paused = true;
    else if (!code.current.has('Space')) paused = false;

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

console.log(window.devicePixelRatio);
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
        <Arena             receiveShadow position={[  0, 0, 0]} />
      {[...Array(marConf.markers.length).keys()].map( m =>  { return <Marker castShadow receiveShadow key={m} markerIndex={m} position={[  0,80, 0]} />})}
      <ViewCube />
      <DisplayLine position={[0,0,0]} />
    </Canvas>
    {/*<Stats showPanel={0} className="stats" />*/}
    </Fragment>

  )
}
