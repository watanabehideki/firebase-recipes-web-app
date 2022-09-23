import firebase from "./FirebaseConfig"

const storageRef = firebase.storage().ref()

const uploadFile = (file, fullFilePath, progressCallback) => {
  const uploadTask = storageRef.child(fullFilePath).put(file)

  /*
    アップロード処理
    uploadTask.on(
      引数1(発火させる条件),
      引数2(発火した時に実行する関数),
      引数3(アップロードが失敗した時に実行する関数),
      引数4(成功した時に実行する関数),
    )
  */
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // アップロード中の進行状況のパーセント
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      )

      progressCallback(progress)
    },
    (error) => {
      throw error
    }
  )

  // アップロード先のURLをして返す
  return uploadTask.then(async () => {
    const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL()

    return downloadUrl
  })
}

const deleteFile = (fileDownloadUrl) => {
  const decodeUrl = decodeURIComponent(fileDownloadUrl)
  const startIndex = decodeUrl.indexOf("/o/") + 3
  const endIndex = decodeUrl.indexOf("?")
  const filePath = decodeUrl.substring(startIndex, endIndex)

  return storageRef.child(filePath).delete()
}

const FirebaseStorageService = {
  uploadFile,
  deleteFile,
}

export default FirebaseStorageService
