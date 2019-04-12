export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  jobs: [],
  isLoading: false,
  allJobsQueried: false,
  engineer: false,
  designer: false,
  sales: false,
  others: false,
  experience: false,
  funding: false,
  founder20s: false,
  media: false,
  friend: false,
  overseas: false,
  toolbarExtension: false,
})

export const mutations = {
  addJob(state, job) {
    state.jobs.push(job)
  },
  resetJobs(state) {
    state.jobs = []
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllJobsQueried(state, allJobsQueried) {
    state.allJobsQueried = allJobsQueried
  },
  // occupation
  updateEngineer(state, isActive) {
    state.engineer = isActive
  },
  updateDesigner(state, isActive) {
    state.designer = isActive
  },
  updateSales(state, isActive) {
    state.sales = isActive
  },
  updateOthers(state, isActive) {
    state.others = isActive
  },
  // features
  updateExperience(state, isActive) {
    state.experience = isActive
  },
  updateFunding(state, isActive) {
    state.funding = isActive
  },
  updateFounder20s(state, isActive) {
    state.founder20s = isActive
  },
  updateMedia(state, isActive) {
    state.media = isActive
  },
  updateFriend(state, isActive) {
    state.friend = isActive
  },
  updateOverseas(state, isActive) {
    state.overseas = isActive
  },
  // toolbar extension
  setToolbarExtension(state) {
    state.toolbarExtension = true
  },
  resetToolbarExtension(state) {
    state.toolbarExtension = false
  },
}

export const actions = {
  queryJobs({commit, state}, queryParams) {
    const jobs = state.jobs
    const occupationParams = queryParams.occupation
    const featuresParams = queryParams.features

    var jobsRef = firestore.collection('jobs')

    // occupation
    if (typeof occupationParams == 'string') {
      jobsRef = jobsRef.where(`occupation.${occupationParams}`, '==', true)
    }
    if (Array.isArray(occupationParams) && occupationParams.length == 1) {
      jobsRef = jobsRef.where(`occupation.${occupationParams[0]}`, '==', true)
    }
    if (Array.isArray(occupationParams) && occupationParams.length > 1) {
      if (!occupationParams.includes('engineer')) {
        jobsRef = jobsRef.where('occupation.engineer', '==', false)
      }
      if (!occupationParams.includes('designer')) {
        jobsRef = jobsRef.where('occupation.designer', '==', false)
      }
      if (!occupationParams.includes('sales')) {
        jobsRef = jobsRef.where('occupation.sales', '==', false)
      }
      if (!occupationParams.includes('others')) {
        jobsRef = jobsRef.where('occupation.others', '==', false)
      }
    }

    // features
    if (typeof featuresParams == 'string') {
      jobsRef = jobsRef.where(`features.${featuresParams}`, '==', true)
    }
    if (Array.isArray(featuresParams) && featuresParams.length == 1) {
      jobsRef = jobsRef.where(`features.${featuresParams[0]}`, '==', true)
    }
    if (Array.isArray(featuresParams) && featuresParams.length > 1) {
      if (featuresParams.includes('experience')) {
        jobsRef = jobsRef.where('features.experience', '==', true)
      }
      if (featuresParams.includes('funding')) {
        jobsRef = jobsRef.where('features.funding', '==', true)
      }
      if (featuresParams.includes('founder20s')) {
        jobsRef = jobsRef.where('features.founder20s', '==', true)
      }
      if (featuresParams.includes('media')) {
        jobsRef = jobsRef.where('features.media', '==', true)
      }
      if (featuresParams.includes('friend')) {
        jobsRef = jobsRef.where('features.friend', '==', true)
      }
      if (featuresParams.includes('overseas')) {
        jobsRef = jobsRef.where('features.overseas', '==', true)
      }
    }

    if (jobs.length == 0) {
      jobsRef.orderBy('createdAt', 'desc')
        .limit(2)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              content: doc.data()['content'],
              imageUrl: doc.data()['imageUrl'],
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              rating: doc.data()['rating'],
              createdAt: doc.data()['createdAt']
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else if (jobs.length != 0) {
      const lastIndex = jobs.length - 1
      const lastDate = jobs[lastIndex].createdAt

      jobsRef.orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(2)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              content: doc.data()['content'],
              imageUrl: doc.data()['imageUrl'],
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              rating: doc.data()['rating'],
              createdAt: doc.data()['createdAt']
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    }
  },
  setFilter({commit}, queryParams) {
    const occupationParams = queryParams.occupation
    const featuresParams = queryParams.features
    if (occupationParams != null) {
      commit('updateEngineer', occupationParams.includes('engineer'))
      commit('updateDesigner', occupationParams.includes('designer'))
      commit('updateSales', occupationParams.includes('sales'))
      commit('updateOthers', occupationParams.includes('others'))
    }
    if (featuresParams != null) {
      commit('updateExperience', featuresParams.includes('experience'))
      commit('updateFunding', featuresParams.includes('funding'))
      commit('updateFounder20s', featuresParams.includes('founder20s'))
      commit('updateMedia', featuresParams.includes('media'))
      commit('updateFriend', featuresParams.includes('friend'))
      commit('updateOverseas', featuresParams.includes('overseas'))
    }
  },
  setToolbarExtension({commit}) {
    commit('setToolbarExtension')
  },
  resetToolbarExtension({commit}) {
    commit('resetToolbarExtension')
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('resetJobs')
    commit('updateIsLoading', false)
    commit('setAllJobsQueried', false)
  },
}
