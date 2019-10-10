export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  jobs: [],
  isInitialLoading: false,
  isLoading: false,
  allJobsQueried: false,
})

export const mutations = {
  addJob(state, job) {
    state.jobs.push(job)
  },
  addNewJob(state, job) {
    state.jobs.unshift(job)
  },
  updateJob(state, updatedJob) {
    // 更新前の募集を除外
    state.jobs = state.jobs.filter(job => job.jobId != updatedJob.jobId)
    // 先頭に更新した募集を追加
    state.jobs.unshift(updatedJob)
  },
  resetJobs(state) {
    state.jobs = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllJobsQueried(state) {
    state.allJobsQueried = true
  },
  resetAllJobsQueried(state) {
    state.allJobsQueried = false
  },
}

export const actions = {
  queryJobs({commit, state}, companyId) {
    const jobs = state.jobs
    if (jobs.length == 0) {
      return firestore.collection('jobs')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            let timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              imageUrl: doc.data()['imageUrl'],
              status: doc.data()['status'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried')
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (jobs.length != 0) {
      const lastIndex = jobs.length - 1
      const lastDate = jobs[lastIndex].createdAt
      return firestore.collection('jobs')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            let timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              imageUrl: doc.data()['imageUrl'],
              status: doc.data()['status'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried')
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  addJob({commit}, job) {
    commit('addNewJob', job)
  },
  updateJob({commit, state}, updatedJob) {
    commit('updateJob', updatedJob)
  },
  updateIsInitialLoading({commit}, isLoading) {
    commit('updateIsInitialLoading', isLoading)
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('resetJobs')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('resetAllJobsQueried')
  },
}
