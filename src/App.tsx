import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";
import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { useRef, useState, useEffect, useCallback } from "react";
import "./App.scss";
import Webcam from "react-webcam";
import { draw } from "./mask";

const useTimeoutInterval = (callback: () => Promise<void>, delay: number) => {
  const timerRef = useRef<number>(0);

  const onTimeout = useCallback(() => {
    callback()
      .then(() => (timerRef.current = setTimeout(onTimeout, delay)))
      .catch((e) => console.error(e));
  }, [callback, delay]);

  useEffect(() => {
    timerRef.current = setTimeout(onTimeout, delay);
    return () => clearTimeout(timerRef.current);
  }, [onTimeout, delay]);
};

async function detect(
  model: MediaPipeFaceMesh,
  webcam: Webcam,
): Promise<AnnotatedPrediction[] | undefined> {
  if (webcam.video.readyState !== 4) {
    return;
  }
  const video = webcam.video;
  return await model.estimateFaces({
    input: video,
  });
}

export default function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [model, setModel] = useState<MediaPipeFaceMesh | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      console.log("Loading model...");
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      );

      console.log("model loaded: ", model);

      setModel(model);
    };
    void loadModel();
  }, []);

  const detectDraw = async (model: MediaPipeFaceMesh) => {
    if (webcamRef.current) {
      const webcam = webcamRef.current;

      const predictions = await detect(model, webcam);

      if (predictions) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const videoWidth = webcam.video.videoWidth;
        const videoHeight = webcam.video.videoHeight;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        draw(context, predictions, videoWidth, videoHeight);
      }
    }
  };

  useTimeoutInterval(async () => {
    if (model) {
      await detectDraw(model);
    }
  }, 100);

  return (
    <>
      <div className="camera">
        <Webcam ref={webcamRef} audio={false} />
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
