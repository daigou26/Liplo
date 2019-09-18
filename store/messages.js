export const strict = false
import { firestore } from '@/plugins/firebase'
import SimpleCrypto from "simple-crypto-js"

export const state = () => ({
  messages: [],
  isInitialLoading: false,
  isLoading: false,
  allMessagesQueried: false,
  unsubscribe: null,
  isNewMessage: false,
})

export const mutations = {
  pushMessage(state, message) {
    state.messages.push(message)
  },
  unshiftMessage(state, message) {
    state.messages.unshift(message)
  },
  resetMessages(state) {
    state.messages = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
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
  updateIsInitialLoading({commit}, isLoading) {
    commit('updateIsInitialLoading', isLoading)
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  updateIsNewMessage({commit}, isNew) {
    commit('updateIsNewMessage', isNew)
  },
  queryMessages({commit, state}, {nuxt, params, infiniteState, type}) {
    const messages = state.messages
    const chatId = params.id
    // すでにクエリしているか
    if (messages.length == 0) {
      firestore.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            let date = new Date( timestamp.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            let hours = date.getHours()
            let minutes = date.getMinutes()
            if (minutes < 10) {
              minutes = '0' + String(minutes)
            }

            // decrypt
            var decipherText = ''
            if (doc.data()['message']) {
              var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
              decipherText = simpleCrypto.decrypt(doc.data()['message'])
            }

            const message = {
              message: decipherText,
              createdAt: doc.data()['createdAt'],
              date: `${year}/${month}/${day}`,
              time: `${hours}:${minutes}`,
              pic: doc.data()['pic'],
              user: doc.data()['user'],
            }
            commit('unshiftMessage', message)
          })
          if (docCount == 0) {
            commit('setAllMessagesQueried')
          }
          commit('updateIsInitialLoading', false)
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
                    console.log('Error updating document', err)
                  })
              }

              if (!snapshot.empty) {
                commit('updateIsNewMessage', true)
              }

              snapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                  var timestamp = change.doc.data()['createdAt']
                  let date = new Date( timestamp.seconds * 1000 )
                  let year  = date.getFullYear()
                  let month = date.getMonth() + 1
                  let day  = date.getDate()
                  let hours = date.getHours()
                  let minutes = date.getMinutes()
                  if (minutes < 10) {
                    minutes = '0' + String(minutes)
                  }

                  // decrypt
                  var decipherText = ''
                  if (change.doc.data()['message']) {
                    var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
                    decipherText = simpleCrypto.decrypt(change.doc.data()['message'])
                  }

                  const message = {
                    message: decipherText,
                    createdAt: change.doc.data()['createdAt'],
                    date: `${year}/${month}/${day}`,
                    time: `${hours}:${minutes}`,
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
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          nuxt.error({ statusCode: 404, message: 'not found' })
          console.log("Error getting document:", error)
        })
    } else {
      const lastDate = messages[0].createdAt
      return firestore.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            let date = new Date( timestamp.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            let hours = date.getHours()
            let minutes = date.getMinutes()
            if (minutes < 10) {
              minutes = '0' + String(minutes)
            }

            // decrypt
            var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
            var decipherText = ''
            if (doc.data()['message']) {
              var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
              decipherText = simpleCrypto.decrypt(doc.data()['message'])
            }

            const message = {
              message: decipherText,
              createdAt: doc.data()['createdAt'],
              date: `${year}/${month}/${day}`,
              time: `${hours}:${minutes}`,
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
          nuxt.error({ statusCode: 404, message: 'not found' })
          console.log("Error getting document:", error)
        })
    }
  },
  resetUnsubscribe({commit}) {
    commit('setUnsubscribe', null)
  },
  resetState({commit}) {
    commit('resetMessages')
    commit('updateIsNewMessage', false)
    commit('updateIsLoading', false)
    commit('resetAllMessagesQueried')
  },
}
