import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

// dev
let config = {
  apiKey: "AIzaSyAnvKihZAtmJdiUQEvmej4CqoJTXwJegMc",
  authDomain: "lighthouse-7c1a8.firebaseapp.com",
  databaseURL: "https://lighthouse-7c1a8.firebaseio.com",
  projectId: "lighthouse-7c1a8",
  storageBucket: "lighthouse-7c1a8.appspot.com",
  messagingSenderId: "552659351606",
  appId: "1:552659351606:web:804d44f00cff7cad"
}

!firebase.apps.length ? firebase.initializeApp(config) : ''

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const functions = firebase.functions()
export const storageRef = firebase.storage().ref()
export default firebase
