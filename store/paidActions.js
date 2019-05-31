export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const state = () => ({
  paidActions: [],
  isInitialLoading: false,
  isLoading: false,
  allPaidActionsQueried: false,
})

export const mutations = {
  addPaidAction(state, paidAction) {
    state.paidActions.push(paidAction)
  },
  resetPaidActions(state) {
    state.paidActions = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllPaidActionsQueried(state, allPaidActionsQueried) {
    state.allPaidActionsQueried = allPaidActionsQueried
  },
}

export const actions = {
  queryPaidActions({commit, state}) {
    const paidActions = state.paidActions

    if (paidActions.length == 0) {
      firestore.collection('paidActions')
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

            const paidAction = {
              paidActionId: doc.id,
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              type: doc.data()['type'],
              isFree: doc.data()['isFree'],
              plan: doc.data()['plan'],
              invoiceEmail: doc.data()['invoiceEmail'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addPaidAction', paidAction)
          })
          if (docCount == 0) {
            commit('setAllPaidActionsQueried', true)
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (paidActions.length != 0) {
      const lastIndex = paidActions.length - 1
      const lastDate = paidActions[lastIndex].createdAt

      firestore.collection('paidActions')
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

            const paidAction = {
              paidActionId: doc.id,
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              type: doc.data()['type'],
              isFree: doc.data()['isFree'],
              plan: doc.data()['plan'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addPaidAction', paidAction)
          })
          if (docCount == 0) {
            commit('setAllPaidActionsQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  queryCompanyPaidActions({commit, state}, companyId) {
    const paidActions = state.paidActions

    if (paidActions.length == 0) {
      firestore.collection('paidActions')
        .where('companyId', '==', companyId)
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

            const paidAction = {
              paidActionId: doc.id,
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              type: doc.data()['type'],
              isFree: doc.data()['isFree'],
              plan: doc.data()['plan'],
              invoiceEmail: doc.data()['invoiceEmail'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addPaidAction', paidAction)
          })
          if (docCount == 0) {
            commit('setAllPaidActionsQueried', true)
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (paidActions.length != 0) {
      const lastIndex = paidActions.length - 1
      const lastDate = paidActions[lastIndex].createdAt

      firestore.collection('paidActions')
        .where('companyId', '==', companyId)
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

            const paidAction = {
              paidActionId: doc.id,
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              type: doc.data()['type'],
              isFree: doc.data()['isFree'],
              plan: doc.data()['plan'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addPaidAction', paidAction)
          })
          if (docCount == 0) {
            commit('setAllPaidActionsQueried', true)
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
    commit('resetPaidActions')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('setAllPaidActionsQueried', false)
  },
}
