export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  // chats: [],
  // isLoading: false,
  // allChatsQueried: false,
})

export const mutations = {
  // addChat(state, chat) {
  //   state.chats.push(chat)
  // },
}

export const actions = {
  postMessageFromUser({commit}, {params, message, uid, profileImageUrl, name}) {
    const chatId = params.id
    const user = {
      uid: uid,
      profileImageUrl: profileImageUrl,
      name: name,
    }
    
    firestore.collection('chats').doc(chatId)
      .collection('messages')
      .add({
        message: message,
        user: user,
        createdAt: new Date(),
      })
      .then(() => {
        console.log('post message')
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
}
