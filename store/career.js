export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  career: [],
  notReviewedLists: null,
  notReviewedCompany: null,
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
  }
}

export const actions = {
  queryNotReviewedCompany({commit}, {nuxt, uid, companyId}) {
    return firestore.collection('users').doc(uid)
      .collection('career')
      .where('companyId', '==', companyId)
      .where('end', '==', true)
      .where('isReviewWritten', '==', false)
      .get()
      .then(function(snapshot) {
        var docCount = 0
        snapshot.forEach(function(doc) {
          docCount += 1
          const company = {
            jobId: doc.id,
            occupation: doc.data()['occupation'],
            companyId: doc.data()['companyId'],
            companyImageUrl: doc.data()['companyImageUrl'],
            companyName: doc.data()['companyName'],
            duration: doc.data()['duration'],
            end: doc.data()['end'],
            isReviewWritten: doc.data()['isReviewWritten'],
          }
          if (doc.data()['isReviewWritten'] == true) {
            nuxt.error({ statusCode: 404, message: 'not found' })
          }
          commit('setNotReviewedCompany', company)
        })
        if (docCount == 0) {
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        nuxt.error({ statusCode: 404, message: 'not found' })
        console.log("Error getting document:", error)
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
            jobId: doc.id,
            occupation: doc.data()['occupation'],
            companyId: doc.data()['companyId'],
            companyImageUrl: doc.data()['companyImageUrl'],
            companyName: doc.data()['companyName'],
            duration: doc.data()['duration'],
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
          const job = {
            jobId: doc.id,
            occupation: doc.data()['occupation'],
            companyId: doc.data()['companyId'],
            companyImageUrl: doc.data()['companyImageUrl'],
            companyName: doc.data()['companyName'],
            duration: doc.data()['duration'],
            end: doc.data()['end'],
            startedAt: startedAt
          }
          data.push(job)
        })
        commit('setCareer', data)
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
      })
  },
}
