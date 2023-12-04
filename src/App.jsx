import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import { Row, Col, Container } from "react-bootstrap";
import Upload from "./upload";
import Loading from "./loading";
import { ReceiptIcon, ImageIcon } from "./assets/svgs";
import "./App.css";

function App() {
  const [image, setYourImage] = useState(null);
  const [receipt, setReceiptImage] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [layout, setLayout] = useState("side-by-side");
  const [shouldRemoveBackground, setShouldRemoveBackground] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const canvasRef = useRef(null);

  const fileReader1 = new FileReader();

  useEffect(() => {
    if (image) {
      checkAndCompressImage(image, setYourImage);
    }
    if (receipt) {
      checkAndCompressImage(receipt, setReceiptImage);
    }
  }, [image, receipt]);

  const setImage = (image, title) => {
    if (title === "Reciept") {
      setReceiptImage(image);
    } else {
      setYourImage(image);
    }
  };

  const merge = () => {
    if (!image || !receipt) {
      alert("Please upload both the images");
      return;
    }

    if (layout === "side-by-side" && !shouldRemoveBackground) {
      setIsLoading(true);
      setIsMerged(true);
      return mergeImages();
    }
    if (layout === "side-by-side" && shouldRemoveBackground) {
      setIsLoading(true);
      setIsMerged(true);
      return loadImage();
    }
    if (layout === "overlap" && !shouldRemoveBackground) {
      setIsLoading(true);
      setIsMerged(true);
      return mergeImages(null, true);
    }
    if (layout === "overlap" && shouldRemoveBackground) {
      setIsLoading(true);
      setIsMerged(true);
      return loadImage(true);
    }
  };

  const checkAndCompressImage = async (file, setImage) => {
    if (file.size < 500 * 1024) {
      return;
    } else {
      const compressedImage = await compressImage(file, {
        // 0: is maximum compression
        // 1: is no compression
        quality: 0.5,

        // We want a JPEG file
        type: "image/jpeg",
      });
      setImage(compressedImage);
    }
  };

  const compressImage = async (file, { quality = 1, type = file.type }) => {
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Draw to canvas
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    return await new Promise(resolve => canvas.toBlob(resolve, type, quality));
  };

  const loadImage = async overlap => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    img.addEventListener("load", async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      await removeBackground(canvas, overlap);
    });

    fileReader1.onload = function (event) {
      img.src = event.target.result;
    };
    fileReader1.readAsDataURL(image);
  };

  const removeBackground = async (canvas, overlap) => {
    const ctx = canvas.getContext("2d");

    // Loading the model
    const net = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    });

    // Segmentation
    const { data: map } = await net.segmentPerson(canvas, {
      internalResolution: "medium",
    });

    // Extracting image data
    const { data: imgData } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Creating new image data
    const newImg = ctx.createImageData(canvas.width, canvas.height);
    const newImgData = newImg.data;

    for (let i = 0; i < map.length; i++) {
      const [r, g, b, a] = [
        imgData[i * 4],
        imgData[i * 4 + 1],
        imgData[i * 4 + 2],
        imgData[i * 4 + 3],
      ];
      [newImgData[i * 4], newImgData[i * 4 + 1], newImgData[i * 4 + 2], newImgData[i * 4 + 3]] =
        !map[i] ? [255, 255, 255, 0] : [r, g, b, a];
    }

    // Draw the new image back to canvas
    ctx.putImageData(newImg, 0, 0);

    if (overlap) {
      mergeImages(canvas.toDataURL("image/png"), true);
    } else {
      mergeImages(canvas.toDataURL("image/png"));
    }
  };

  const mergeImages = (newImgData, overlap) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const yourImg = new Image();
    const receiptImg = new Image();

    const fileReader1 = new FileReader();
    fileReader1.onload = function (event) {
      receiptImg.onload = function () {
        if (overlap) {
          canvas.width = receiptImg.width;
          canvas.height = receiptImg.height;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(receiptImg, 0, 0);

          ctx.drawImage(yourImg, 0, 0, receiptImg.width * 0.7, receiptImg.height * 0.7);
          setIsLoading(false);
        } else {
          yourImg.width = receiptImg.width;
          canvas.width = receiptImg.width + yourImg.width;
          canvas.height = receiptImg.height;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(receiptImg, 0, 0);

          ctx.drawImage(yourImg, receiptImg.width, 0, receiptImg.width, receiptImg.height);
          setIsLoading(false);
        }

        setResultImageUrl(canvas.toDataURL());

        // Update the download link href
        const link = document.getElementById("link");
        link.href = canvas.toDataURL();
      };
      receiptImg.src = event.target.result;
    };
    fileReader1.readAsDataURL(receipt);

    const fileReader2 = new FileReader();
    fileReader2.onload = function (event) {
      if (newImgData) {
        yourImg.src = newImgData;
      } else {
        yourImg.src = event.target.result;
      }
    };

    fileReader2.readAsDataURL(image);
  };

  return (
    <Container>
      {isLoading && <Loading />}
      <canvas
        ref={canvasRef}
        style={{
          display: !isMerged && "none",
        }}
        className="img-responsive"
      ></canvas>

      {isMerged && (
        <div>
          <a id="link" href={resultImageUrl} download="merged_image.png">
            Download Merged Image
          </a>
        </div>
      )}

      {!isMerged && (
        <>
          <h1 className="mt-4 mb-5 mergemaster">
            Merge<span>Master</span>
          </h1>

          <h3 className="mb-5 mergemastersubtitle">Streets may forget but we will never...</h3>
          <div>
            <h1 className="uploadHeading">Upload Reciept</h1>
            <Upload Icon={ReceiptIcon} title={"Reciept"} onSetImage={setImage} />
          </div>
          <div className="mt-5">
            <h1 className="uploadHeading">Upload Image</h1>
            <Upload Icon={ImageIcon} title={"Image"} onSetImage={setImage} />
          </div>
          <div className="layout-options">
            <Row className="mt-5 optionscontainer">
              <Col>
                <div className="forLayoutLabel">
                  <h4>Layout</h4>
                  <label>
                    <input
                      type="radio"
                      name="layoutOption"
                      value="side-by-side"
                      checked={layout === "side-by-side"}
                      onChange={() => setLayout("side-by-side")}
                    />
                    Side-by-Side
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="layoutOption"
                      value="overlap"
                      checked={layout === "overlap"}
                      onChange={() => setLayout("overlap")}
                    />
                    Overlap
                  </label>
                </div>
              </Col>
              <Col>
                <div className="removeBG">
                  <h4 className="removeBGHeading">Remove Image Background?</h4>
                  <div className="removeBGcheckbox__container">
                    <label>
                      <input
                        type="checkbox"
                        name="removeBackground"
                        checked={shouldRemoveBackground}
                        onChange={() => setShouldRemoveBackground(!shouldRemoveBackground)}
                      />
                      Yes
                    </label>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <button className="merge-button mt-4 mb-4" onClick={merge}>
            Merge
          </button>
        </>
      )}
    </Container>
  );
}

export default App;
