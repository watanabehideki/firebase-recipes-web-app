import firebase from "./FirebaseConfig"

const firestore = firebase.firestore()

const createDocument = (collection, document) => {
  return firestore.collection(collection).add(document)
}

const readDocument = ({
  collection,
  queries,
  orderByField,
  orderByDirection,
}) => {
  let collectionRef = firestore.collection(collection)

  // where句の設定
  if (queries && queries.length > 0) {
    for (const query of queries) {
      collectionRef = collectionRef.where(
        query.field,
        query.condition,
        query.value
      )
    }
  }

  // order句の設定
  if (orderByField && orderByDirection) {
    collectionRef = collectionRef.orderBy(orderByField, orderByDirection)
  }
  return collectionRef.get()
}

const updateDocument = (collection, id, document) => {
  return firestore.collection(collection).doc(id).update(document)
}

const deleteDocument = (collection, id) => {
  return firestore.collection(collection).doc(id).delete()
}

const FirebaseFireStoreService = {
  createDocument,
  readDocument,
  updateDocument,
  deleteDocument,
}

export default FirebaseFireStoreService
