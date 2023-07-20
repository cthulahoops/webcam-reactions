import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";

import {
  Coords3D,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";


const drawFeature = (ctx: CanvasRenderingContext2D, points: Coords3D, color: string) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (const point of points) {
    ctx.lineTo(point[0], point[1]);
  }
  ctx.closePath();
  ctx.fill();
}


export const draw = (
  predictions: AnnotatedPrediction[],
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      // const keypoints = prediction.scaledMesh;
      // const boundingBox = prediction.boundingBox;
      // const bottomRight = boundingBox.bottomRight as Coord2D;
      // const topLeft = boundingBox.topLeft as Coord2D;
      // make the drawing mask larger a bit
      // console.log("path: ", path);
      ctx.clearRect(0, 0, width, height);
      // ctx.save();
      drawFeature(ctx, prediction.annotations?.silhouette, "tomato");
      drawFeature(ctx, prediction.annotations?.rightEyebrowUpper, "yellow");
      drawFeature(ctx, prediction.annotations?.leftEyebrowUpper, "yellow");
      drawFeature(ctx, prediction.annotations?.leftEyeIris, "blue");
      drawFeature(ctx, prediction.annotations?.rightEyeIris, "blue");
      drawFeature(ctx, prediction.annotations?.noseBottom, "black");
      drawFeature(ctx, prediction.annotations?.lipsUpperOuter, "purple");
      drawFeature(ctx, prediction.annotations?.lipsLowerOuter, "purple");
      ctx.fill();
      // ctx.restore();
    });
  } else {
    ctx.clearRect(0, 0, width, height);
  }
};

