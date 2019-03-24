export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  feedbacks: [],
  isFeedbacksLoading: false,
  allFeedbacksQueried: false,
})

export const mutations = {
  addFeedback(state, feedback) {
    state.feedbacks.push(feedback)
  },
  resetFeedbacks(state) {
    state.feedbacks = []
  },
  updateFeedbacksLoading(state, isLoading) {
    state.isFeedbacksLoading = isLoading
  },
  setAllFeedbacksQueried(state) {
    state.allFeedbacksQueried = true
  }
}

export const actions = {
  queryFeedbacks({commit}, {uid, feedbacks}) {
    if (feedbacks.length == 0) {
      return firestore.collection('feedbacks')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(2)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const feedback = {
              feedbackId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              goodPoint: doc.data()['goodPoint'],
              advice: doc.data()['advice'],
              createdAt: doc.data()['createdAt']
            }
            commit('addFeedback', feedback)
          })
          if (docCount == 0) {
            commit('setAllFeedbacksQueried')
          }
          commit('updateFeedbacksLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else if (feedbacks.length != 0) {
      const lastIndex = feedbacks.length - 1
      const lastDate = feedbacks[lastIndex].createdAt
      return firestore.collection('feedbacks')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(2)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const feedback = {
              feedbackId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              goodPoint: doc.data()['goodPoint'],
              advice: doc.data()['advice'],
              createdAt: doc.data()['createdAt']
            }
            commit('addFeedback', feedback)
          })
          if (docCount == 0) {
            commit('setAllFeedbacksQueried')
          }
          commit('updateFeedbacksLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    }
  },
  updateFeedbacksLoading({commit}, isLoading) {
    commit('updateFeedbacksLoading', isLoading)
  },
  resetState({commit}) {
    commit('resetFeedbacks')
    commit('updateFeedbacksLoading', false)
    commit('setAllFeedbacksQueried', false)
  },
}
