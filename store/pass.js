export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  companyId: null,
  companyImageUrl: null,
  companyName: null,
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
  acceptOffer({commit}, {params, message}) {
    const passId = params.id

    firestore.collection('passes')
      .doc(passId)
      .update({
        isAccepted: true,
        userMessage: message,
        acceptedDate: new Date(),
      })
      .then(() => {
        commit('setIsAccepted', true)
      })
      .catch((error) => {
        console.error("Error updating document: ", error)
      })

  },
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
          commit('setMessage', doc.data()['picMessage'])
          commit('setOccupation', doc.data()['occupation'])
          commit('setExpirationDate', expirationDate)
          commit('setIsAccepted', doc.data()['isAccepted'])
          commit('setIsContracted', doc.data()['isContracted'])
          commit('setIsValid', doc.data()['isValid'])
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
