export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  plan: null,
  imageUrl: '',
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  currentCandidates: null,
  candidatesChartData: null,
  allCandidates: null,
  feedback: null,
  email: '',
  members: null,
  location: '',
  foundedDate: '',
  url: '',
  employeesCount: null,
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
  reviews: null,
  reviewsChartData: null,
  feedbacksChartData: null,
  feedbacksChartOptions: null,
  invoiceEmail: null,
  jobs: [],
  isLoading: false,
})

export const mutations = {
  setPlan(state, plan) {
    state.plan = plan
  },
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
  setEmployeesCount(state, employeesCount) {
    state.employeesCount = employeesCount
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
  setReviewsChartData(state, data) {
    state.reviewsChartData = data
  },
  setFeedbacksChartData(state, data) {
    state.feedbacksChartData = data
  },
  setFeedbacksChartOptions(state, options) {
    state.feedbacksChartOptions = options
  },
  setInvoiceEmail(state, email) {
    state.invoiceEmail = email
  },
  addJob(state, job) {
    state.jobs.push(job)
  },
  resetJobs(state) {
    state.jobs = []
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
        .get()
        .then(function(doc) {
          if (doc.exists) {
            commit('setCurrentCandidates', doc.data()['currentCandidates'])
            commit('setAllCandidates', doc.data()['allCandidates'])
            commit('setFeedback', doc.data()['feedback'])

            // chart Data
            // 候補者の数
            if (doc.data()['currentCandidates']) {
              const currentCandidates = doc.data()['currentCandidates']
              const candidatesChartData = {
                labels: [
                  '応募',
                  '選考中',
                  'インターン',
                  '内定パス',
                  '入社予定',
                  '入社',
                ],
                datasets: [
                  {
                    borderWidth: 1,
                    backgroundColor: [
                      'rgba(25, 118, 210, 0.2)',
                      'rgba(38, 198, 218, 0.2)',
                      'rgba(251, 140, 0, 0.2)',
                      'rgba(38, 166, 154, 0.2)',
                      'rgba(102, 187, 106, 0.2)',
                      'rgba(236, 64, 122, 0.2)',
                    ],
                    borderColor: [
                      'rgba(25, 118, 210, 1)',
                      'rgba(38, 198, 218, 1)',
                      'rgba(251, 140, 0, 1)',
                      'rgba(38, 166, 154, 1)',
                      'rgba(102, 187, 106, 1)',
                      'rgba(236, 64, 122, 1)',
                    ],
                    data: [
                      currentCandidates.inbox,
                      currentCandidates.inProcess,
                      currentCandidates.intern,
                      currentCandidates.pass,
                      currentCandidates.contracted,
                      currentCandidates.hired,
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
                    backgroundColor: ['#26A69A','#EEEEEE']
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
            commit('setEmployeesCount', doc.data()['employeesCount'])
            commit('setMission', doc.data()['mission'] ? doc.data()['mission'] : null)
            commit('setVision', doc.data()['vision'] ? doc.data()['vision'] : null)
            commit('setValue', doc.data()['value'] ? doc.data()['value'] : null)
            commit('setCulture', doc.data()['culture'] ? doc.data()['culture'] : null)
            commit('setSystem', doc.data()['system'] ? doc.data()['system'] : null)
            commit('setWhy', doc.data()['why'])
            commit('setWhat', doc.data()['what'])
            commit('setServices', doc.data()['services'])
            commit('setWelfare', doc.data()['welfare'])
            commit('setReviews', doc.data()['reviews'])

            if (!doc.data()['isDeleted']) {
              // chart Data
              if (doc.data()['reviews']) {
                const reviews = doc.data()['reviews']
                const reviewsChartData = {
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
                commit('setReviewsChartData', reviewsChartData)
              }

              // 募集をクエリ
              firestore.collection('jobs')
                .where('companyId', '==', companyId)
                .orderBy('createdAt', 'desc')
                .limit(6)
                .get()
                .then(function(snapshot) {
                  snapshot.forEach(function(doc) {
                    let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
                    let currentDate = new Date()

                    var timestamp = Math.floor((currentDate - createdAt) / 3600000)
                    if (timestamp < 24) {
                      if (timestamp <= 1) {
                        timestamp = '1時間以内'
                      } else {
                        timestamp = String(timestamp) + '時間前'
                      }
                    } else {
                      timestamp = Math.floor((currentDate - createdAt) / 86400000)
                      if (timestamp < 31) {
                        timestamp = String(timestamp) + '日前'
                      } else {
                        timestamp = Math.floor((currentDate - createdAt) / (86400000 * 31))
                        if (timestamp <= 11) {
                          timestamp = String(timestamp) + 'ヶ月前'
                        } else {
                          timestamp = '1年以上前'
                        }
                      }
                    }

                    const job = {
                      jobId: doc.id,
                      title: doc.data()['title'],
                      content: doc.data()['content'],
                      imageUrl: doc.data()['imageUrl'],
                      companyId: doc.data()['companyId'],
                      companyName: doc.data()['companyName'],
                      companyImageUrl: doc.data()['companyImageUrl'],
                      occupation: doc.data()['occupation'],
                      period: doc.data()['period'],
                      workday: doc.data()['workday'],
                      createdAt: doc.data()['createdAt'],
                      timestamp: timestamp
                    }
                    commit('addJob', job)
                  })
                  commit('updateIsLoading', false)
                })
                .catch(function(error) {
                  console.log("Error getting document:", error)
                  commit('updateIsLoading', false)
                })
            } else {
              // 削除済みの場合
              // 404
              console.log('404')
              commit('updateIsLoading', false)
              nuxt.error({ statusCode: 404, message: 'not found' })
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
      } else {
        console.log('404')
        commit('updateIsLoading', false)
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
      feedback: {
        all: 0,
        writtenCount: 0
      },
      createdAt: new Date(),
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
  queryCompanyInfo({commit}, companyId) {
    firestore.collection('companies')
      .doc(companyId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setPlan', doc.data()['plan'])
          commit('setInvoiceEmail', doc.data()['invoiceEmail'])
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
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
  },
  resetState({commit}) {
    commit('setPlan', null)
    commit('setCurrentCandidates', null)
    commit('setCandidatesChartData', null)
    commit('setAllCandidates', null)
    commit('setFeedback', null)
    commit('setImageUrl', '')
    commit('setCompanyId', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
    commit('setEmail', '')
    commit('setMembers', null)
    commit('setLocation', '')
    commit('setFoundedDate', '')
    commit('setUrl', '')
    commit('setEmployeesCount', null)
    commit('setMission', null)
    commit('setVision', null)
    commit('setValue', null)
    commit('setCulture', null)
    commit('setSystem', null)
    commit('setWhy', '')
    commit('setWhat', '')
    commit('setServices', null)
    commit('setWelfare', null)
    commit('setReviews', null)
    commit('setFeedbacksChartData', null)
    commit('setFeedbacksChartOptions', null)
    commit('setReviewsChartData', null)
    commit('setInvoiceEmail', null)
    commit('resetJobs')
    commit('updateIsLoading', false)
  }
}
