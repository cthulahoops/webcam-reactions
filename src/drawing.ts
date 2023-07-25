import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";

import {
  Coords3D,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";


const drawFeature = (ctx: CanvasRenderingContext2D, points: Coords3D, color: string) => {
  ctx.fillStyle = "blue";
  for (const point of points) {
    ctx.fillRect(point[0] - 1, point[1] - 1, 3, 3)
  }

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (const point of points) {
    ctx.lineTo(point[0], point[1]);
  }
  // ctx.closePath();
  ctx.stroke();
}


export const draw = (
  ctx: CanvasRenderingContext2D,
  predictions: AnnotatedPrediction[],
  width: number,
  height: number
) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      if (prediction.kind !== "MediaPipePredictionValues") {
        return;
      }
      // const keypoints = prediction.scaledMesh;
      // const boundingBox = prediction.boundingBox;
      // const bottomRight = boundingBox.bottomRight as Coord2D;
      // const topLeft = boundingBox.topLeft as Coord2D;
      // make the drawing mask larger a bit
      // console.log("path: ", path);
      ctx.clearRect(0, 0, width, height);

      const box = prediction.boundingBox;
      ctx.strokeStyle = "red";
      ctx.strokeRect(box.topLeft[0], box.topLeft[1], box.bottomRight[0] - box.topLeft[0], box.bottomRight[1] - box.topLeft[1]);
      // ctx.save();
      // drawFeature(ctx, prediction.annotations?.silhouette, "tomato");
      // drawFeature(ctx, prediction.annotations?.rightEyebrowUpper, "yellow");
      // drawFeature(ctx, prediction.annotations?.leftEyebrowUpper, "yellow");
      // drawFeature(ctx, prediction.annotations?.leftEyeIris, "blue");
      // drawFeature(ctx, prediction.annotations?.rightEyeIris, "blue");
      // drawFeature(ctx, prediction.annotations?.noseBottom, "black");
      // drawFeature(ctx, prediction.annotations?.lipsUpperOuter, "purple");
      // drawFeature(ctx, prediction.annotations?.lipsLowerOuter, "purple");
      if (prediction.annotations) {
        for (const feature in prediction.annotations) {
          drawFeature(ctx, prediction.annotations[feature], "yellow");
        }
      }
      // ctx.restore();
    });
  } else {
    ctx.clearRect(0, 0, width, height);
  }
};

