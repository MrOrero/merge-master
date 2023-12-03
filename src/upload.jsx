import { useState } from "react";

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
    <div className="upload-box upload-container mt-5">
      <div className="inner-box upload-container">
        <div className="upload-box-content">
          {Icon && <Icon />}
          <label htmlFor={`fileInput-${title}`} className="upload-label">
            <span className="upload-box-button">Select {title} file</span>
            <input
              type="file"
              id={`fileInput-${title}`}
              onChange={e => setImage(e, title)}
              style={{ display: "none" }}
            />
            {yourImage && <p className="text-white mt-2">{yourImage.name}</p>}
            {receiptImage && <p className="text-white mt-2">{receiptImage.name}</p>}
          </label>
        </div>
      </div>
    </div>
  );
}

export default Upload;
