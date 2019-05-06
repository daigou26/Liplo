export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  chats: [],
  isInitialLoading: false,
  isLoading: false,
  allChatsQueried: false,
  hasNewMessage: false,
  unsubscribe: null,
})

export const mutations = {
  setChats(state, chats) {
    state.chats = chats
  },
  addChat(state, chat) {
    state.chats.push(chat)
  },
  resetChats(state) {
    state.chats = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllChatsQueried(state, allChatsQueried) {
    state.allChatsQueried = allChatsQueried
  },
  updateHasNewMessage(state, hasNewMessage) {
    state.hasNewMessage = hasNewMessage
  },
  setUnsubscribe(state, unsubscribe) {
    state.unsubscribe = unsubscribe
  },
}

export const actions = {
  updateUnreadCount({commit, state}, params) {
    var chats = state.chats
    const chatId = params.id
    chats.forEach((chat, i) => {
      if (chat.chatId == chatId) {
        chat.userUnreadCount = 0
      }
    })
    commit('setChats', chats)
  },
  updateIsInitialLoading({commit}, isLoading) {
    commit('updateIsInitialLoading', isLoading)
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  queryChats({commit}, {uid, companyId, chats}) {
    // すでにクエリしているか
    if (chats.length == 0) {
      var chatsRef = firestore.collection('chats').where('messagesExist', '==', true)
      if (uid != null && companyId == null) {
        chatsRef = chatsRef.where('uid', '==', uid)
      } else if (uid == null && companyId != null) {
        chatsRef = chatsRef.where('companyId', '==', companyId)
      }

      return chatsRef
        .orderBy('updatedAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['updatedAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const chat = {
              chatId: doc.id,
              uid: doc.data()['uid'],
              profileImageUrl: doc.data()['profileImageUrl'],
              userName: doc.data()['userName'],
              companyId: doc.data()['companyId'],
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              lastMessage: doc.data()['lastMessage'],
              picUnreadCount: doc.data()['picUnreadCount'],
              userUnreadCount: doc.data()['userUnreadCount'],
              updatedAt: doc.data()['updatedAt'],
              timestamp: timestamp,
            }
            commit('addChat', chat)
          })
          if (docCount == 0) {
            commit('setAllChatsQueried', true)
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error)
        })
    } else {
      var chatsRef = firestore.collection('chats').where('messagesExist', '==', true)
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
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['updatedAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const chat = {
              chatId: doc.id,
              uid: doc.data()['uid'],
              profileImageUrl: doc.data()['profileImageUrl'],
              userName: doc.data()['userName'],
              companyId: doc.data()['companyId'],
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              lastMessage: doc.data()['lastMessage'],
              picUnreadCount: doc.data()['picUnreadCount'],
              userUnreadCount: doc.data()['userUnreadCount'],
              updatedAt: doc.data()['updatedAt'],
              timestamp: timestamp,
            }
            commit('addChat', chat)
          })
          if (docCount == 0) {
            commit('setAllChatsQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error)
        })
    }
  },
  // 未読のメッセージがあるか
  setUserMessagesListener({commit}, uid) {
    if (!state.unsubscribe) {
      const listener = firestore.collection('chats')
        .where('userUnreadCount', '>', 0)
        .where('uid', '==', uid)
        .onSnapshot(function(snapshot) {
          if (!snapshot.empty) {
            commit('updateHasNewMessage', true)
          } else {
            commit('updateHasNewMessage', false)
          }
        })
      commit('setUnsubscribe', listener)
    }
  },
  setCompanyMessagesListener({commit, state}, companyId) {
    if (!state.unsubscribe) {
      const listener = firestore.collection('chats')
        .where('picUnreadCount', '>', 0)
        .where('companyId', '==', companyId)
        .onSnapshot(function(snapshot) {
          console.log('CompanyMessagesListener', snapshot);
          if (!snapshot.empty) {
            commit('updateHasNewMessage', true)
          } else {
            commit('updateHasNewMessage', false)
          }
        })
      commit('setUnsubscribe', listener)
    }
  },
  resetHasNewMessage({commit}) {
    commit('updateHasNewMessage', false)
  },
  resetMessagesListener({commit, state}) {
    if (state.unsubscribe) {
      console.log('notification listener unsubscribed');
      state.unsubscribe()
    }
    commit('setUnsubscribe', null)
  },
  resetState({commit}) {
    commit('resetChats')
    commit('updateIsLoading', false)
    commit('setAllChatsQueried', false)
  },
}
