import firebase from "./FirebaseConfig"

const firestore = firebase.firestore()

const createDocument = (collection, document) => {
  return firestore.collection(collection).add(document)
}

const readDocument = (collection, id) => {
  return firestore.collection(collection).doc(id).get()
}

const readDocuments = async ({
  collection,
  queries,
  orderByField,
  orderByDirection,
  perPage,
  cursorId,
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

  // limit句
  if (perPage) {
    collectionRef = collectionRef.limit(perPage)
  }

  // 指定されたID以降のレコードを取得する
  if (cursorId) {
    const document = await readDocument(collection, cursorId)
    collectionRef = collectionRef.startAfter(document)
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
  readDocuments,
  updateDocument,
  deleteDocument,
}

export default FirebaseFireStoreService
