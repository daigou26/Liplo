import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'

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

// stag
// let config = {
//   apiKey: "AIzaSyCosKQ4ekB6qPG14abZzjfN27gpozBtCWE",
//   authDomain: "lighthouse-stag.firebaseapp.com",
//   databaseURL: "https://lighthouse-stag.firebaseio.com",
//   projectId: "lighthouse-stag",
//   storageBucket: "lighthouse-stag.appspot.com",
//   messagingSenderId: "484080517026",
//   appId: "1:484080517026:web:4f74a71040989123"
// }

// prod
// var config = {
//   apiKey: "AIzaSyBKHKw-FSZxVnyBncPPVpPAjPyq4ykkiuo",
//   authDomain: "lighthouse-prod.firebaseapp.com",
//   databaseURL: "https://lighthouse-prod.firebaseio.com",
//   projectId: "lighthouse-prod",
//   storageBucket: "lighthouse-prod.appspot.com",
//   messagingSenderId: "759990738441",
//   appId: "1:759990738441:web:95ab467a76801a92"
// }

!firebase.apps.length ? firebase.initializeApp(config) : ''

export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const functions = firebase.functions()
export const storageRef = firebase.storage().ref()
export default firebase
