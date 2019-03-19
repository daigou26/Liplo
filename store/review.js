export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  companyId: null,
  companyImageUrl: null,
  companyName: null,
  content: '',
  all: null,
  atmosphere: null,
  job: null,
  discretion: null,
  flexibleSchedule: null,
  flexibility: null,
  mentor: null,
  growth: null,
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
  setContent(state, content) {
    state.content = content
  },
  setAll(state, all) {
    state.all = all
  },
  setAtmosphere(state, atmosphere) {
    state.atmosphere = atmosphere
  },
  setJob(state, job) {
    state.job = job
  },
  setDiscretion(state, discretion) {
    state.discretion = discretion
  },
  setFlexibleSchedule(state, flexibleSchedule) {
    state.flexibleSchedule = flexibleSchedule
  },
  setFlexibility(state, flexibility) {
    state.flexibility = flexibility
  },
  setMentor(state, mentor) {
    state.mentor = mentor
  },
  setGrowth(state, growth) {
    state.growth = growth
  },
}

export const actions = {
  queryUserReview({commit}, {nuxt, params}) {
    const reviewId = params.id

    return firestore.collection('reviews')
      .doc(reviewId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setCompanyName', doc.data()['companyName'])
          commit('setContent', doc.data()['content'])
          commit('setAll', doc.data()['all'])
          commit('setAtmosphere', doc.data()['atmosphere'])
          commit('setJob', doc.data()['job'])
          commit('setDiscretion', doc.data()['discretion'])
          commit('setFlexibleSchedule', doc.data()['flexibleSchedule'])
          commit('setFlexibility', doc.data()['flexibility'])
          commit('setMentor', doc.data()['mentor'])
          commit('setGrowth', doc.data()['growth'])
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
