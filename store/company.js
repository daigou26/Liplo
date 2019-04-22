export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  imageUrl: '',
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  rating: null,
  currentCandidates: null,
  allCandidates: null,
  feedback: null,
  email: '',
  members: null,
  location: '',
  foundedDate: '',
  url: '',
  mission: null,
  vision: null,
  value: null,
  culture: null,
  system: null,
  why: '',
  what: '',
  services: null,
  welfare: null,
  workday: 0,
  occupation: '',
  features: '',
  field: '',
  reviews: null,
  reviewChartData: null,
  feedbackChartData: null,
  feedbackChartOptions: null,
  invoiceEmail: null,
  isLoading: false,
})

export const mutations = {
  setImageUrl(state, imageUrl) {
    state.imageUrl = imageUrl
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
  setRating(state, rating) {
    state.rating = rating
  },
  setCurrentCandidates(state, candidates) {
    state.currentCandidates = candidates
  },
  setAllCandidates(state, candidates) {
    state.allCandidates = candidates
  },
  setFeedback(state, feedback) {
    state.feedback = feedback
  },
  setEmail(state, email) {
    state.email = email
  },
  setMembers(state, members) {
    state.members = members
  },
  setLocation(state, location) {
    state.location = location
  },
  setFoundedDate(state, foundedDate) {
    state.foundedDate = foundedDate
  },
  setUrl(state, url) {
    state.url = url
  },
  setMission(state, mission) {
    state.mission = mission
  },
  setVision(state, vision) {
    state.vision = vision
  },
  setValue(state, value) {
    state.value = value
  },
  setCulture(state, culture) {
    state.culture = culture
  },
  setSystem(state, system) {
    state.system = system
  },
  setWhy(state, why) {
    state.why = why
  },
  setWhat(state, what) {
    state.what = what
  },
  setServices(state, services) {
    state.services = services
  },
  setWelfare(state, welfare) {
    state.welfare = welfare
  },
  setWorkday(state, workday) {
    state.workday = workday
  },
  setOccupation(state, occupation) {
    state.occupation = occupation
  },
  setFeatures(state, features) {
    state.features = features
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setReviewChartData(state, data) {
    state.reviewChartData = data
  },
  setFeedbackChartData(state, data) {
    state.feedbackChartData = data
  },
  setFeedbackChartOptions(state, options) {
    state.feedbackChartOptions = options
  },
  setInvoiceEmail(state, email) {
    state.invoiceEmail = email
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  }
}

export const actions = {
  // recruiter dashboard でのクエリ
  queryCompany({commit}, {nuxt, companyId}) {
    if (companyId != null && companyId != '') {
      firestore.collection('companies').doc(companyId)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            commit('setRating', doc.data()['rating'])
            commit('setCurrentCandidates', doc.data()['currentCandidates'])
            commit('setAllCandidates', doc.data()['allCandidates'])
            commit('setFeedback', doc.data()['feedback'])

            // chart Data
            if (doc.data()['rating']) {
              const rating = doc.data()['rating']
              const reviewChartData = {
                labels: [
                  '成長できるか',
                  '仕事内容',
                  '裁量度',
                  '勤務中の自由度',
                  '出勤時間の柔軟性',
                  'メンター',
                  '雰囲気',
                ],
                datasets: [
                  {
                    borderColor: '#f87979',
                    backgroundColor: 'rgba(248, 121, 121, 0.1)',
                    data: [
                      rating.growth,
                      rating.job,
                      rating.discretion,
                      rating.flexibility,
                      rating.flexibleSchedule,
                      rating.mentor,
                      rating.atmosphere
                    ]
                  }
                ]
              }
              commit('setReviewChartData', reviewChartData)
            }

            if (doc.data()['feedback']) {
              const feedback = doc.data()['feedback']
              const feedbackRate = Math.round(feedback.writtenCount / feedback.all * 100)
              const feedbackChartData = {
                labels: [
                  '記入済',
                  '未記入',
                ],
                datasets: [{
                    data: [feedbackRate, (100 - feedbackRate)],
                    backgroundColor: ['teal','burlywood']
                }],
              }
              const feedbackChartOptions = {
                elements: {
                  center: {
                    text: String(feedbackRate) + '%',
                    color: '#36A2EB',
                    fontStyle: 'Helvetica',
                    sidePadding: 50
                  }
                },
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                  display: false
                },
              }
              commit('setFeedbackChartData', feedbackChartData)
              commit('setFeedbackChartOptions', feedbackChartOptions)

            }
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
      } else {
        console.log('404')
        nuxt.error({ statusCode: 404, message: 'not found' })
      }
  },
  queryCompanyDetail({commit}, {nuxt, params}) {
    const companyId = params.id

    if (companyId != null && companyId != '') {
      firestore.collection('companies').doc(companyId)
        .collection('detail')
        .doc(companyId)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            let foundedDate = doc.data()['foundedDate']
            if (foundedDate) {
              let date = new Date( foundedDate.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              foundedDate = `${year}/${month}/${day}`
            }

            commit('setImageUrl', doc.data()['imageUrl'])
            commit('setCompanyId', doc.id)
            commit('setCompanyName', doc.data()['companyName'])
            commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
            commit('setEmail', doc.data()['email'])
            commit('setMembers', doc.data()['members'])
            commit('setLocation', doc.data()['location'])
            commit('setFoundedDate', foundedDate)
            commit('setUrl', doc.data()['url'])
            commit('setMission', doc.data()['mission'] ? doc.data()['mission'] : null)
            commit('setVision', doc.data()['vision'] ? doc.data()['vision'] : null)
            commit('setValue', doc.data()['value'] ? doc.data()['value'] : null)
            commit('setCulture', doc.data()['culture'] ? doc.data()['culture'] : null)
            commit('setSystem', doc.data()['system'] ? doc.data()['system'] : null)
            commit('setWhy', doc.data()['why'])
            commit('setWhat', doc.data()['what'])
            commit('setServices', doc.data()['services'])
            commit('setWelfare', doc.data()['welfare'])
            commit('setWorkday', doc.data()['workday'])
            commit('setReviews', doc.data()['reviews'])
            // commit('setOccupation', doc.data()['occupation'])
            // commit('setFeatures', doc.data()['features'])

            if (!doc.data()['isDeleted']) {
              // chart Data
              if (doc.data()['reviews']) {
                const reviews = doc.data()['reviews']
                const reviewChartData = {
                  labels: [
                    '成長できるか',
                    '仕事内容',
                    '裁量度',
                    '勤務中の自由度',
                    '出勤時間の柔軟性',
                    'メンター',
                    '雰囲気',
                  ],
                  datasets: [
                    {
                      borderColor: '#f87979',
                      backgroundColor: 'rgba(248, 121, 121, 0.1)',
                      data: [
                        reviews.rating.growth,
                        reviews.rating.job,
                        reviews.rating.discretion,
                        reviews.rating.flexibility,
                        reviews.rating.flexibleSchedule,
                        reviews.rating.mentor,
                        reviews.rating.atmosphere
                      ]
                    }
                  ]
                }
                commit('setReviewChartData', reviewChartData)
              }
            } else {
              // 削除済みの場合
              // 404
              console.log('404')
              nuxt.error({ statusCode: 404, message: 'not found' })
            }
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
      } else {
        console.log('404')
        nuxt.error({ statusCode: 404, message: 'not found' })
      }
  },
  addCompany({commit}, {companyName, companyEmail, userName, email, position, inquiry}) {
    const companyId = firestore.collection('companies').doc().id
    const member = {
      name: userName,
      position: position,
      email: email,
      isInitialMember: true,
    }
    const companyData = {
      companyName: companyName,
      email: companyEmail,
      invoiceEmail: companyEmail,
      members: [member],
      isDeleted: false,
      points: 100,
    }
    const batch = firestore.batch()
    const companyRef = firestore.collection('companies').doc(companyId)
    batch.set(companyRef, companyData)

    const companyDetailRef = firestore.collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
    batch.set(companyDetailRef, companyData)

    batch.commit()
      .catch((error) => {
        console.error("Error adding document: ", error)
      })

    var sendAddCompanyMail = functions.httpsCallable("sendAddCompanyMail")
    sendAddCompanyMail({
      companyId: companyId,
      companyName: companyName,
      userName: userName,
      email: email,
      inquiry: inquiry
    }).then(function(result) {
      console.log('sendAddCompanyMail completed.');
    })
  },
  queryCompanyInvoiceEmail({commit}, companyId) {
    firestore.collection('companies')
      .doc(companyId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setInvoiceEmail', doc.data()['invoiceEmail'])
        }
        commit('updateIsLoading', false)
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
        commit('updateIsLoading', false)
      })
  },
  updateCompanyInvoiceEmail({commit}, {companyId, email}) {
    firestore.collection('companies')
      .doc(companyId)
      .update({
        invoiceEmail: email
      })
      .then(() => {
        commit('setInvoiceEmail', email)
      })
      .catch((error) => {
        console.log("Error getting document:", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  }
}
