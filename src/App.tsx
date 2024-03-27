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
    width: 1000,
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
    const [error, setError] = useState<string | null>(null);

    const handleVideoLoad = (videoNode: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const video = videoNode.target as HTMLVideoElement;
        if (video.readyState !== 4) return;
        if (loaded) return;
        runDetector(video, canvasRef.current);
        setLoaded(true);
    };

    const handleUserMediaError = (error: string | DOMException) => {
        setError("Error accessing camera. Please grant camera permission.");
        console.log(error);
    };

    useEffect(() => {
        const cleanup = () => {
            setLoaded(false);
        };

        return cleanup;
    }, []);

    return (
        <div className={`flex w-full ${loaded ? "h-screen" : "h-full"} justify-center items-center`}>
            <div className={`relative w-full max-w-screen-md text-center ${loaded ? "border-2" : "border-0"} border-black`}>
                <Webcam
                    width={inputResolution.width}
                    height={inputResolution.height}
                    className="w-full h-auto invisible"
                    videoConstraints={videoConstraints}
                    onLoadedData={handleVideoLoad}
                    onUserMediaError={handleUserMediaError}
                />
                <canvas
                    ref={canvasRef}
                    width={inputResolution.width}
                    height={inputResolution.height}
                    className="absolute top-0 left-0 w-full h-full"
                />

                {error ? 
                    <header className="text-red-700 text-3xl font-semibold">{error}</header> : 
                    (loaded ? 
                        <></> : 
                        <header>Loading...</header>
                    )
                }
            </div>
        </div>
    );
};

export default App;
