export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'

export const state = () => ({
  notificationsSetting: null,
  acceptScout: true,
  isLoading: true,
})

export const mutations = {
  setNotificationsSetting(state, notificationsSetting) {
    state.notificationsSetting = notificationsSetting
  },
  setAcceptScout(state, acceptScout) {
    state.acceptScout = acceptScout
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  setNotificationsSetting({commit}, setting) {
    commit('setNotificationsSetting', setting)
  },
  setAcceptScout({commit}, acceptScout) {
    commit('setAcceptScout', acceptScout)
  },
  querySettings({commit, state}, uid) {
    firestore.collection('users')
      .doc(uid)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setNotificationsSetting', doc.data()['notificationsSetting'])
          commit('setAcceptScout', doc.data()['acceptScout'])
        }
        commit('updateIsLoading', false)
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  updateNotificationsSetting({commit}, {uid, setting}) {
    firestore.collection('users')
      .doc(uid)
      .update({
        notificationsSetting: setting
      })
      .then(() => {
        commit('setNotificationsSetting', setting)
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
      })
  },
  updateAcceptScout({commit}, {uid, acceptScout}) {
    const userRef = firestore.collection('users').doc(uid)
    batch.update(userRef, {
      acceptScout: acceptScout
    })
    const userDetailRef = firestore.collection('users').doc(uid)
      .collection('detail').doc(user.uid)
    batch.update(userDetailRef, {
      acceptScout: acceptScout
    })
    batch.commit()
      .then(() => {
        commit('setAcceptScout', acceptScout)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setNotificationsSetting', null)
    commit('setAcceptScout', true)
    commit('updateIsLoading', false)
  },
}
