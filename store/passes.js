export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  passes: [],
  contractedPasses: [],
  isInitialLoading: false,
  isLoading: false,
  allPassesQueried: false,
})

export const mutations = {
  addPass(state, pass) {
    state.passes.push(pass)
  },
  resetPasses(state) {
    state.passes = []
  },
  addContractedPass(state, pass) {
    state.contractedPasses.push(pass)
  },
  resetContractedPasses(state) {
    state.contractedPasses = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllPassesQueried(state, allPassesQueried) {
    state.allPassesQueried = allPassesQueried
  }
}

export const actions = {
  queryPasses({commit, state}, uid) {
    const passes = state.passes

    if (passes.length == 0) {
      var areContractedPassesQueried = false
      var arePassesQueried = false

      // 契約済み
      firestore.collection('passes')
        .where('uid', '==', uid)
        .where('isContracted', '==', true)
        .orderBy('createdAt', 'desc')
        .get()
        .then(function(snapshot) {
          if (!snapshot.empty) {
            snapshot.forEach(function(doc) {
              let contractedDate = doc.data()['contractedDate']
              if (contractedDate) {
                let date = new Date( contractedDate.seconds * 1000 )
                let year  = date.getFullYear()
                let month = date.getMonth() + 1
                let day  = date.getDate()
                contractedDate = `${year}/${month}/${day}`
              }

              const pass = {
                passId: doc.id,
                companyImageUrl: doc.data()['companyImageUrl'],
                companyName: doc.data()['companyName'],
                occupation: doc.data()['occupation'],
                contractedDate: contractedDate,
                isAccepted: doc.data()['isAccepted'],
                isContracted: doc.data()['isContracted'],
              }
              commit('addContractedPass', pass)
            })
          }
          // loading
          areContractedPassesQueried = true
          if (areContractedPassesQueried && arePassesQueried) {
            commit('updateIsInitialLoading', false)
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
          areContractedPassesQueried = true
          if (areContractedPassesQueried && arePassesQueried) {
            commit('updateIsInitialLoading', false)
          }
        })

      // 契約していないパス
      firestore.collection('passes')
        .where('uid', '==', uid)
        .where('isContracted', '==', false)
        .orderBy('expirationDate', 'asc')
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            let expirationDate = doc.data()['expirationDate']
            if (expirationDate) {
              let date = new Date( expirationDate.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              expirationDate = `${year}/${month}/${day}`
            }

            docCount += 1
            const pass = {
              passId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              occupation: doc.data()['occupation'],
              expirationDate: expirationDate,
              isAccepted: doc.data()['isAccepted'],
              isContracted: doc.data()['isContracted'],
              isValid: doc.data()['isValid']
            }
            const currentDate = new Date()
            if (doc.data()['expirationDate'].seconds < currentDate.seconds) {
              pass.isExpired = true
            } else {
              pass.isExpired = false
            }
            commit('addPass', pass)
          })
          if (docCount == 0) {
            commit('setAllPassesQueried', true)
          }

          // loading
          arePassesQueried = true
          if (areContractedPassesQueried && arePassesQueried) {
            commit('updateIsInitialLoading', false)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          arePassesQueried = true
          if (areContractedPassesQueried && arePassesQueried) {
            commit('updateIsInitialLoading', false)
          }
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (passes.length != 0) {
      const lastIndex = passes.length - 1
      const lastDate = passes[lastIndex].expirationDate
      firestore.collection('passes')
        .where('uid', '==', uid)
        .where('isContracted', '==', false)
        .orderBy('expirationDate', 'asc')
        .startAfter(lastDate)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            let expirationDate = doc.data()['expirationDate']
            if (expirationDate) {
              let date = new Date( expirationDate.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              expirationDate = `${year}/${month}/${day}`
            }

            docCount += 1
            const pass = {
              passId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              occupation: doc.data()['occupation'],
              expirationDate: expirationDate,
              isAccepted: doc.data()['isAccepted'],
              isContracted: doc.data()['isContracted'],
              isValid: doc.data()['isValid']
            }
            const currentDate = new Date()
            if (doc.data()['expirationDate'].seconds < currentDate.seconds) {
              pass.isExpired = true
            } else {
              pass.isExpired = false
            }
            commit('addPass', pass)
          })
          if (docCount == 0) {
            commit('setAllPassesQueried', true)
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
    commit('resetPasses')
    commit('resetContractedPasses')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('setAllPassesQueried', false)
  },
}
