export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  isLoading: false,
  name: '',
  email: '',
  content: '',
  timestamp: null,
})

export const mutations = {
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setName(state, name) {
    state.name = name
  },
  setEmail(state, email) {
    state.email = email
  },
  setContent(state, content) {
    state.content = content
  },
  setTimestamp(state, timestamp) {
    state.timestamp = timestamp
  },
}

export const actions = {
  queryInquiry({commit}, inquiryId) {
    firestore.collection('inquiries')
      .doc(inquiryId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setName', doc.data()['name'])
          commit('setEmail', doc.data()['email'])
          commit('setContent', doc.data()['content'])

          var timestamp = doc.data()['createdAt']
          if (timestamp) {
            let date = new Date( timestamp.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            timestamp = `${year}/${month}/${day}`
          }
          commit('setTimestamp', timestamp)
        }
        commit('updateIsLoading', false)
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  // 問い合わせを追加
  addInquiry({commit}, {name, email, content}) {
    let createdAt = new Date()
    let timestamp
    let year  = createdAt.getFullYear()
    let month = createdAt.getMonth() + 1
    let day  = createdAt.getDate()
    let hours = createdAt.getHours()
    let minutes = createdAt.getMinutes()
    if (minutes < 10) {
      minutes = '0' + String(minutes)
    }
    timestamp = `${year}/${month}/${day} ${hours}:${minutes}`

    var sendContact = functions.httpsCallable("sendContact")
    sendContact({
      name: name,
      email: email,
      content: content,
      timestamp: timestamp
    })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setName', '')
    commit('setEmail', '')
    commit('setContent', '')
    commit('setTimestamp', null)
  },
}
