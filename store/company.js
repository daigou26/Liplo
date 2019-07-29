export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  isDeleted: null,
  topImageUrl: '',
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  feedback: null,
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
  jobs: [],
  isLoading: false,
})

export const mutations = {
  setIsDeleted(state, isDeleted) {
    state.isDeleted = isDeleted
  },
  setTopImageUrl(state, topImageUrl) {
    state.topImageUrl = topImageUrl
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
  setFeedback(state, feedback) {
    state.feedback = feedback
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

            commit('setTopImageUrl', doc.data()['topImageUrl'])
            commit('setCompanyId', doc.id)
            commit('setCompanyName', doc.data()['companyName'])
            commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
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
                        reviews.rating.job,
                        reviews.rating.discretion,
                        reviews.rating.environment,
                        reviews.rating.workingHours,
                        reviews.rating.atmosphere
                      ]
                    }
                  ]
                }
                commit('setReviewsChartData', reviewsChartData)
              }

              // 募集をクエリ
              firestore.collection('jobs')
                .where('status', '==', 'published')
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
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setIsDeleted', null)
    commit('setFeedback', null)
    commit('setTopImageUrl', '')
    commit('setCompanyId', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
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
    commit('setReviewsChartData', null)
    commit('resetJobs')
    commit('updateIsLoading', false)
  }
}
