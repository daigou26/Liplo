export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  candidates: [],
  isInitialLoading: false,
  isLoading: false,
  allCandidatesQueried: false,
})

export const mutations = {
  addCandidate(state, candidate) {
    state.candidates.push(candidate)
  },
  updateCandidate(state, updatedCandidate) {
    // candidate を更新
    state.candidates = state.candidates.map(candidate => {
      if (candidate.candidateId == updatedCandidate.candidateId) {
        if (updatedCandidate.tags) {
          // tags 更新
          candidate.tags = updatedCandidate.tags
        } else if (updatedCandidate.reviews) {
          // reviews 更新
          candidate.reviews = updatedCandidate.reviews
        }
      }
      return candidate
    })
  },
  resetCandidates(state) {
    state.candidates = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllCandidatesQueried(state) {
    state.allCandidatesQueried = true
  },
  resetAllCandidatesQueried(state) {
    state.allCandidatesQueried = false
  },
}

export const actions = {
  queryCandidates({commit, state}, companyId) {
    const candidates = state.candidates
    if (candidates.length == 0) {
      return firestore.collection('companies')
        .doc(companyId)
        .collection('candidates')
        .where('status.rejected', '==', false)
        .where('status.hired', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            let timestamp = doc.data()['updatedAt'] != null
              ? doc.data()['updatedAt']
              : doc.data()['createdAt']

            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const candidate = {
              candidateId: doc.id,
              user: doc.data()['user'],
              status: doc.data()['status'],
              reviews: doc.data()['reviews'],
              tags: doc.data()['tags'],
              createdAt: doc.data()['createdAt'],
              updatedAt: doc.data()['updatedAt'],
              timestamp: timestamp,
            }
            commit('addCandidate', candidate)
          })
          if (docCount == 0) {
            commit('setAllCandidatesQueried')
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (candidates.length != 0) {
      const lastIndex = candidates.length - 1
      const lastDate = candidates[lastIndex].createdAt
      return firestore.collection('companies')
        .doc(companyId)
        .collection('candidates')
        .where('status.rejected', '==', false)
        .where('status.hired', '==', false)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            let timestamp = doc.data()['updatedAt'] != null
              ? doc.data()['updatedAt']
              : doc.data()['createdAt']

            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const candidate = {
              candidateId: doc.id,
              user: doc.data()['user'],
              status: doc.data()['status'],
              reviews: doc.data()['reviews'],
              tags: doc.data()['tags'],
              createdAt: doc.data()['createdAt'],
              updatedAt: doc.data()['updatedAt'],
              timestamp: timestamp,
            }
            commit('addCandidate', candidate)
          })
          if (docCount == 0) {
            commit('setAllCandidatesQueried')
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
  updateCandidate({commit, state}, updatedCandidate) {
    commit('updateCandidate', updatedCandidate)
  },
  resetState({commit}) {
    commit('resetCandidates')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('resetAllCandidatesQueried')
  },
}
