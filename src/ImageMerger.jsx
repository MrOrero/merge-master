// import React, { useState } from "react";

// const ImageMerger = () => {
//   const [yourImage, setYourImage] = useState(null);
//   const [receiptImage, setReceiptImage] = useState(null);
//   const [resultImageUrl, setResultImageUrl] = useState("");

//   const mergeImages = e => {
//     e.preventDefault();
//     const canvas = document.getElementById("canvas");
//     const ctx = canvas.getContext("2d");

//     const yourImg = new Image();
//     const receiptImg = new Image();

//     const fileReader1 = new FileReader();
//     fileReader1.onload = function (event) {
//       receiptImg.onload = function () {
//         canvas.width = receiptImg.width + 20 + yourImg.width;
//         canvas.height = receiptImg.height;
//         ctx.fillStyle = "white";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(receiptImg, 0, 0);

//         ctx.drawImage(
//           yourImg,
//           receiptImg.width + 20,
//           0,
//           receiptImg.width * 0.7,
//           receiptImg.height * 0.7
//         );

//         setResultImageUrl(canvas.toDataURL());

//         // Update the download link href
//         const link = document.getElementById("link");
//         link.href = canvas.toDataURL();
//       };
//       receiptImg.src = event.target.result;
//     };
//     fileReader1.readAsDataURL(receiptImage);

//     const fileReader2 = new FileReader();
//     fileReader2.onload = function (event) {
//       yourImg.src = event.target.result;
//     };

//     fileReader2.readAsDataURL(yourImage);
//   };

//   return (
//     <div>
//       <form onSubmit={mergeImages}>
//         <input type="file" id="yourImage" onChange={e => setYourImage(e.target.files[0])} />
//         <input type="file" id="receiptImage" onChange={e => setReceiptImage(e.target.files[0])} />
//         <button type="submit">Merge Images</button>
//       </form>
//       <canvas id="canvas"></canvas>
//       {resultImageUrl && (
//         <div>
//           <img src={resultImageUrl} alt="Merged Image" id="resultImage" />
//           <a id="link" href={resultImageUrl} download="merged_image.png">
//             Download Merged Image
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageMerger;
