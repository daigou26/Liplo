export const strict = false
import { firestore, auth, GoogleProvider } from '@/plugins/firebase'


export const state = () => ({
  uid: null,
  authError: null,
  loading: false,

})

export const mutations = {
  setUid(state, uid) {
    state.uid = uid
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
  async signOut({dispatch, commit}) {
    auth.signOut()
    dispatch('career/resetState')
    dispatch('chat/resetState')
    dispatch('chats/resetState')
    dispatch('feedback/resetState')
    dispatch('feedbacks/resetState')
    dispatch('resetState')
    dispatch('messages/resetState')
    dispatch('profile/resetState')
    dispatch('review/resetState')
    dispatch('reviews/resetState')
    dispatch('pass/resetState')
    dispatch('passes/resetState')
    dispatch('companyJobs/resetState')
  },
  setUid({commit}, uid) {
    commit('setUid', uid)
  },
  resetAuthError({commit}) {
    commit('resetAuthError')
  },
  setLoading({commit}) {
    commit('setLoading')
  },
  setAuthInfo({dispatch, commit}, {route, router, user, firstName, lastName, companyName, companyEmail, position}) {
    if (user) {
      commit('setUid', user)
      firestore.collection('users').doc(user.uid).get()
        .then(function(doc) {
          if (!doc.exists) {
            // サインアップ時
            if (firstName != '' && lastName != '') {
              if (companyName != '' && companyEmail != '' && position != '') {
                // recruiter
                const members = [{
                  uid: user.uid,
                  name: lastName + ' ' + firstName,
                  position: position,
                }]
                const company = {
                  name: companyName,
                  email: companyEmail,
                  members: members,
                }
                const batch = firestore.batch()
                const companyRef = firestore.collection('companies').doc()
                batch.set(companyRef, company)
                const userRef = firestore.collection('users').doc(user.uid)
                batch.set(userRef, {
                  firstName: firstName,
                  lastName: lastName,
                  type: 'recruiter',
                })
                const profileRef = firestore.collection('users')
                  .doc(user.uid).collection('profile').doc(user.uid)
                batch.set(profileRef, {
                  firstName: firstName,
                  lastName: lastName,
                  position: position,
                  email: user.email
                })
                batch.commit()
                  .then(() => {
                    dispatch('profile/setFirstName', firstName)
                    dispatch('profile/setLastName', lastName)
                    dispatch('profile/setType', 'recruiter')
                    router.replace('/recruiter/dashboard')
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error)
                  })
              } else {
                // user
                const batch = firestore.batch()
                const userRef = firestore.collection('users').doc(user.uid)
                batch.set(userRef, {
                  firstName: firstName,
                  lastName: lastName,
                  type: 'user',
                  points: 0,
                })
                const profileRef = firestore.collection('users')
                  .doc(user.uid).collection('profile').doc(user.uid)
                batch.set(profileRef, {
                  firstName: firstName,
                  lastName: lastName,
                  email: user.email
                })
                batch.commit()
                  .then(() => {
                    dispatch('profile/setFirstName', firstName)
                    dispatch('profile/setLastName', lastName)
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error)
                  })
              }
            } else {
              // 招待でログインした user
            }
          } else {
            dispatch('profile/setFirstName', doc.data()['firstName'])
            dispatch('profile/setLastName', doc.data()['lastName'])
            dispatch('profile/setType', doc.data()['type'])
            dispatch('profile/setCompanyId', doc.data()['companyId'])

            if (doc.data()['imageUrl'] != null) {
              dispatch('profile/setImageUrl', doc.data()['imageUrl'])
            }

            if (doc.data()['type'] != null) {
              if (route.path.includes('/user') && !route.path.includes('users')) {
                router.replace('/recruiter/dashboard')
              } else if (route.path.includes('/messages') && !route.path.includes('recruiter/messages')) {
                router.replace('/recruiter/dashboard')
              }
            } else {
              if (route.path.includes('/recruiter') || route.path.includes('/users')) {
                router.replace('/')
              }
            }
          }
        })

    } else {
      commit('setUid', null)
      if (route.path !== '/' && route.name !== 'jobs-id') {
        router.push('/')
      }
    }
  },
  resetState({commit}) {
    commit('setUid', null)
    commit('setAuthError', null)
    commit('resetLoading')
  },
}
