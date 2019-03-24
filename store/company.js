export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  imageUrl: '',
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  rating: null,
  count: null,
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
  chartData: null,
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
  setCount(state, count) {
    state.count = count
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
  setChartData(state, data) {
    state.chartData = data
  },
}

export const actions = {
  queryCompany({commit}, {nuxt, companyId}) {
    if (companyId != null && companyId != '') {
      return firestore.collection('companies').doc(companyId)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            commit('setRating', doc.data()['rating'])
            commit('setCount', doc.data()['count'])
            commit('setFeedback', doc.data()['feedback'])

            // chart Data
            if (doc.data()['rating']) {
              const rating = doc.data()['rating']
              const chartData = {
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
              commit('setChartData', chartData)
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
      return firestore.collection('companies').doc(companyId)
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
            commit('setCompanyName', doc.data()['name'])
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

            // chart Data
            if (doc.data()['reviews']) {
              const reviews = doc.data()['reviews']
              const chartData = {
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
              commit('setChartData', chartData)
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
}
