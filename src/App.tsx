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
    height: 750,
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
                // style={{ visibility: "hidden", position: "absolute" }}
                style={{ position: "absolute" }}
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
