export const strict = false
import { firebase, auth, GoogleProvider } from '@/plugins/firebase'


export const state = () => ({
  user: null,
  acceptedOffer: null,
  authError: null,
  loading: false,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setAcceptedOffer(state, acceptedOffer) {
    state.acceptedOffer = acceptedOffer
  },
  setAuthError(state, error) {
    state.authError = error
  },
  resetAuthError(state) {
    state.authError = null
  },
  setLoading(state) {
    state.loading = true
  },
  resetLoading(state) {
    state.loading = false
  },
}

export const actions = {
  async signUp({commit}, {email, password}) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(function() {
        commit('resetLoading')
      })
      .catch(function(error) {
        var errorCode = error.code
        var errorMessage = error.message
        console.log(errorMessage)
        commit('setAuthError', errorMessage)
        commit('resetLoading')
      })
  },
  async signIn({commit}, {email, password}) {
    auth.signInWithEmailAndPassword(email, password)
      .then(function() {
        commit('resetLoading')
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        commit('setAuthError', errorMessage)
        commit('resetLoading')
      })
  },
  async signOut({commit}) {
    auth.signOut()
  },
  setUser({commit}, user) {
    commit('setUser', user)
  },
  setAcceptedOffer({commit}, acceptedOffer) {
    commit('setAcceptedOffer', acceptedOffer)
  },
  resetAuthError({commit}) {
    commit('resetAuthError')
  },
  setLoading({commit}) {
    commit('setLoading')
  },
}

export const getters = {
  user(state) {
    return state.user
  },
  authError(state) {
    return state.authError
  },
  loading(state) {
    return state.loading
  },
}
