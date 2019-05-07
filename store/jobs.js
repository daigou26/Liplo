export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  jobs: [],
  isInitialLoading: false,
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
  weekend: false,
  workweek: null,
  order: null,
  toolbarExtension: false,
})

export const mutations = {
  addJob(state, job) {
    state.jobs.push(job)
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
  updateWeekend(state, isActive) {
    state.weekend = isActive
  },
  setWorkweek(state, workweek) {
    state.workweek = workweek
  },
  setOrder(state, order) {
    state.order = order
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
    const workweekParams = queryParams.workweek
    const orderParams = queryParams.order

    var jobsRef = firestore.collection('jobs').where('status', '==', 'published')

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
      if (featuresParams.includes('weekend')) {
        jobsRef = jobsRef.where('features.weekend', '==', true)
      }
    }

    // 勤務日数
    if (workweekParams != null) {
      if (workweekParams == '1') {
        jobsRef = jobsRef.where('workweek.days.one', '==', true)
      } else if (workweekParams == '2') {
        jobsRef = jobsRef.where('workweek.days.three', '==', false)
        jobsRef = jobsRef.where('workweek.days.four', '==', false)
        jobsRef = jobsRef.where('workweek.days.five', '==', false)
      } else if (workweekParams == '3') {
        jobsRef = jobsRef.where('workweek.days.four', '==', false)
        jobsRef = jobsRef.where('workweek.days.five', '==', false)
      } else if (workweekParams == '4') {
        jobsRef = jobsRef.where('workweek.days.five', '==', false)
      }
    }

    // 並び替え
    if (orderParams == null) {
      jobsRef = jobsRef.orderBy('createdAt', 'desc')
    } else if (orderParams == 'rating') {
      jobsRef = jobsRef.orderBy('points', 'desc')
    }

    if (jobs.length == 0) {
      jobsRef.limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
            let currentDate = new Date()

            var timestamp = Math.floor((currentDate - createdAt) / 3600000)
            if (timestamp < 24) {
              if (timestamp <= 1) {
                timestamp = '1時間以内'
              } else {
                timestamp = String(timestamp) + '時間前'
              }
            } else {
              timestamp = Math.floor((currentDate - createdAt) / 86400000)
              if (timestamp < 31) {
                timestamp = String(timestamp) + '日前'
              } else {
                timestamp = Math.floor((currentDate - createdAt) / (86400000 * 31))
                if (timestamp <= 11) {
                  timestamp = String(timestamp) + 'ヶ月前'
                } else {
                  timestamp = '1年以上前'
                }
              }
            }

            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              content: doc.data()['content'],
              imageUrl: doc.data()['imageUrl'],
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              occupation: doc.data()['occupation'],
              period: doc.data()['period'],
              workday: doc.data()['workday'],
              rating: doc.data()['rating'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried', true)
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

      jobsRef.startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
            let currentDate = new Date()

            var timestamp = Math.floor((currentDate - createdAt) / 3600000)
            if (timestamp < 24) {
              if (timestamp <= 1) {
                timestamp = '1時間以内'
              } else {
                timestamp = String(timestamp) + '時間前'
              }
            } else {
              timestamp = Math.floor((currentDate - createdAt) / 86400000)
              if (timestamp < 31) {
                timestamp = String(timestamp) + '日前'
              } else {
                timestamp = Math.floor((currentDate - createdAt) / (86400000 * 31))
                if (timestamp <= 11) {
                  timestamp = String(timestamp) + 'ヶ月前'
                } else {
                  timestamp = '1年以上前'
                }
              }
            }

            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              content: doc.data()['content'],
              imageUrl: doc.data()['imageUrl'],
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              occupation: doc.data()['occupation'],
              period: doc.data()['period'],
              workday: doc.data()['workday'],
              rating: doc.data()['rating'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  queryCompanyJobs({commit, state}, companyId) {
    const jobs = state.jobs

    if (jobs == null || jobs.length == 0) {
      firestore.collection('jobs')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
            let currentDate = new Date()

            var timestamp = Math.floor((currentDate - createdAt) / 3600000)
            if (timestamp < 24) {
              if (timestamp <= 1) {
                timestamp = '1時間以内'
              } else {
                timestamp = String(timestamp) + '時間前'
              }
            } else {
              timestamp = Math.floor((currentDate - createdAt) / 86400000)
              if (timestamp < 31) {
                timestamp = String(timestamp) + '日前'
              } else {
                timestamp = Math.floor((currentDate - createdAt) / (86400000 * 31))
                if (timestamp <= 11) {
                  timestamp = String(timestamp) + 'ヶ月前'
                } else {
                  timestamp = '1年以上前'
                }
              }
            }

            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              content: doc.data()['content'],
              imageUrl: doc.data()['imageUrl'],
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              occupation: doc.data()['occupation'],
              period: doc.data()['period'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried', true)
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

      firestore.collection('jobs')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
            let currentDate = new Date()

            var timestamp = Math.floor((currentDate - createdAt) / 3600000)
            if (timestamp < 24) {
              if (timestamp <= 1) {
                timestamp = '1時間以内'
              } else {
                timestamp = String(timestamp) + '時間前'
              }
            } else {
              timestamp = Math.floor((currentDate - createdAt) / 86400000)
              if (timestamp < 31) {
                timestamp = String(timestamp) + '日前'
              } else {
                timestamp = Math.floor((currentDate - createdAt) / (86400000 * 31))
                if (timestamp <= 11) {
                  timestamp = String(timestamp) + 'ヶ月前'
                } else {
                  timestamp = '1年以上前'
                }
              }
            }

            const job = {
              jobId: doc.id,
              title: doc.data()['title'],
              content: doc.data()['content'],
              imageUrl: doc.data()['imageUrl'],
              companyId: doc.data()['companyId'],
              companyName: doc.data()['companyName'],
              companyImageUrl: doc.data()['companyImageUrl'],
              occupation: doc.data()['occupation'],
              period: doc.data()['period'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addJob', job)
          })
          if (docCount == 0) {
            commit('setAllJobsQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  setFilter({commit}, queryParams) {
    const occupationParams = queryParams.occupation
    const featuresParams = queryParams.features
    const workweekParams = queryParams.workweek

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
      commit('updateWeekend', featuresParams.includes('weekend'))
    }
    if (workweekParams != null) {
      commit('setWorkweek', workweekParams)
    } else {
      commit('setWorkweek', null)
    }
  },
  setOrder({commit}, queryParams) {
    const orderParams = queryParams.order
    if (orderParams == null) {
      commit('setOrder', 'recent')
    } else if (orderParams == 'rating') {
      commit('setOrder', 'rating')
    }
  },
  setToolbarExtension({commit}) {
    commit('setToolbarExtension')
  },
  resetToolbarExtension({commit}) {
    commit('resetToolbarExtension')
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
    commit('setAllJobsQueried', false)
    commit('updateEngineer', false)
    commit('updateDesigner', false)
    commit('updateSales', false)
    commit('updateOthers', false)
    commit('updateExperience', false)
    commit('updateFunding', false)
    commit('updateFounder20s', false)
    commit('updateMedia', false)
    commit('updateFriend', false)
    commit('updateOverseas', false)
    commit('updateWeekend', false)
    commit('setWorkweek', null)
    commit('setOrder', null)
  },
}
