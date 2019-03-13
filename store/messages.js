export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  messages: [],
  isInitialQuery: true,
  isLoading: false,
  allMessagesQueried: false,
  unsubscribe: null,
})

export const mutations = {
  addMessage(state, message) {
    if (state.isInitialQuery) {
      state.messages.unshift(message)
    } else {
      state.messages.push(message)
    }
  },
  resetMessages(state) {
    state.messages = []
  },
  updateLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllMessagesQueried(state) {
    state.allMessagesQueried = true
  },
  updateUnsubscribe(state, unsubscribe) {
    state.unsubscribe = unsubscribe
  },
  updateIsInitialQuery(state, isInitialQuery) {
    state.isInitialQuery = isInitialQuery
  }
}

export const actions = {
  updateLoading({commit}, isLoading) {
    commit('updateLoading', isLoading)
  },
  queryMessages({commit}, {params, uid, companyId, messages}) {
    const chatId = params.id
    // すでにクエリしているか
    if (messages.length == 0) {
      return firestore.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy("updatedAt", "desc")
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const message = {
              message: doc.data()['message'],
              createdAt: doc.data()['createdAt'],
              pic: doc.data()['pic'],
              user: doc.data()['user'],
            }
            commit('addMessage', message)
          })
          if (docCount == 0) {
            commit('setAllMessagesQueried')
          }
          commit('updateLoading', false)

          // listenerがあればremove
          if (this.unsubscribe) {
            console.log('remove listener in add')
            this.unsubscribe()
            commit('updateUnsubscribe', null)
          }
          // listener set
          console.log('add listener')
          const lastIndex = this.messages.length - 1
          const lastDate = this.messages[lastIndex].updatedAt
          const listener = firestore.collection("chats").doc(chatId)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .startAfter(lastDate)
            .onSnapshot(function(snapshot) {
              console.log(snapshot);
              var messages = []
              snapshot.forEach(function(doc) {
                messages.push(doc.data())
              })
              console.log(snapshot.docChanges())
              snapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                  console.log("New: ", change.doc.data());
                }
                if (change.type === "modified") {
                  console.log("Modified: ", change.doc.data());
                }
                if (change.type === "removed") {
                  console.log("Removed: ", change.doc.data());
                }
              })
              console.log("messages: ", messages)
            })
            commit('updateUnsubscribe', listener)
        })
        .catch(function(error) {
          commit('updateLoading', false)
          console.log("Error getting document:", error)
        })
    } else {
      const lastIndex = messages.length - 1
      const lastDate = messages[lastIndex].updatedAt
      return firestore.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy('updatedAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const message = {
              message: doc.data()['message'],
              createdAt: doc.data()['createdAt'],
              pic: doc.data()['pic'],
              user: doc.data()['user'],
            }
            commit('addMessage', message)
          })
          if (docCount == 0) {
            commit('setAllMessagesQueried')
          }
          commit('updateLoading', false)
        })
        .catch(function(error) {
          commit('updateLoading', false)
          console.log("Error getting document:", error)
        })
    }
  },
  addMessagesListener({commit}, params) {

    commit('updateIsInitialQuery', true)
    commit('resetMessages')

    console.log('add listener')
    const chatId = params.id
    const listener = firestore.collection("chats").doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === "added") {
            commit('addMessage', change.doc.data())
          }
          // if (change.type === "modified") {
          //   console.log("Modified: ", change.doc.data());
          // }
          // if (change.type === "removed") {
          //   console.log("Removed: ", change.doc.data());
          // }
        })
        commit('updateIsInitialQuery', false)
      })
    commit('updateUnsubscribe', listener)
  },
  resetUnsubscribe({commit}) {
    commit('updateUnsubscribe', null)
  },
}
