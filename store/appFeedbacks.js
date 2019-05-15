export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  feedbacks: [],
  isInitialLoading: false,
  isLoading: false,
  allFeedbacksQueried: false,
})

export const mutations = {
  addFeedback(state, feedback) {
    state.feedbacks.push(feedback)
  },
  resetFeedbacks(state) {
    state.feedbacks = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllFeedbacksQueried(state, allFeedbacksQueried) {
    state.allFeedbacksQueried = allFeedbacksQueried
  },
}

export const actions = {
  queryFeedbacks({commit, state}) {
    const feedbacks = state.feedbacks

    if (feedbacks.length == 0) {
      firestore.collection('appFeedbacks')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            var type
            switch (doc.data()['type']) {
              case 'bugs': type = 'バグ'; break
              case 'requests': type = '要望'; break
              case 'comments': type = '感想'; break
              case 'other': type = 'その他'; break
            }

            const feedback = {
              feedbackId: doc.id,
              content: doc.data()['content'],
              type: type,
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addFeedback', feedback)
          })
          if (docCount == 0) {
            commit('setAllFeedbacksQueried', true)
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (feedbacks.length != 0) {
      const lastIndex = feedbacks.length - 1
      const lastDate = feedbacks[lastIndex].createdAt

      firestore.collection('appFeedbacks')
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            var type
            switch (doc.data()['type']) {
              case 'bugs': type = 'バグ'; break
              case 'requests': type = '要望'; break
              case 'comments': type = '感想'; break
              case 'other': type = 'その他'; break
            }

            const feedback = {
              feedbackId: doc.id,
              content: doc.data()['content'],
              type: type,
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addFeedback', feedback)
          })
          if (docCount == 0) {
            commit('setAllFeedbacksQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  updateIsInitialLoading({commit}, isLoading) {
    commit('updateIsInitialLoading', isLoading)
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('resetFeedbacks')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('setAllFeedbacksQueried', false)
  },
}
