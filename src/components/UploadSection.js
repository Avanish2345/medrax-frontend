import React, { useRef, useState, useEffect } from "react";

const UploadSection = ({ image, onImageUpload }) => {
  const fileRef = useRef();
  const [drag, setDrag] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (image) {
      setReveal(false);
      const t = setTimeout(() => setReveal(true), 40);
      return () => clearTimeout(t);
    }
    setReveal(false);
  }, [image]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) onImageUpload(e.target.files[0]);
  };

  const handleClick = () => fileRef.current.click();

  const imageUrl = image ? URL.createObjectURL(image) : null;

  return (
    <div
      className={`upload-box ${drag ? "dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onClick={handleClick}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {!image ? (
        <div className="upload-placeholder">
          <div className="upload-icon">
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v10"
                stroke="#7dd3fc"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 15v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2"
                stroke="#7dd3fc"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 6l-4-3-4 3"
                stroke="#7dd3fc"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="upload-text">Upload X-Ray Image</div>
          <div className="upload-subtext">Drag & drop or click to upload</div>
          <div className="hint">Supported: jpg, png, dcm (converted)</div>
        </div>
      ) : (
        <div className={`uploaded-img-box ${reveal ? "reveal" : ""}`}>
          <div className="uploaded-label">Uploaded X-Ray</div>
          <div className="img-wrap">
            <img src={imageUrl} alt="Uploaded X-ray" className="uploaded-img" />
            <div className="img-overlay">
              <div className="zoom-tip">Click to change</div>
            </div>
          </div>
        </div>
      )}
      <div className={`drag-overlay ${drag ? "visible" : ""}`}>
        <div className="drag-text">Drop image to upload</div>
      </div>
    </div>
  );
};

export default UploadSection;
