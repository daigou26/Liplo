export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  passes: [],
  isPassesLoading: false,
  allPassesQueried: false,
})

export const mutations = {
  addPass(state, pass) {
    state.passes.push(pass)
  },
  updatePassesLoading(state, isLoading) {
    state.isPassesLoading = isLoading
  },
  setAllPassesQueried(state) {
    state.allPassesQueried = true
  }
}

export const actions = {
  queryPasses({commit}, {uid, passes}) {
    if (passes.length == 0) {
      return firestore.collection('passes')
        .where('uid', '==', uid)
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
            commit('setAllPassesQueried')
          }
          commit('updatePassesLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else if (passes.length != 0) {
      const lastIndex = passes.length - 1
      const lastDate = passes[lastIndex].expirationDate
      return firestore.collection('passes')
        .where('uid', '==', uid)
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
            commit('setAllPassesQueried')
          }
          commit('updatePassesLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    }
  },
  updatePassesLoading({commit}, isLoading) {
    commit('updatePassesLoading', isLoading)
  },
}
