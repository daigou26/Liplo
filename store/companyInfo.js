export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  plan: null,
  isDeleted: null,
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  currentCandidates: null,
  candidatesChartData: null,
  allCandidates: null,
  feedback: null,
  members: null,
  invoiceEmail: null,
  reviews: null,
  reviewsChartData: null,
  feedbacksChartData: null,
  feedbacksChartOptions: null,
  isLoading: false,
})

export const mutations = {
  setPlan(state, plan) {
    state.plan = plan
  },
  setIsDeleted(state, isDeleted) {
    state.isDeleted = isDeleted
  },
  setCompanyId(state, companyId) {
    state.companyId = companyId
  },
  setCompanyName(state, companyName) {
    state.companyName = companyName
  },
  setCompanyImageUrl(state, companyImageUrl) {
    state.companyImageUrl = companyImageUrl
  },
  setCurrentCandidates(state, candidates) {
    state.currentCandidates = candidates
  },
  setCandidatesChartData(state, data) {
    state.candidatesChartData = data
  },
  setAllCandidates(state, candidates) {
    state.allCandidates = candidates
  },
  setFeedback(state, feedback) {
    state.feedback = feedback
  },
  setMembers(state, members) {
    state.members = members
  },
  setInvoiceEmail(state, email) {
    state.invoiceEmail = email
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setReviewsChartData(state, data) {
    state.reviewsChartData = data
  },
  setFeedbacksChartData(state, data) {
    state.feedbacksChartData = data
  },
  setFeedbacksChartOptions(state, options) {
    state.feedbacksChartOptions = options
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  }
}

export const actions = {
  // recruiter dashboard でのクエリ
  queryCompany({commit}, {nuxt, companyId}) {
    if (companyId != null && companyId != '') {
      firestore.collection('companies')
        .doc(companyId)
        .collection('info')
        .doc(companyId)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            commit('setCurrentCandidates', doc.data()['currentCandidates'])
            commit('setAllCandidates', doc.data()['allCandidates'])
            commit('setFeedback', doc.data()['feedback'])
            commit('setPlan', doc.data()['plan'])

            // chart Data
            // 候補者の数
            if (doc.data()['currentCandidates']) {
              const currentCandidates = doc.data()['currentCandidates']
              const candidatesChartData = {
                labels: [
                  'スカウト',
                  '応募',
                  '選考中',
                  'インターン',
                  'パス',
                  '入社予定',
                ],
                datasets: [
                  {
                    borderWidth: 1,
                    backgroundColor: [
                      'rgba(25, 118, 210, 0.2)',
                      'rgba(100, 181, 246, 0.2)',
                      'rgba(38, 198, 218, 0.2)',
                      'rgba(251, 140, 0, 0.2)',
                      'rgba(236, 64, 122, 0.2)',
                      'rgba(156, 39, 176, 0.2)',
                    ],
                    borderColor: [
                      'rgba(25, 118, 210, 1)',
                      'rgba(100, 181, 246, 1)',
                      'rgba(38, 198, 218, 1)',
                      'rgba(251, 140, 0, 1)',
                      'rgba(236, 64, 122, 1)',
                      'rgba(156, 39, 176, 1)',
                    ],
                    data: [
                      currentCandidates.scouted,
                      currentCandidates.inbox,
                      currentCandidates.inProcess,
                      currentCandidates.intern,
                      currentCandidates.pass,
                      currentCandidates.contracted,
                    ]
                  }
                ]
              }
              commit('setCandidatesChartData', candidatesChartData)
            }
            // 評価
            if (doc.data()['rating']) {
              const rating = doc.data()['rating']
              const reviewsChartData = {
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
                      rating.job,
                      rating.discretion,
                      rating.environment,
                      rating.workingHours,
                      rating.atmosphere
                    ]
                  }
                ]
              }
              commit('setReviewsChartData', reviewsChartData)
            }
            // フィードバック記入率
            if (doc.data()['feedback'] && doc.data()['feedback'].all != 0) {
              const feedback = doc.data()['feedback']
              const feedbackRate = Math.round(feedback.writtenCount / feedback.all * 100)
              const feedbacksChartData = {
                labels: [
                  '記入済',
                  '未記入',
                ],
                datasets: [{
                    data: [feedbackRate, (100 - feedbackRate)],
                    backgroundColor: ['#26A69A','#EFEFEF']
                }],
              }
              const feedbacksChartOptions = {
                elements: {
                  center: {
                    text: String(feedbackRate) + '%',
                    color: 'teal',
                    fontStyle: 'Helvetica',
                    sidePadding: 50
                  }
                },
                cutoutPercentage: 60,
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                  display: false
                },
              }
              commit('setFeedbacksChartData', feedbacksChartData)
              commit('setFeedbacksChartOptions', feedbacksChartOptions)
            }
            commit('updateIsLoading', false)
          } else {
            // 404
            console.log('404')
            commit('updateIsLoading', false)
            nuxt.error({ statusCode: 404, message: 'not found' })
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error)
          commit('updateIsLoading', false)
          nuxt.error({ statusCode: 404, message: 'not found' })

        })
      } else {
        console.log('404')
        commit('updateIsLoading', false)
        nuxt.error({ statusCode: 404, message: 'not found' })
      }
  },
  // admin で表示
  queryCompanyFromAdmin({commit}, companyId) {
    firestore.collection('companies')
      .doc(companyId)
      .collection('info')
      .doc(companyId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setCompanyImageUrl', doc.data()['imageUrl'])
          commit('setCompanyId', doc.id)
          commit('setCompanyName', doc.data()['companyName'])
          commit('setPlan', doc.data()['plan'])
          commit('setInvoiceEmail', doc.data()['invoiceEmail'])
          commit('setIsDeleted', doc.data()['isDeleted'])
        }
        commit('updateIsLoading', false)
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  // admin から編集
  updatePlan({commit}, plan) {
    commit('setPlan', plan)
  },
  // 企業設定画面
  queryCompanyInfo({commit}, companyId) {
    firestore.collection('companies')
      .doc(companyId)
      .collection('info')
      .doc(companyId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setCompanyName', doc.data()['companyName'])
          commit('setPlan', doc.data()['plan'])
          commit('setInvoiceEmail', doc.data()['invoiceEmail'])
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
      })
  },
  updateCompanyInvoiceEmail({commit}, {companyId, companyName, email}) {
    firestore.collection('companies')
      .doc(companyId)
      .collection('info')
      .doc(companyId)
      .update({
        invoiceEmail: email
      })
      .then(() => {
        commit('setInvoiceEmail', email)
        var sendChangeInvoiceEmailConfirmation = functions.httpsCallable("sendChangeInvoiceEmailConfirmation")
        sendChangeInvoiceEmailConfirmation({
          companyName: companyName,
          newEmail: email
        })
      })
      .catch((error) => {
        console.log("Error updating document:", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setIsDeleted', null)
    commit('setPlan', null)
    commit('setCurrentCandidates', null)
    commit('setCandidatesChartData', null)
    commit('setAllCandidates', null)
    commit('setFeedback', null)
    commit('setCompanyId', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
    commit('setMembers', null)
    commit('setInvoiceEmail', null)
    commit('setReviews', null)
    commit('setReviewsChartData', null)
    commit('setFeedbacksChartData', null)
    commit('setFeedbacksChartOptions', null)
    commit('updateIsLoading', false)
  }
}
