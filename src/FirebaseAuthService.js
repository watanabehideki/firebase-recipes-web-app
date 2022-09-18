import firebase from "./FirebaseConfig"

const auth = firebase.auth()

const registerUser = (email, passowrd) => {
  return auth.createUserWithEmailAndPassword(email, passowrd)
}

const loginUser = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
}

const logoutUser = () => {
  return auth.signOut()
}

const sendPasswardResetEmail = (email) => {
  return auth.sendPasswordResetEmail(email)
}

const loginWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  return auth.signInWithPopup(provider)
}

const subscribeToAuthChanges = (handleAuthChange) => {
  auth.onAuthStateChanged((user) => {
    handleAuthChange(user)
  })
}

const FirebaseAuthService = {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswardResetEmail,
  loginWithGoogle,
  subscribeToAuthChanges,
}

export default FirebaseAuthService
