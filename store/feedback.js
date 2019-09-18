export const strict = false
import { firestore } from '@/plugins/firebase'
import { event } from 'vue-analytics'
import SimpleCrypto from "simple-crypto-js"

export const state = () => ({
  uid: null,
  profileImageUrl: null,
  userName: null,
  occupation: '',
  companyId: null,
  companyImageUrl: null,
  companyName: null,
  goodPoint: '',
  advice: '',
  createdAt: null,
  timestamp: null,
  isLoading: false,
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
  setOccupation(state, occupation) {
    state.occupation = occupation
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
  setGoodPoint(state, goodPoint) {
    state.goodPoint = goodPoint
  },
  setAdvice(state, advice) {
    state.advice = advice
  },
  setCreatedAt(state, createdAt) {
    state.createdAt = createdAt
  },
  setTimestamp(state, timestamp) {
    state.timestamp = timestamp
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  queryFeedback({commit}, {nuxt, params, uid, companyId}) {
    const feedbackId = params.id

    firestore.collection('feedbacks')
      .doc(feedbackId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setUid', doc.data()['uid'])
          commit('setProfileImageUrl', doc.data()['profileImageUrl'])
          commit('setUserName', doc.data()['userName'])
          commit('setOccupation', doc.data()['occupation'])
          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setCompanyName', doc.data()['companyName'])
          commit('setCreatedAt', doc.data()['createdAt'])

          // decrypt
          if (doc.data()['goodPoint']) {
            var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
            commit('setGoodPoint', simpleCrypto.decrypt(doc.data()['goodPoint']))
          }
          if (doc.data()['advice']) {
            var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)
            commit('setAdvice', simpleCrypto.decrypt(doc.data()['advice']))
          }

          var timestamp = doc.data()['createdAt']
          if (timestamp) {
            let date = new Date( timestamp.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            timestamp = `${year}/${month}/${day}`
          }
          commit('setTimestamp', timestamp)
          commit('updateIsLoading', false)

          // feedbackをもらったユーザーかどうか
          if (uid) {
            if (uid != doc.data()['uid']) {
              console.log('404')
              nuxt.error({ statusCode: 404, message: 'not found' })
            }
          }
          // feedbackを書いた企業かどうか
          if (companyId) {
            if (companyId != doc.data()['companyId']) {
              console.log('404')
              nuxt.error({ statusCode: 404, message: 'not found' })
            }
          }
        } else {
          // 404
          console.log('404')
          commit('updateIsLoading', false)
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
        nuxt.error({ statusCode: 404, message: 'not found' })
      })
  },
  sendFeedback({commit, state, dispatch}, {router, params, goodPoint, advice}) {
    const feedbackId = params.id

    // encrypt
    var simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)

    var feedbackData = {
      createdAt: new Date(),
      isWritten: true
    }

    if (goodPoint) {
      feedbackData.goodPoint = simpleCrypto.encrypt(goodPoint)
    }
    if (advice) {
      feedbackData.advice = simpleCrypto.encrypt(advice)
    }

    firestore.collection('feedbacks')
      .doc(feedbackId)
      .update(feedbackData)
      .then(() => {
        dispatch('feedbacks/resetState', {}, { root: true })
        router.replace({path: '/recruiter/feedbacks'})
        // analytics
        event('user', 'feedback')
      })
      .catch((error) => {
        console.error("Error updating document", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setUid', null)
    commit('setProfileImageUrl', null)
    commit('setUserName', null)
    commit('setOccupation', '')
    commit('setCompanyId', null)
    commit('setCompanyImageUrl', null)
    commit('setCompanyName', null)
    commit('setGoodPoint', '')
    commit('setAdvice', '')
    commit('setCreatedAt', null)
    commit('updateIsLoading', false)
  },
}
