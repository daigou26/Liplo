export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  career: [],
  notReviewedLists: null,
  notReviewedCompany: null,
  isLoading: false,
})

export const mutations = {
  setCareer(state, career) {
    state.career = career
  },
  setNotReviewedLists(state, lists) {
    state.notReviewedLists = lists
  },
  setNotReviewedCompany(state, company) {
    state.notReviewedCompany = company
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  queryNotReviewedCompany({commit}, {nuxt, uid, careerId}) {
    firestore.collection('users')
      .doc(uid)
      .collection('career')
      .doc(careerId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const company = {
            careerId: doc.id,
            occupation: doc.data()['occupation'],
            companyId: doc.data()['companyId'],
            companyImageUrl: doc.data()['companyImageUrl'],
            companyName: doc.data()['companyName'],
            end: doc.data()['end'],
            isReviewWritten: doc.data()['isReviewWritten'],
          }
          if (doc.data()['isReviewWritten']) {
            nuxt.error({ statusCode: 404, message: 'not found' })
          }
          commit('setNotReviewedCompany', company)
        } else {
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
        nuxt.error({ statusCode: 404, message: 'not found' })
      })
  },
  queryNotReviewedLists({commit}, uid) {
    return firestore.collection('users').doc(uid)
      .collection('career')
      .where('end', '==', true)
      .where('isReviewWritten', '==', false)
      .get()
      .then(function(snapshot) {
        const data = []
        snapshot.forEach(function(doc) {
          const company = {
            careerId: doc.id,
            occupation: doc.data()['occupation'],
            companyId: doc.data()['companyId'],
            companyImageUrl: doc.data()['companyImageUrl'],
            companyName: doc.data()['companyName'],
            end: doc.data()['end'],
          }
          data.push(company)
        })
        commit('setNotReviewedLists', data)
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
      })
  },
  queryCareer({commit}, uid) {
    return firestore.collection('users').doc(uid)
      .collection('career')
      .orderBy("startedAt", "asc")
      .get()
      .then(function(snapshot) {
        const data = []
        snapshot.forEach(function(doc) {
          let startedAt = doc.data()['startedAt']
          if (startedAt) {
            let date = new Date( startedAt.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            startedAt = `${year}/${month}/${day}`
          }
          let endedAt = doc.data()['endedAt']
          if (endedAt) {
            let date = new Date( endedAt.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            endedAt = `${year}/${month}/${day}`
          }
          const job = {
            careerId: doc.id,
            occupation: doc.data()['occupation'],
            companyId: doc.data()['companyId'],
            companyImageUrl: doc.data()['companyImageUrl'],
            companyName: doc.data()['companyName'],
            end: doc.data()['end'],
            startedAt: startedAt,
            endedAt: endedAt,
            isInternExtended: doc.data()['isInternExtended'],
            extendedInternEnd: doc.data()['extendedInternEnd']
          }
          data.push(job)
        })
        commit('updateIsLoading', false)
        commit('setCareer', data)
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setCareer', [])
    commit('setNotReviewedLists', null)
    commit('setNotReviewedCompany', null)
    commit('updateIsLoading', false)
  },
}
