import firebase from "./FirebaseConfig"

const firestore = firebase.firestore()

const createDocument = (collection, document) => {
  return firestore.collection(collection).add(document)
}

const FirebaseFireStoreService = {
  createDocument,
}

export default FirebaseFireStoreService
