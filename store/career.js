export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  career: [],
  notReviewedLists: null,
  notReviewedCompany: null,
  isLoading: false,
  isNotReviewedListsLoading: false,
  isNotReviewedCompanyLoading: false,
  occupation: '',
  jobDescription: '',
  companyId: '',
  companyName: '',
  companyImageUrl: '',
  startedAt: null,
  end: null,
  endedAt: null,
  isInternExtended: null,
  extendedInternEnd: null,
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
  updateIsNotReviewedListsLoading(state, isLoading) {
    state.isNotReviewedListsLoading = isLoading
  },
  updateIsNotReviewedCompanyLoading(state, isLoading) {
    state.isNotReviewedCompanyLoading = isLoading
  },
  setOccupation(state, occupation) {
    state.occupation = occupation
  },
  setJobDescription(state, jobDescription) {
    state.jobDescription = jobDescription
  },
  setCompanyId(state, companyId) {
    state.companyId = companyId
  },
  setCompanyName(state, name) {
    state.companyName = name
  },
  setCompanyImageUrl(state, imageUrl) {
    state.companyImageUrl = imageUrl
  },
  setStartedAt(state, startedAt) {
    state.startedAt = startedAt
  },
  setEnd(state, end) {
    state.end = end
  },
  setEndedAt(state, endedAt) {
    state.endedAt = endedAt
  },
  setIsInternExtended(state, isInternExtended) {
    state.isInternExtended = isInternExtended
  },
  setExtendedInternEnd(state, extendedInternEnd) {
    state.extendedInternEnd = extendedInternEnd
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
          commit('updateIsNotReviewedCompanyLoading', false)
        } else {
          commit('updateIsNotReviewedCompanyLoading', false)
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        commit('updateIsNotReviewedCompanyLoading', false)
        console.log("Error getting document:", error)
        nuxt.error({ statusCode: 404, message: 'not found' })
      })
  },
  queryNotReviewedLists({commit}, uid) {
    firestore.collection('users').doc(uid)
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
        commit('updateIsNotReviewedListsLoading', false)
      })
      .catch(function(error) {
        commit('updateIsNotReviewedListsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  queryCareer({commit}, uid) {
    firestore.collection('users').doc(uid)
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
            jobDescription: doc.data()['jobDescription'],
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
        console.log("Error getting document", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  updateIsNotReviewedListsLoading({commit}, isLoading) {
    commit('updateIsNotReviewedListsLoading', isLoading)
  },
  updateIsNotReviewedCompanyLoading({commit}, isLoading) {
    commit('updateIsNotReviewedCompanyLoading', isLoading)
  },
  // /user/career/:id/edit で呼び出し
  queryCareerDetail({commit}, {uid, careerId}) {
    firestore.collection('users')
      .doc(uid)
      .collection('career')
      .doc(careerId)
      .get()
      .then(doc => {
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
          endedAt = new Date( endedAt.seconds * 1000 )
          endedAt =
            String(endedAt.getFullYear()) + '-' +
            String(endedAt.getMonth() + 1) + '-' +
            String(endedAt.getDate())
        }
        commit('setOccupation', doc.data()['occupation'])
        commit('setJobDescription', doc.data()['jobDescription'])
        commit('setCompanyId', doc.data()['companyId'])
        commit('setCompanyName', doc.data()['companyName'])
        commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
        commit('setStartedAt', startedAt)
        commit('setEnd', doc.data()['end'])
        commit('setEndedAt', endedAt)
        commit('setIsInternExtended', doc.data()['isInternExtended'])
        commit('setExtendedInternEnd', doc.data()['extendedInternEnd'])
        commit('updateIsLoading', false)
      })
      .catch(error => {
        console.log("Error getting document", error)
        commit('updateIsLoading', false)
      })
  },
  updateCareer({commit}, {router, uid, careerId, newData}) {
    firestore.collection('users')
      .doc(uid)
      .collection('career')
      .doc(careerId)
      .update(newData)
      .then(() => {
        router.push('/user/career')
      })
      .catch(error => {
        console.log("Error updating document", error)
      })
  },
  resetState({commit}) {
    commit('setCareer', [])
    commit('setNotReviewedLists', null)
    commit('setNotReviewedCompany', null)
    commit('updateIsLoading', false)
    commit('updateIsNotReviewedListsLoading', false)
    commit('updateIsNotReviewedCompanyLoading', false)
    commit('setOccupation', '')
    commit('setJobDescription', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
    commit('setStartedAt', null)
    commit('setEnd', null)
    commit('setEndedAt', null)
    commit('setIsInternExtended', null)
    commit('setExtendedInternEnd', null)
  },
}
