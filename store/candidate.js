export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'

export const state = () => ({
  user: null,
  status: null,
  reviews: null,
  tags: null,
  type: null,
  jobId: null,
  isEditingTags: false,
  isLoading: true,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setStatus(state, status) {
    state.status = status
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setTags(state, tags) {
    state.tags = tags
  },
  setType(state, type) {
    state.type = type
  },
  setJobId(state, jobId) {
    state.jobId = jobId
  },
  updateIsEditingTags(state, isEditing) {
    state.isEditingTags = isEditing
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  queryCandidate({commit}, {nuxt, params, companyId}) {
    const candidateId = params.id
    firestore.collection('companies')
      .doc(companyId)
      .collection('candidates')
      .doc(candidateId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setUser', doc.data()['user'])
          commit('setStatus', doc.data()['status'])
          commit('setReviews', doc.data()['reviews'])
          commit('setTags', doc.data()['tags'])
          commit('setType', doc.data()['type'])
          commit('setJobId', doc.data()['jobId'])
          commit('updateIsLoading', false)

          if (doc.data()['status'].rejected || doc.data()['status'].hired) {
            commit('updateIsLoading', false)
            console.log('404')
            nuxt.error({ statusCode: 404, message: 'not found' })
          }
        } else {
          commit('updateIsLoading', false)
          console.log('404')
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
        nuxt.error({ statusCode: 404, message: 'not found' })
      })
  },
  updateIsEditingTags({commit}, isEditing) {
    commit('updateIsEditingTags', isEditing)
  },
  updateTags({commit}, {params, companyId, tags}) {
    const candidateId = params.id
    firestore.collection('companies').doc(companyId)
      .collection('candidates').doc(candidateId)
      .update({
        tags: tags,
      })
      .then(() => {
        commit('setTags', tags)
        commit('updateIsEditingTags', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateStatus({commit, state}, {
    router,
    params,
    companyId,
    newStatus,
    feedback,
    pass
  }) {
    const currentStatus = state.status
    const user = state.user
    const type = state.type
    const jobId = state.jobId
    const candidateId = params.id

    var candidateData = {
      status: newStatus,
      updatedAt: new Date()
    }

    if (newStatus.pass == true) {
      candidateData.pass = pass
    }
    if (currentStatus.intern == true && feedback) {
      candidateData.feedback = feedback
    }

    const batch = firestore.batch()
    const candidateRef = firestore.collection('companies').doc(companyId)
      .collection('candidates').doc(candidateId)
    batch.update(candidateRef, candidateData)

    var setData = false
    let ref
    if (newStatus.intern == true) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('interns').doc()
    } else if (newStatus.extendedIntern == true) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('extendedInterns').doc()
    } else if (newStatus.pass == true) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('passedUsers').doc()
    } else if (newStatus.contracted == true) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('contractedUsers').doc()
    } else if (newStatus.hired == true) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('hiredUsers').doc()
    }

    if (setData) {
      var data = {
        user: user,
        createdAt: new Date()
      }
      if (type != null) {
        data.type = type
      }
      if (jobId != null) {
        data.jobId = jobId
      }
      batch.set(ref, data)
    }

    batch.commit()
      .then(() => {
        if (newStatus.rejected || newStatus.hired) {
          router.replace({path: '/recruiter/candidates'})
        } else {
          commit('setStatus', newStatus)
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  resetState({commit}) {
    commit('setUser', null)
    commit('setStatus', null)
    commit('setReviews', null)
    commit('setTags', null)
    commit('setType', null)
    commit('setJobId', null)
    commit('updateIsEditingTags', false)
    commit('updateIsLoading', true)
  }
}
