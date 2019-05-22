export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  companyId: null,
  companyImageUrl: null,
  companyName: null,
  type: '',
  joiningYear: null,
  // パスの使用上限(先着パスのみ)
  limit: null,
  // パスの発行数(先着パスのみ)
  allCount: null,
  // パスの使用数(先着パスのみ)
  usedCount: null,
  message: '',
  occupation: '',
  expirationDate: null,
  isAccepted: false,
  isContracted: false,
  isValid: false,
  isExpired: false,
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
  setType(state, type) {
    state.type = type
  },
  setJoiningYear(state, joiningYear) {
    state.joiningYear = joiningYear
  },
  setLimit(state, limit) {
    state.limit = limit
  },
  setAllCount(state, count) {
    state.allCount = count
  },
  setUsedCount(state, count) {
    state.usedCount = count
  },
  setMessage(state, message) {
    state.message = message
  },
  setOccupation(state, occupation) {
    state.occupation = occupation
  },
  setExpirationDate(state, date) {
    state.expirationDate = date
  },
  setIsAccepted(state, isAccepted) {
    state.isAccepted = isAccepted
  },
  setIsContracted(state, isContracted) {
    state.isContracted = isContracted
  },
  setIsValid(state, isValid) {
    state.isValid = isValid
  },
  setIsExpired(state, isExpired) {
    state.isExpired = isExpired
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  queryPass({commit}, {nuxt, params}) {
    const passId = params.id

    firestore.collection('passes')
      .doc(passId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const currentDate = Math.round(new Date() / 1000)
          if (doc.data()['expirationDate'].seconds < currentDate) {
            commit('setIsExpired', true)
          } else {
            commit('setIsExpired', false)
          }

          let expirationDate = doc.data()['expirationDate']
          if (expirationDate) {
            let date = new Date( expirationDate.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            expirationDate = `${year}/${month}/${day}`
          }

          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setCompanyName', doc.data()['companyName'])
          commit('setType', doc.data()['type'])
          commit('setJoiningYear', doc.data()['joiningYear'])
          commit('setMessage', doc.data()['picMessage'])
          commit('setOccupation', doc.data()['occupation'])
          commit('setExpirationDate', expirationDate)
          commit('setIsAccepted', doc.data()['isAccepted'])
          commit('setIsContracted', doc.data()['isContracted'])
          commit('setIsValid', doc.data()['isValid'])

          // 先着パスの上限,使用数などを取得
          if (doc.data()['type'] == 'limited') {
            firestore.collection('companies')
              .doc(doc.data()['companyId'])
              .collection('yearPasses')
              .doc(String(doc.data()['joiningYear']))
              .get()
              .then(function(yearPassDoc) {
                if (doc.exists) {
                  commit('setLimit', yearPassDoc.data()['limit'])
                  if (yearPassDoc.data()['count']) {
                    commit('setAllCount', yearPassDoc.data()['count'].limited.all)
                    commit('setUsedCount', yearPassDoc.data()['count'].limited.used)
                  }
                }
                commit('updateIsLoading', false)
              })
              .catch(function(error) {
                commit('updateIsLoading', false)
                console.log("Error getting document:", error)
              })
          } else {
            commit('updateIsLoading', false)
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
      })
  },
  acceptOffer({commit}, {params, message, joiningYear}) {
    const passId = params.id

    var passData = {
      isAccepted: true,
      userMessage: message,
      acceptedDate: new Date()
    }

    if (joiningYear) {
      passData.joiningYear = Number(joiningYear)
    }

    firestore.collection('passes')
      .doc(passId)
      .update(passData)
      .then(() => {
        commit('setIsAccepted', true)
        commit('setJoiningYear', Number(joiningYear))
      })
      .catch((error) => {
        console.error("Error updating document: ", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setCompanyId', null)
    commit('setCompanyImageUrl', null)
    commit('setCompanyName', null)
    commit('setType', '')
    commit('setJoiningYear', null)
    commit('setMessage', '')
    commit('setOccupation', '')
    commit('setExpirationDate', null)
    commit('setIsAccepted', false)
    commit('setIsContracted', false)
    commit('setIsValid', false)
    commit('setIsExpired', false)
    commit('updateIsLoading', false)
  },
}
