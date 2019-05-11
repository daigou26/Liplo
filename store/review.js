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
      .catch((error) => {
        console.error("Error adding document: ", error)
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
          commit('setFlexibleSchedule', doc.data()['flexibleSchedule'])
          commit('setFlexibility', doc.data()['flexibility'])
          commit('setMentor', doc.data()['mentor'])
          commit('setGrowth', doc.data()['growth'])

          // chart Data
          const chartData = {
            labels: [
              '成長できるか',
              '仕事内容',
              '裁量度',
              '勤務中の自由度',
              '勤務時間の柔軟性',
              'メンター',
              '雰囲気',
            ],
            datasets: [
              {
                borderColor: '#f87979',
                backgroundColor: 'rgba(248, 121, 121, 0.1)',
                data: [
                  doc.data()['growth'],
                  doc.data()['job'],
                  doc.data()['discretion'],
                  doc.data()['flexibility'],
                  doc.data()['flexibleSchedule'],
                  doc.data()['mentor'],
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
    commit('setFlexibleSchedule', null)
    commit('setFlexibility', null)
    commit('setMentor', null)
    commit('setGrowth', null)
    commit('setChartData', null)
    commit('updateIsLoading', false)
  },
}
