export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  messages: [],
  isInitialQuery: true,
  isLoading: false,
  allMessagesQueried: false,
  unsubscribe: null,
  isNewMessage: false,
})

export const mutations = {
  addMessage(state, message) {
    if (state.isInitialQuery) {
      state.messages.unshift(message)
    } else {
      state.messages.push(message)
    }
  },
  pushMessage(state, message) {
    state.messages.push(message)
  },
  unshiftMessage(state, message) {
    state.messages.unshift(message)
  },
  resetMessages(state) {
    state.messages = []
  },
  updateIsInitialQuery(state, isInitialQuery) {
    state.isInitialQuery = isInitialQuery
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllMessagesQueried(state) {
    state.allMessagesQueried = true
  },
  resetAllMessagesQueried(state) {
    state.allMessagesQueried = false
  },
  updateUnsubscribe(state, unsubscribe) {
    state.unsubscribe = unsubscribe
  },
  updateIsNewMessage(state, isNew) {
    state.isNewMessage = isNew
  }
}

export const actions = {
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  updateIsNewMessage({commit}, isNew) {
    commit('updateIsNewMessage', isNew)
  },
  queryMessages({commit, state}, {params, infiniteState, uid, companyId}) {
    const messages = state.messages
    const chatId = params.id
    // すでにクエリしているか
    if (messages.length == 0) {
      return firestore.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy("createdAt", "desc")
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
            commit('unshiftMessage', message)
          })
          if (docCount == 0) {
            commit('setAllMessagesQueried')
          }
          commit('updateIsLoading', false)

          // listenerがあればremove
          if (state.unsubscribe) {
            state.unsubscribe()
            commit('updateUnsubscribe', null)
          }
          // listener set
          var lastDate
          if (state.messages.length == 0) {
            lastDate = new Date()
          } else {
            const lastIndex = state.messages.length - 1
            lastDate = state.messages[lastIndex].createdAt
          }
          const listener = firestore.collection("chats").doc(chatId)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .startAfter(lastDate)
            .onSnapshot(function(snapshot) {
              if (snapshot.docChanges().length != 0) {
                commit('updateIsNewMessage', true)
              }

              snapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                  const message = {
                    message: change.doc.data()['message'],
                    createdAt: change.doc.data()['createdAt'],
                    pic: change.doc.data()['pic'],
                    user: change.doc.data()['user'],
                  }
                  commit('pushMessage', message)
                }
              })
            })
            commit('updateUnsubscribe', listener)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error)
        })
    } else {
      const lastDate = messages[0].createdAt
      return firestore.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
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
            commit('unshiftMessage', message)
          })
          // infinite loading
          infiniteState.loaded()

          if (docCount == 0) {
            commit('setAllMessagesQueried')
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
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
  resetState({commit}) {
    commit('resetMessages')
    commit('updateIsInitialQuery', true)
    commit('updateIsLoading', false)
    commit('resetAllMessagesQueried')
    commit('updateUnsubscribe', null)
  },
}
