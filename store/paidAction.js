export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  isLoading: false,
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  invoiceEmail: '',
  type: '',
  isFree: null,
  plan: null,
  timestamp: '',
})

export const mutations = {
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setCompanyId(state, companyId) {
    state.companyId = companyId
  },
  setCompanyName(state, name) {
    state.companyName = name
  },
  setCompanyImageUrl(state, imageUrl) {
    state.companyImageUrl = imageUrl
  },
  setInvoiceEmail(state, invoiceEmail) {
    state.invoiceEmail = invoiceEmail
  },
  setType(state, type) {
    state.type = type
  },
  setIsFree(state, isFree) {
    state.isFree = isFree
  },
  setPlan(state, plan) {
    state.plan = plan
  },
  setTimestamp(state, timestamp) {
    state.timestamp = timestamp
  },
}

export const actions = {
  queryPaidAction({commit}, paidActionId) {
    firestore.collection('paidActions')
      .doc(paidActionId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          var timestamp = doc.data()['createdAt']
          if (timestamp) {
            let date = new Date( timestamp.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            timestamp = `${year}/${month}/${day}`
          }
          commit('setTimestamp', timestamp)
          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyName', doc.data()['companyName'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setType', doc.data()['type'])
          commit('setIsFree', doc.data()['isFree'])
          commit('setPlan', doc.data()['plan'])
          commit('setInvoiceEmail', doc.data()['invoiceEmail'])
        }
        commit('updateIsLoading', false)
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setTimestamp', '')
    commit('setCompanyId', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
    commit('setType', '')
    commit('setIsFree', null)
    commit('setPlan', null)
    commit('setInvoiceEmail', '')
    commit('updateIsLoading', false)
  },
}
