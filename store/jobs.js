export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  jobs: null,
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
  loading: false,
})

export const mutations = {
  // jobs
  setJobs(state, jobs) {
    state.jobs = jobs
  },
  addJob(state, job) {
    state.jobs.push(job)
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
  // loading
  updateLoading(state, isLoading) {
    state.loading = isLoading
  }
}

export const actions = {
  queryJobs({commit}, queryParams) {
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
    return jobsRef.orderBy('createdAt', 'desc').limit(10).get()
      .then(function(snapshot) {
        const data = []
        snapshot.forEach(function(doc) {
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
          data.push(job)
        })
        commit('setJobs', data)
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  },
  addJobs({commit}, {queryParams, jobs}) {
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
    const lastIndex = jobs.length - 1
    const lastDate = jobs[lastIndex].createdAt
    return jobsRef.orderBy('createdAt', 'desc').startAfter(lastDate).limit(10).get()
      .then(function(snapshot) {
        snapshot.forEach(function(doc) {
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
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
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
}
