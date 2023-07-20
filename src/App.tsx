import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";
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

export default function App() {
  const webcam = useRef<Webcam>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const [model, setModel] = useState<MediaPipeFaceMesh | null>(null);

  const runFaceDetect = useCallback(async () => {
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    );

    console.log("model loaded: ", model);

    setModel(model);
  }, []);

  const detect = async (model: MediaPipeFaceMesh) => {
    if (webcam.current) {
      const webcamCurrent = webcam.current;
      // go next step only when the video is completely uploaded.
      if (webcamCurrent.video.readyState === 4) {
        const video = webcamCurrent.video;
        const predictions = await model.estimateFaces({
          input: video,
        });
        if (predictions.length) {
          console.log(predictions);
          const videoWidth = webcam.current?.video.videoWidth;
          const videoHeight = webcam.current?.video.videoHeight;
          canvas.current.width = videoWidth;
          canvas.current.height = videoHeight;
          const ctx = canvas.current.getContext("2d");
          draw(predictions, ctx, videoWidth, videoHeight);
          console.log("Drawn.");
        }
      }
    }
  };

  useEffect(() => {
    runFaceDetect().catch((e) => {
      console.error(e);
    });
  }, [webcam.current?.video?.readyState, runFaceDetect]);

  useTimeoutInterval(async () => {
    if (model) {
      await detect(model);
    }
  }, 1000);

  return (
    <>
      <div className="camera">
        <Webcam ref={webcam} audio={false} />
        <canvas ref={canvas} />
      </div>
    </>
  );
}
