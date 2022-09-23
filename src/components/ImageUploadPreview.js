import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import FirebaseStorageService from "../FirebaseStorageService"

function ImageUploadPreview({
  basePath,
  existingImageUrl,
  handleUploadFinish,
  handleUploadCancel,
}) {
  const [uploadProgress, setUploadProgress] = useState(-1)
  const [imageUrl, setImageUrl] = useState("")
  const fileInputRef = useRef()

  useEffect(() => {
    if (existingImageUrl) {
      setImageUrl(existingImageUrl)
    } else {
      setUploadProgress(-1)
      setImageUrl("")
      fileInputRef.current.value = null
    }
  }, [existingImageUrl])

  async function handleFileChange(event) {
    const files = event.target.files
    const file = files[0]
    if (!file) {
      alert("エラーが発生しました。もう一度お試しください。")
      return
    }

    const generatedFileId = uuidv4()

    try {
      const downloadUrl = await FirebaseStorageService.uploadFile(
        file,
        `${basePath}/${generatedFileId}`,
        setUploadProgress
      )

      setImageUrl(downloadUrl)
      handleUploadFinish(downloadUrl)
    } catch (error) {
      setUploadProgress(-1)
      fileInputRef.current.value = null
      alert(error.message)
      throw error
    }
  }

  // レシピが登録される前にキャンセルされた場合アップロードしたファイルを削除する
  function handleCancelImageClick() {
    FirebaseStorageService.deleteFile(imageUrl)
    fileInputRef.current.value = null
    setImageUrl("")
    setUploadProgress(-1)
    handleUploadCancel()
  }
  return (
    <div className="image-upload-preview-contalner">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        hidden={uploadProgress > -1 || imageUrl} //アップロード中またはアップロード済みなら非表示
      />
      {!imageUrl && uploadProgress > -1 ? (
        <div>
          <label htmlFor="file">アップロード状況：</label>
          <progress id="file" value={uploadProgress} max="100">
            {uploadProgress}%
          </progress>
          <span>{uploadProgress}%</span>
        </div>
      ) : null}

      {imageUrl ? (
        <div className="image-preview">
          <img src={imageUrl} alt={imageUrl} className="image" />
          <button
            type="button"
            onClick={handleCancelImageClick}
            className="primary-button"
          >
            キャンセル
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ImageUploadPreview
