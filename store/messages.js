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
  setUnsubscribe(state, unsubscribe) {
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
  queryMessages({commit, state}, {params, infiniteState, type}) {
    const messages = state.messages
    const chatId = params.id
    // すでにクエリしているか
    if (messages.length == 0) {
      firestore.collection('chats').doc(chatId)
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
            commit('setUnsubscribe', null)
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
              // unreadCount更新
              if (type) {
                var data
                if (type == 'user') {
                  data = {
                    userUnreadCount: 0
                  }
                } else {
                  data = {
                    picUnreadCount: 0
                  }
                }
                firestore.collection('chats')
                  .doc(chatId)
                  .update(data)
                  .catch(err => {
                    console.log('Error getting document', err)
                  })
              }

              if (!snapshot.empty) {
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
            commit('setUnsubscribe', listener)
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
          if (infiniteState) {
            infiniteState.loaded()
          }

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
  resetUnsubscribe({commit}) {
    commit('setUnsubscribe', null)
  },
  resetState({commit}) {
    commit('resetMessages')
    commit('updateIsInitialQuery', true)
    commit('updateIsLoading', false)
    commit('resetAllMessagesQueried')
  },
}
