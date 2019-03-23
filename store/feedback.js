export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  companyId: null,
  companyImageUrl: null,
  companyName: null,
  goodPoint: '',
  advice: '',
  createdAt: null,
})

export const mutations = {
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
}

export const actions = {
  queryFeedback({commit}, {nuxt, params}) {
    const feedbackId = params.id

    return firestore.collection('feedbacks')
      .doc(feedbackId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setCompanyName', doc.data()['companyName'])
          commit('setGoodPoint', doc.data()['goodPoint'])
          commit('setAdvice', doc.data()['advice'])
          commit('setCreatedAt', doc.data()['createdAt'])
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
