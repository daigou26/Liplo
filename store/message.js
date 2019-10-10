export const strict = false
import { firestore } from '@/plugins/firebase'
import SimpleCrypto from "simple-crypto-js"

export const actions = {
  postMessageFromUser({commit}, {params, message, uid, imageUrl, name}) {
    const chatId = params.id
    let user = {
      uid: uid,
      name: name,
    }
    if (imageUrl) {
      user.imageUrl = imageUrl
    }
    // encrypt
    var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
    var cipherText = simpleCrypto.encrypt(message)

    return firestore.collection('chats').doc(chatId)
      .collection('messages')
      .add({
        message: cipherText,
        user: user,
        createdAt: new Date(),
      })
      .then(() => {

      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  postMessageFromPic({commit}, {chatId, message, uid, imageUrl, name}) {
    let pic = {
      uid: uid,
      name: name,
    }
    if (imageUrl) {
      pic.imageUrl = imageUrl
    }
    // encrypt
    var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
    var cipherText = simpleCrypto.encrypt(message)

    return firestore.collection('chats').doc(chatId)
      .collection('messages')
      .add({
        message: cipherText,
        pic: pic,
        createdAt: new Date(),
      })
      .then(() => {

      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
}
