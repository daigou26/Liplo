export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  chats: [],
  isLoading: false,
  allChatsQueried: false,
})

export const mutations = {
  addChat(state, chat) {
    state.chats.push(chat)
  },
  updateLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllChatsQueried(state) {
    state.allChatsQueried = true
  }
}

export const actions = {
  updateLoading({commit}, isLoading) {
    commit('updateLoading', isLoading)
  },
  queryChats({commit}, {uid, companyId, chats}) {
    // すでにクエリしているか
    if (chats.length == 0) {
      var chatsRef = firestore.collection('chats')
      if (uid != null && companyId == null) {
        chatsRef = chatsRef.where('uid', '==', uid)
      } else if (uid == null && companyId != null) {
        chatsRef = chatsRef.where('companyId', '==', companyId)
      }

      return chatsRef.orderBy("updatedAt", "desc").limit(20).get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const chat = {
              chatId: doc.id,
              uid: doc.data()['uid'],
              profileImageUrl: doc.data()['profileImageUrl'],
              userName: doc.data()['userName'],
              companyId: doc.data()['companyId'],
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              lastMessage: doc.data()['lastMessage'],
              unreadCount: doc.data()['unreadCount'],
              updatedAt: doc.data()['updatedAt']
            }
            commit('addChat', chat)
          })
          if (docCount == 0) {
            commit('setAllChatsQueried')
          }
          commit('updateLoading', false)
        })
        .catch(function(error) {
          commit('updateLoading', false)
          console.log("Error getting document:", error)
        })
    } else {
      var chatsRef = firestore.collection('chats')
      if (uid != null && companyId == null) {
        chatsRef = chatsRef.where('uid', '==', uid)
      } else if (uid == null && companyId != null) {
        chatsRef = chatsRef.where('companyId', '==', companyId)
      }

      const lastIndex = chats.length - 1
      const lastDate = chats[lastIndex].updatedAt
      return chatsRef
        .orderBy('updatedAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const chat = {
              chatId: doc.id,
              uid: doc.data()['uid'],
              profileImageUrl: doc.data()['profileImageUrl'],
              userName: doc.data()['userName'],
              companyId: doc.data()['companyId'],
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              lastMessage: doc.data()['lastMessage'],
              unreadCount: doc.data()['unreadCount'],
              updatedAt: doc.data()['updatedAt']
            }
            commit('addChat', chat)
          })
          if (docCount == 0) {
            commit('setAllChatsQueried')
          }
          commit('updateLoading', false)
        })
        .catch(function(error) {
          commit('updateLoading', false)
          console.log("Error getting document:", error)
        })
    }
  },
}
