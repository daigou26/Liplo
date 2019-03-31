export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'

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
  idealCandidate: '',
  occupation: '',
  features: '',
  field: '',
  createdAt: '',
  applicants: null,
  reviews: null,
  reviewChartData: null,
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
  setIdealCandidate(state, idealCandidate) {
    state.idealCandidate = idealCandidate
  },
  setOccupation(state, occupation) {
    state.occupation = occupation
  },
  setFeatures(state, features) {
    state.features = features
  },
  setCreatedAt(state, createdAt) {
    state.createdAt = createdAt
  },
  setApplicants(state, applicants) {
    state.applicants = applicants
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setReviewChartData(state, data) {
    state.reviewChartData = data
  },
}

export const actions = {
  queryJobDetail({commit}, {nuxt, params}) {
    const jobId = params.id
    if (jobId != null && jobId != '') {
      firestore.collection('jobs').doc(jobId).collection('detail').doc(jobId).get()
        .then(function(doc) {
          if (doc.exists) {
            commit('setImageUrl', doc.data()['imageUrl'])
            commit('setTitle', doc.data()['title'])
            commit('setCompanyId', doc.data()['companyId'])
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
            commit('setIdealCandidate', doc.data()['idealCandidate'])
            // commit('setOccupation', doc.data()['occupation'])
            // commit('setFeatures', doc.data()['features'])
            commit('setCreatedAt', doc.data()['createdAt'])
            commit('setApplicants', doc.data()['applicants'])
            // commit('setReviews', doc.data()['reviews'])

            firestore.collection('companies')
              .doc(doc.data()['companyId'])
              .collection('detail')
              .doc(doc.data()['companyId'])
              .get()
              .then(function(companyDoc) {
                if (companyDoc.exists) {
                  commit('setReviews', companyDoc.data()['reviews'])
                  // chart Data
                  const reviews = companyDoc.data()['reviews']
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
              })
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
  apply({commit},{params, uid, imageUrl, firstName, lastName, companyId}) {
    const jobId = params.id

    firestore.collection('companies').doc(companyId)
      .collection('applicants')
      .add({
        uid: uid,
        jobId: jobId,
        imageUrl: imageUrl,
        name: lastName + ' ' + firstName,
      })
      .then(() => {
        commit('setApplied')
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
}
