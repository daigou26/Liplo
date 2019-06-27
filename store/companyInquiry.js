export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  isLoading: false,
  companyName: '',
  companyEmail: '',
  userName: '',
  email: '',
  position: '',
  type: null,
  content: '',
  timestamp: null,
})

export const mutations = {
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setCompanyName(state, name) {
    state.companyName = name
  },
  setCompanyEmail(state, email) {
    state.companyEmail = email
  },
  setUserName(state, name) {
    state.userName = name
  },
  setEmail(state, email) {
    state.email = email
  },
  setPosition(state, position) {
    state.position = position
  },
  setType(state, type) {
    state.type = type
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
    firestore.collection('companyInquiries')
      .doc(inquiryId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setCompanyName', doc.data()['companyName'])
          commit('setCompanyEmail', doc.data()['companyEmail'])
          commit('setUserName', doc.data()['userName'])
          commit('setEmail', doc.data()['email'])
          commit('setPosition', doc.data()['position'])
          commit('setType', doc.data()['type'])
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
  addInquiry({commit}, {companyName, companyEmail, userName, email, position, type, content}) {
    firestore.collection('companyInquiries')
      .add({
        companyName: companyName,
        companyEmail: companyEmail,
        userName: userName,
        email: email,
        position: position,
        type: type,
        content: content,
        createdAt: new Date()
      })
      .then(() => {
        var sendCompanyInquiryMail = functions.httpsCallable("sendCompanyInquiryMail")
        sendCompanyInquiryMail({
          companyName: companyName,
          userName: userName,
          email: email,
          position: position,
          type: type,
          content: content
        })
      })
      .catch((error) => {
        console.error("Error", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setCompanyName', '')
    commit('setCompanyEmail', '')
    commit('setUserName', '')
    commit('setEmail', '')
    commit('setPosition', '')
    commit('setType', null)
    commit('setContent', '')
    commit('setTimestamp', null)
  },
}
