import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'

var config = {
    apiKey: "AIzaSyAnvKihZAtmJdiUQEvmej4CqoJTXwJegMc",
    authDomain: "lighthouse-7c1a8.firebaseapp.com",
    databaseURL: "https://lighthouse-7c1a8.firebaseio.com",
    projectId: "lighthouse-7c1a8",
    storageBucket: "lighthouse-7c1a8.appspot.com",
    messagingSenderId: "552659351606"
  }

!firebase.apps.length ? firebase.initializeApp(config) : ''

export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const storageRef = firebase.storage().ref()
export default firebase
