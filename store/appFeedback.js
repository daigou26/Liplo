export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  type: '',
  content: '',
  timestamp: null,
  isLoading: null,
  errorMessage: null,
})

export const mutations = {
  setType(state, type) {
    state.type = type
  },
  setContent(state, content) {
    state.content = content
  },
  setTimestamp(state, timestamp) {
    state.timestamp = timestamp
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setErrorMessage(state, message) {
    state.errorMessage = message
  }
}
export const actions = {
  queryFeedback({commit}, feedbackId) {
    firestore.collection('appFeedbacks')
      .doc(feedbackId)
      .get()
      .then(doc => {
        if (doc.exists) {
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

          commit('setType', type)
          commit('setContent', doc.data()['content'])
          commit('setTimestamp', timestamp)
        }
      })
      .catch(error => {
        console.error("Error: ", error)
      })
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
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setType', '')
    commit('setContent', '')
    commit('setTimestamp', null)
    commit('updateIsLoading', null)
    commit('setErrorMessage', null)
  }
}
