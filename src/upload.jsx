import { useState } from "react";
import { Container } from "react-bootstrap";

function Upload({ Icon, title, onSetImage }) {
  const [yourImage, setYourImage] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);

  const setImage = (e, title) => {
    if (title === "Reciept") {
      setReceiptImage(e.target.files[0]);
    } else {
      setYourImage(e.target.files[0]);
    }
    onSetImage(e.target.files[0], title);
  };

  return (
    <Container className="upload-box">
      {/* <div className=""> */}
      <div className="upload-box-content inner-box ">
        {Icon && <Icon />}
        <label htmlFor={`fileInput-${title}`} className="upload-label">
          <span className="upload-box-button">Select {title}</span>
          <input
            type="file"
            id={`fileInput-${title}`}
            onChange={(e) => setImage(e, title)}
            style={{ display: "none" }}
            accept="image/*"
          />
          {yourImage && <p className="text-white mt-2">{yourImage.name}</p>}
          {receiptImage && (
            <p className="text-white mt-2">{receiptImage.name}</p>
          )}
        </label>
      </div>
      {/* </div> */}
    </Container>
  );
}

export default Upload;
