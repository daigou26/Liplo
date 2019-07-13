export const strict = false
import { firestore } from '@/plugins/firebase'
import { event } from 'vue-analytics'

export const state = () => ({
  companyId: null,
  companyImageUrl: null,
  companyName: null,
  content: '',
  all: null,
  atmosphere: null,
  job: null,
  discretion: null,
  workingHours: null,
  environment: null,
  chartData: null,
  isLoading: false,
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
  setWorkingHours(state, workingHours) {
    state.workingHours = workingHours
  },
  setEnvironment(state, environment) {
    state.environment = environment
  },
  setChartData(state, data) {
    state.chartData = data
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  postReview({commit}, {router, careerId, review}) {
    const batch = firestore.batch()
    const careerRef = firestore.collection('users')
      .doc(review.uid).collection('career').doc(careerId)
    batch.update(careerRef, {
      isReviewWritten: true
    })
    const reviewRef = firestore.collection('reviews').doc()
    batch.set(reviewRef, review)
    batch.commit()
      .then(() => {
        // analytics
        event({
          eventCategory: 'user',
          eventAction: 'review',
          eventValue: Number(review.all)
        })
      })
      .catch((error) => {
        console.error("Error", error)
      })
  },
  queryReview({commit}, {nuxt, params, companyId, uid}) {
    const reviewId = params.id

    firestore.collection('reviews')
      .doc(reviewId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          if (companyId != doc.data()['companyId'] && uid != doc.data()['uid']) {
            console.log('404')
            commit('updateIsLoading', false)
            nuxt.error({ statusCode: 404, message: 'not found' })
          }

          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setCompanyName', doc.data()['companyName'])
          commit('setContent', doc.data()['content'])
          commit('setAll', doc.data()['all'])
          commit('setAtmosphere', doc.data()['atmosphere'])
          commit('setJob', doc.data()['job'])
          commit('setDiscretion', doc.data()['discretion'])
          commit('setWorkingHours', doc.data()['workingHours'])
          commit('setEnvironment', doc.data()['environment'])

          // chart Data
          const chartData = {
            labels: [
              '仕事内容',
              '裁量度',
              '労働環境',
              '労働時間',
              '雰囲気',
            ],
            datasets: [
              {
                borderColor: 'rgba(255, 90, 95, 1)',
                backgroundColor: 'rgba(255, 90, 95, 0.2)',
                borderWidth: 2,
                data: [
                  doc.data()['job'],
                  doc.data()['discretion'],
                  doc.data()['environment'],
                  doc.data()['workingHours'],
                  doc.data()['atmosphere']
                ]
              }
            ]
          }
          commit('setChartData', chartData)
          commit('updateIsLoading', false)
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
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setCompanyId', null)
    commit('setCompanyImageUrl', null)
    commit('setCompanyName', null)
    commit('setContent', '')
    commit('setAll', null)
    commit('setAtmosphere', null)
    commit('setJob', null)
    commit('setDiscretion', null)
    commit('setWorkingHours', null)
    commit('setEnvironment', null)
    commit('setChartData', null)
    commit('updateIsLoading', false)
  },
}
