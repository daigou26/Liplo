export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  feedbacks: [],
  isInitialLoading: false,
  isLoading: false,
  allFeedbacksQueried: false,
  unwrittenFeedbacks: [],
  isUnwrittenFeedbacksLoading: false,
  allUnwrittenFeedbacksQueried: false,
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
  addUnwittenFeedback(state, feedback) {
    state.unwrittenFeedbacks.push(feedback)
  },
  resetUnwittenFeedbacks(state) {
    state.unwrittenFeedbacks = []
  },
  updateIsUnwittenFeedbacksLoading(state, isLoading) {
    state.isUnwrittenFeedbacksLoading = isLoading
  },
  setAllUnwittenFeedbacksQueried(state, allUnwrittenFeedbacksQueried) {
    state.allUnwrittenFeedbacksQueried = allUnwrittenFeedbacksQueried
  }
}

export const actions = {
  queryFeedbacks({commit}, {uid, feedbacks}) {
    if (feedbacks.length == 0) {
      return firestore.collection('feedbacks')
        .where('uid', '==', uid)
        .where('isWritten', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(10)
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
            const feedback = {
              feedbackId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              goodPoint: doc.data()['goodPoint'],
              advice: doc.data()['advice'],
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
      return firestore.collection('feedbacks')
        .where('uid', '==', uid)
        .where('isWritten', '==', true)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
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
            const feedback = {
              feedbackId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              goodPoint: doc.data()['goodPoint'],
              advice: doc.data()['advice'],
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
  queryUnwrittenFeedbacks({commit, state}, companyId) {
    const feedbacks = state.unwrittenFeedbacks
    if (feedbacks.length == 0) {
      return firestore.collection('feedbacks')
        .where('isWritten', '==', false)
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .limit(10)
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

            const feedback = {
              feedbackId: doc.id,
              uid: doc.data()['uid'],
              userName: doc.data()['userName'],
              profileImageUrl: doc.data()['profileImageUrl'],
              timestamp: timestamp,
            }
            commit('addUnwittenFeedback', feedback)
          })
          if (docCount == 0) {
            commit('setAllUnwittenFeedbacksQueried', true)
          }
          commit('updateIsUnwittenFeedbacksLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else if (feedbacks.length != 0) {
      const lastIndex = feedbacks.length - 1
      const lastDate = feedbacks[lastIndex].createdAt
      return firestore.collection('feedbacks')
        .where('isWritten', '==', false)
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
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

            const feedback = {
              feedbackId: doc.id,
              uid: doc.data()['uid'],
              userName: doc.data()['userName'],
              profileImageUrl: doc.data()['profileImageUrl'],
              timestamp: timestamp,
            }
            commit('addUnwittenFeedback', feedback)
          })
          if (docCount == 0) {
            commit('setAllUnwittenFeedbacksQueried', true)
          }
          commit('updateIsUnwittenFeedbacksLoading', false)
        })
        .catch(function(error) {
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
  updateIsUnwittenFeedbacksLoading({commit}, isLoading) {
    commit('updateIsUnwittenFeedbacksLoading', isLoading)
  },
  resetState({commit}) {
    commit('resetFeedbacks')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('setAllFeedbacksQueried', false)
    commit('resetUnwittenFeedbacks')
    commit('updateIsUnwittenFeedbacksLoading', false)
    commit('setAllUnwittenFeedbacksQueried', false)
  },
}
