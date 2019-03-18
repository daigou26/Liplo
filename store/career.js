export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  career: [],
})

export const mutations = {
  setCareer(state, career) {
    state.career = career
  },
}

export const actions = {
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
