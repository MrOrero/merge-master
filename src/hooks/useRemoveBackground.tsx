// import React, { useState, useEffect, useRef } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as bodyPix from "@tensorflow-models/body-pix";

// const useRemoveBackground = () => {
//   const [yourImage, setYourImage] = useState(null);
//   const [receipt, setReceiptImage] = useState(null);

//   const setImage = (image, title) => {
//     if (title === "Reciept") {
//       setReceiptImage(image);
//     } else {A
//       setYourImage(image);
//     }
//   };

//   const mergeImages = () => {
//     // Add your merge logic here
//   };

//   useEffect(() => {
//     const loadImage = async (image) => {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');

//       img.addEventListener('load', async () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.drawImage(img, 0, 0);

//         await removeBackground(canvas);
//       });

//       console.log('Loading image...');
//       img.src = yourImage; // Change this to the appropriate image state
//     };

//     const removeBackground = async (canvas) => {
//       const ctx = canvas.getContext('2d');

//       // Loading the model
//       const net = await bodyPix.load({
//         architecture: 'MobileNetV1',
//         outputStride: 16,
//         multiplier: 0.75,
//         quantBytes: 2
//       });

//       // Segmentation
//       const { data: map } = await net.segmentPerson(canvas, {
//         internalResolution: 'medium',
//       });

//       // Extracting image data
//       const { data: imgData } = ctx.getImageData(0, 0, canvas.width, canvas.height);

//       // Creating new image data
//       const newImg = ctx.createImageData(canvas.width, canvas.height);
//       const newImgData = newImg.data;

//       for (let i = 0; i < map.length; i++) {
//         const [r, g, b, a] = [imgData[i * 4], imgData[i * 4 + 1], imgData[i * 4 + 2], imgData[i * 4 + 3]];
//         [
//           newImgData[i * 4],
//           newImgData[i * 4 + 1],
//           newImgData[i * 4 + 2],
//           newImgData[i * 4 + 3]
//         ] = !map[i] ? [255, 255, 255, 0] : [r, g, b, a];
//       }

//       // Draw the new image back to canvas
//       ctx.putImageData(newImg, 0, 0);
//     };

//     if (yourImage) {
//       tf.ready().then(() => loadImage(yourImage));
//     }
//   }, [yourImage]); // Add other dependencies as needed

//   return { mergeImages };
// };
