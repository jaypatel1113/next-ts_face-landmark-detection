import React, { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam, { WebcamProps } from "react-webcam";
import { runDetector } from "./utils/detector";

interface InputResolution {
    width: number;
    height: number;
}

const inputResolution: InputResolution = {
    width: 1080,
    height: 900,
};

const videoConstraints: WebcamProps["videoConstraints"] = {
    width: inputResolution.width,
    height: inputResolution.height,
    facingMode: "user",
};

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const handleVideoLoad = (videoNode: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const video = videoNode.target as HTMLVideoElement;
        if (video.readyState !== 4) return;
        if (loaded) return;
        runDetector(video, canvasRef.current);
        setLoaded(true);
    };

    useEffect(() => {
        const cleanup = () => {
            setLoaded(false);
        };

        return cleanup;
    }, []);

    return (
        <div>
            <Webcam
                width={inputResolution.width}
                height={inputResolution.height}
                style={{ visibility: "hidden", position: "absolute" }}
                videoConstraints={videoConstraints}
                onLoadedData={handleVideoLoad}
            />
            <canvas
                ref={canvasRef}
                width={inputResolution.width}
                height={inputResolution.height}
                style={{ position: "absolute" }}
            />
            {loaded ? <></> : <header>Loading...</header>}
        </div>
    );
};

export default App;


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
