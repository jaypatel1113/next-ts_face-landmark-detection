import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawMesh";

export const runDetector = async (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement | null
): Promise<void> => {
    if (!canvas) return;
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

    const detector = await faceLandmarksDetection.createDetector(model, {
        runtime: "tfjs",
        refineLandmarks: false,
    });

    const detect = async () => {
        const estimationConfig = { flipHorizontal: false };
        const faces = await detector.estimateFaces(video, estimationConfig);
        // console.log(faces)
        const ctx = canvas.getContext("2d");
        requestAnimationFrame(() => drawMesh(faces[0], ctx!));
        detect();
    };

    detect();
};
