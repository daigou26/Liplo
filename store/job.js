export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'
import { event } from 'vue-analytics'

export const state = () => ({
  imageUrl: '',
  title: '',
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  mission: null,
  vision: null,
  value: null,
  culture: null,
  system: null,
  why: '',
  what: '',
  services: null,
  description: '',
  wage: '',
  requiredSkills: '',
  idealSkills: '',
  environment: null,
  welfare: null,
  workweek: null,
  period: null,
  workday: 0,
  worktime: null,
  idealCandidate: '',
  occupation: null,
  features: null,
  nearestStation: '',
  field: '',
  createdAt: '',
  url :'',
  location: '',
  foundedDate: '',
  employeesCount: null,
  newGrad: null,
  newGradResignee: null,
  averageYearsOfService: null,
  averageAge: null,
  training: null,
  selfDevSupport: null,
  mentor: null,
  careerSupport: null,
  testSystem: null,
  overtimeWork: null,
  paidHolidays: null,
  childcareLeave: null,
  femaleExecutives: null,
  feedback: null,
  reviews: null,
  reviewsChartData: null,
  isCandidate: false,
  isLoading: false,
})

export const mutations = {
  setImageUrl(state, imageUrl) {
    state.imageUrl = imageUrl
  },
  setTitle(state, title) {
    state.title = title
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
  setRating(state, rating) {
    state.rating = rating
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
  setDescription(state, description) {
    state.description = description
  },
  setWage(state, wage) {
    state.wage = wage
  },
  setRequiredSkills(state, requiredSkills) {
    state.requiredSkills = requiredSkills
  },
  setIdealSkills(state, idealSkills) {
    state.idealSkills = idealSkills
  },
  setEnvironment(state, environment) {
    state.environment = environment
  },
  setWelfare(state, welfare) {
    state.welfare = welfare
  },
  setWorkweek(state, workweek) {
    state.workweek = workweek
  },
  setPeriod(state, period) {
    state.period = period
  },
  setWorkday(state, workday) {
    state.workday = workday
  },
  setWorktime(state, worktime) {
    state.worktime = worktime
  },
  setIdealCandidate(state, idealCandidate) {
    state.idealCandidate = idealCandidate
  },
  setOccupation(state, occupation) {
    state.occupation = occupation
  },
  setFeatures(state, features) {
    state.features = features
  },
  setNearestStation(state, nearestStation) {
    state.nearestStation = nearestStation
  },
  setCreatedAt(state, createdAt) {
    state.createdAt = createdAt
  },
  setUrl(state, url) {
    state.url = url
  },
  setLocation(state, location) {
    state.location = location
  },
  setFoundedDate(state, foundedDate) {
    state.foundedDate = foundedDate
  },
  setEmployeesCount(state, employeesCount) {
    state.employeesCount = employeesCount
  },
  setNewGrad(state, newGrad) {
    state.newGrad = newGrad
  },
  setNewGradResignee(state, newGradResignee) {
    state.newGradResignee = newGradResignee
  },
  setAverageYearsOfService(state, averageYearsOfService) {
    state.averageYearsOfService = averageYearsOfService
  },
  setAverageAge(state, averageAge) {
    state.averageAge = averageAge
  },
  setTraining(state, training) {
    state.training = training
  },
  setSelfDevSupport(state, selfDevSupport) {
    state.selfDevSupport = selfDevSupport
  },
  setMentor(state, mentor) {
    state.mentor = mentor
  },
  setCareerSupport(state, careerSupport) {
    state.careerSupport = careerSupport
  },
  setTestSystem(state, testSystem) {
    state.testSystem = testSystem
  },
  setOvertimeWork(state, overtimeWork) {
    state.overtimeWork = overtimeWork
  },
  setPaidHolidays(state, paidHolidays) {
    state.paidHolidays = paidHolidays
  },
  setChildcareLeave(state, childcareLeave) {
    state.childcareLeave = childcareLeave
  },
  setFemaleExecutives(state, femaleExecutives) {
    state.femaleExecutives = femaleExecutives
  },
  setFeedback(state, feedback) {
    state.feedback = feedback
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setReviewsChartData(state, data) {
    state.reviewsChartData = data
  },
  updateIsCandidate(state, isCandidate) {
    state.isCandidate = isCandidate
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  queryJobDetail({commit}, {nuxt, params, uid}) {
    const jobId = params.id
    if (jobId != null && jobId != '') {
      firestore.collection('jobs').doc(jobId).collection('detail').doc(jobId).get()
        .then(function(doc) {
          if (doc.exists) {
            var isCompanyDetailQueried = false
            var isCandidateQueried = false
            const companyId = doc.data()['companyId']

            // 投稿日
            var createdAt = doc.data()['createdAt']
            if (createdAt) {
              let date = new Date( createdAt.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              createdAt = `${year}/${month}/${day}`
            }
            commit('setCreatedAt', createdAt)

            // 設立日
            var foundedDate = doc.data()['foundedDate']
            if (foundedDate) {
              let date = new Date( foundedDate.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              foundedDate = `${year}/${month}/${day}`
            }
            commit('setFoundedDate', foundedDate)

            // feedback記入率
            var feedback = doc.data()['feedback']
            commit('setFeedback', Math.round(feedback.writtenCount / feedback.all * 100))

            commit('setImageUrl', doc.data()['imageUrl'])
            commit('setTitle', doc.data()['title'])
            commit('setCompanyId', companyId)
            commit('setCompanyName', doc.data()['companyName'])
            commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
            commit('setMission', doc.data()['mission'] ? doc.data()['mission'] : null)
            commit('setVision', doc.data()['vision'] ? doc.data()['vision'] : null)
            commit('setValue', doc.data()['value'] ? doc.data()['value'] : null)
            commit('setCulture', doc.data()['culture'] ? doc.data()['culture'] : null)
            commit('setSystem', doc.data()['system'] ? doc.data()['system'] : null)
            commit('setWhy', doc.data()['why'])
            commit('setWhat', doc.data()['what'])
            commit('setServices', doc.data()['services'])
            commit('setDescription', doc.data()['description'])
            commit('setWage', doc.data()['wage'])
            commit('setRequiredSkills', doc.data()['requiredSkills'])
            commit('setIdealSkills', doc.data()['idealSkills'])
            commit('setEnvironment', doc.data()['environment'])
            commit('setWelfare', doc.data()['welfare'])
            commit('setWorkweek', doc.data()['workweek'])
            commit('setPeriod', doc.data()['period'])
            commit('setWorkday', doc.data()['workday'])
            commit('setWorktime', doc.data()['worktime'])
            commit('setIdealCandidate', doc.data()['idealCandidate'])
            commit('setOccupation', doc.data()['occupation'])
            commit('setFeatures', doc.data()['features'])
            commit('setNearestStation', doc.data()['nearestStation'])
            commit('setUrl', doc.data()['url'])
            commit('setLocation', doc.data()['location'])
            commit('setEmployeesCount', doc.data()['employeesCount'])

            // 雇用情報
            if (doc.data()['employmentInfo']) {
              commit('setNewGrad', doc.data()['employmentInfo'].newGrad)
              commit('setNewGradResignee', doc.data()['employmentInfo'].newGradResignee)
              commit('setAverageYearsOfService', doc.data()['employmentInfo'].averageYearsOfService)
              commit('setAverageAge', doc.data()['employmentInfo'].averageAge)
              commit('setTraining', doc.data()['employmentInfo'].training)
              commit('setSelfDevSupport', doc.data()['employmentInfo'].selfDevSupport)
              commit('setMentor', doc.data()['employmentInfo'].mentor)
              commit('setCareerSupport', doc.data()['employmentInfo'].careerSupport)
              commit('setTestSystem', doc.data()['employmentInfo'].testSystem)
              commit('setOvertimeWork', doc.data()['employmentInfo'].overtimeWork)
              commit('setPaidHolidays', doc.data()['employmentInfo'].paidHolidays)
              commit('setChildcareLeave', doc.data()['employmentInfo'].childcareLeave)
              commit('setFemaleExecutives', doc.data()['employmentInfo'].femaleExecutives)
            }

            if (doc.data()['status'] == 'published') {
              if (uid != '' && uid != null) {
                // レビュー情報取得
                firestore.collection('companies')
                  .doc(companyId)
                  .collection('detail')
                  .doc(companyId)
                  .get()
                  .then(function(companyDoc) {
                    if (companyDoc.exists) {
                      commit('setReviews', companyDoc.data()['reviews'])
                      // chart Data
                      const reviews = companyDoc.data()['reviews']
                      if (reviews) {
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

                      isCompanyDetailQueried = true
                      if (uid) {
                        if (isCandidateQueried && isCompanyDetailQueried) {
                          commit('updateIsLoading', false)
                        }
                      } else {
                        commit('updateIsLoading', false)
                      }
                    }
                  })
                  .catch(function(error) {
                    console.log("Error getting document:", error)
                    isCompanyDetailQueried = true
                    if (isCandidateQueried && isCompanyDetailQueried) {
                      commit('updateIsLoading', false)
                    }
                  })
                // すでに候補者になっているか
                firestore.collection('companies')
                  .doc(companyId)
                  .collection('candidates')
                  .where('user.uid', '==', uid)
                  .where('status.rejected', '==', false)
                  .where('status.hired', '==', false)
                  .get()
                  .then(function(snapshot) {
                    if (snapshot.empty) {
                      commit('updateIsCandidate', false)
                    } else {
                      commit('updateIsCandidate', true)
                    }
                    isCandidateQueried = true
                    if (isCandidateQueried && isCompanyDetailQueried) {
                      commit('updateIsLoading', false)
                    }
                  })
                  .catch(function(error) {
                    console.log("Error getting document:", error)
                    isCandidateQueried = true
                    if (isCandidateQueried && isCompanyDetailQueried) {
                      commit('updateIsLoading', false)
                    }
                  })
              } else {
                commit('updateIsLoading', false)
              }
            } else {
              // 非公開の場合
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
  apply({commit, state},{params, user, companyId}) {
    const jobId = params.id
    const status = {
      scouted: false,
      inbox: true,
      inProcess: false,
      intern: false,
      pass: false,
      contracted: false,
      hired: false,
      rejected: false,
    }

    firestore.collection('companies').doc(companyId)
      .collection('candidates')
      .add({
        user: user,
        jobId: jobId,
        status: status,
        createdAt: new Date(),
        type: 'application',
        isInternExtended: false,
        extendedInternEnd: false,
      })
      .then(() => {
        commit('updateIsCandidate', true)
        // analytics
        event({
          eventCategory: 'user',
          eventAction: 'apply',
          eventLabel: companyId
        })
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  resetState({commit}) {
    commit('setImageUrl', '')
    commit('setTitle', '')
    commit('setCompanyId', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
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
    commit('setDescription', '')
    commit('setWage', '')
    commit('setRequiredSkills', '')
    commit('setIdealSkills', '')
    commit('setEnvironment', '')
    commit('setWelfare', '')
    commit('setWorkweek', null)
    commit('setPeriod', null)
    commit('setWorkday', 0)
    commit('setWorktime', null)
    commit('setIdealCandidate', '')
    commit('setOccupation', null)
    commit('setFeatures', null)
    commit('setNearestStation', '')
    commit('setCreatedAt', '')
    commit('setNewGrad', null)
    commit('setNewGradResignee', null)
    commit('setAverageYearsOfService', null)
    commit('setAverageAge', null)
    commit('setTraining', null)
    commit('setSelfDevSupport', null)
    commit('setMentor', null)
    commit('setCareerSupport', null)
    commit('setTestSystem', null)
    commit('setOvertimeWork', null)
    commit('setPaidHolidays', null)
    commit('setChildcareLeave', null)
    commit('setFemaleExecutives', null)
    commit('setFeedback', null)
    commit('setReviews', null)
    commit('setReviewsChartData', null)
    commit('updateIsCandidate', false)
    commit('updateIsLoading', false)
  }
}
