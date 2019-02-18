export const strict = false
import { firebase, auth, GoogleProvider } from '@/plugins/firebase'


export const state = () => ({
  user: null,
  imageUrl: null,
  imageUrl: null,
  authError: null,
  loading: false,
})

export const mutations = {
  setUser(state, user) {
    console.log('[STORE MUTATIONS] - setUSER:', user)
    state.user = user
  },
  setImageUrl(state, imageUrl) {
    console.log('[STORE MUTATIONS] - setImageUrl:', imageUrl)
    state.imageUrl = imageUrl
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
    console.log('[STORE ACTIONS] - signup')
    auth.createUserWithEmailAndPassword(email, password)
      .then(function() {
        commit('resetLoading')
        console.log('create')
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
    console.log('[STORE ACTIONS] - signin')
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
    console.log('[STORE ACTIONS] - signout')
    auth.signOut()
  },
  setUser({commit}, user) {
    console.log('[STORE ACTIONS] - setUser')
    commit('setUser', user)
  },
  setImageUrl({commit}, imageUrl) {
    console.log('STORE ACTIONS] - setImageUrl')
    commit('setImageUrl', imageUrl)
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
  imageUrl(state) {
    return state.imageUrl
  },
  authError(state) {
    return state.authError
  },
  loading(state) {
    return state.loading
  },
}
