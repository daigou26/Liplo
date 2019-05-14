export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  isLoading: null,
  errorMessage: null,
})

export const mutations = {
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setErrorMessage(state, message) {
    state.errorMessage = message
  }
}
export const actions = {
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  sendFeedback({commit}, {content, type}) {
    firestore.collection('appFeedbacks')
      .add({
        content: content,
        type: type,
        createdAt: new Date(),
      })
      .then(() => {
        commit('setErrorMessage', null)
        commit('updateIsLoading', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
        commit('setErrorMessage', error)
        commit('updateIsLoading', false)
      })
  },
  resetState({commit}) {
    commit('updateIsLoading', null)
    commit('setErrorMessage', null)
  }
}
