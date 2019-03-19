export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  uid: null,
  profileImageUrl: null,
  userName: null,
  companyId: null,
  companyImageUrl: null,
  companyName: null,
})

export const mutations = {
  setUid(state, uid) {
    state.uid = uid
  },
  setProfileImageUrl(state, profileImageUrl) {
    state.profileImageUrl = profileImageUrl
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  setCompanyId(state, companyId) {
    state.companyId = companyId
  },
  setCompanyImageUrl(state, companyImageUrl) {
    state.companyImageUrl = companyImageUrl
  },
  setCompanyName(state, companyName) {
    state.companyName = companyName
  },
}

export const actions = {
  queryChat({commit}, {nuxt, params}) {
    const chatId = params.id

    return firestore.collection('chats')
      .doc(chatId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setUid', doc.data()['uid'])
          commit('setProfileImageUrl', doc.data()['profileImageUrl'])
          commit('setUserName', doc.data()['userName'])
          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setCompanyName', doc.data()['companyName'])
        } else {
          // 404
          console.log('404')
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
        nuxt.error({ statusCode: 404, message: 'not found' })
      })
  },
}
