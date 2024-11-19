import { useState } from "react";
import { uploadService } from "../services/upload.service";

export function ImgUploader({ onUploaded = null, background = "" }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  });
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImg(ev) {
    setIsUploading(true);
    const { secure_url, height, width } = await uploadService.uploadImg(ev);
    setImgData({ imgUrl: secure_url, width, height });
    setIsUploading(false);
    onUploaded && onUploaded(secure_url);
  }

  function getUploadLabel() {
    // if (imgData.imgUrl) return 'Upload Another?'
    if (imgData.imgUrl) return "";
    return isUploading ? "Uploading...." : "Upload Image";
  }

  return (
    <div
      className="upload-preview"
      style={{ background: `url(${background})`, backgroundSize: "cover" }}
    >
      <div className="upload-preview-inner">
        {imgData.imgUrl && (
          <img
            src={imgData.imgUrl}
            style={{
              width: "200px",
              height: "200px",
              float: "right",
              objectFit: "cover",
            }}
          />
        )}
        {/* <label htmlFor="imgUpload">{getUploadLabel()}</label> */}
        <input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
      </div>
    </div>
  );
}
