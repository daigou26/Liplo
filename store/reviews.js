export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  // 募集で表示するレビュー
  jobReviews: [],
  isInitialJobReviewsLoading: false,
  isJobReviewsLoading: false,
  allJobReviewsQueried: false,
  // 企業に対するレビュー
  companyReviews: [],
  isInitialCompanyReviewsLoading: false,
  isCompanyReviewsLoading: false,
  allCompanyReviewsQueried: false,
  // ユーザーが記入したレビュー
  userReviews: [],
  isInitialUserReviewsLoading: false,
  isUserReviewsLoading: false,
  allUserReviewsQueried: false,
})

export const mutations = {
  addJobReview(state, review) {
    state.jobReviews.push(review)
  },
  resetJobReviews(state) {
    state.jobReviews = []
  },
  updateIsInitialJobReviewsLoading(state, isLoading) {
    state.isInitialJobReviewsLoading = isLoading
  },
  updateIsJobReviewsLoading(state, isLoading) {
    state.isJobReviewsLoading = isLoading
  },
  setAllJobReviewsQueried(state, allJobReviewsQueried) {
    state.allJobReviewsQueried = allJobReviewsQueried
  },
  addCompanyReview(state, review) {
    state.companyReviews.push(review)
  },
  resetCompanyReviews(state) {
    state.companyReviews = []
  },
  updateIsInitialCompanyReviewsLoading(state, isLoading) {
    state.isInitialCompanyReviewsLoading = isLoading
  },
  updateIsCompanyReviewsLoading(state, isLoading) {
    state.isCompanyReviewsLoading = isLoading
  },
  setAllCompanyReviewsQueried(state, allCompanyReviewsQueried) {
    state.allCompanyReviewsQueried = allCompanyReviewsQueried
  },
  addUserReview(state, review) {
    state.userReviews.push(review)
  },
  resetUserReviews(state) {
    state.userReviews = []
  },
  updateIsInitialUserReviewsLoading(state, isLoading) {
    state.isInitialUserReviewsLoading = isLoading
  },
  updateIsUserReviewsLoading(state, isLoading) {
    state.isUserReviewsLoading = isLoading
  },
  setAllUserReviewsQueried(state, allUserReviewsQueried) {
    state.allUserReviewsQueried = allUserReviewsQueried
  }
}

export const actions = {
  // 募集に表示するレビューをクエリ
  queryJobReviews({commit, state}, companyId) {
    const reviews = state.jobReviews
    if (reviews.length == 0) {
      firestore.collection('reviews')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const review = {
              reviewId: doc.id,
              uid: doc.data()['uid'],
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              atmosphere: doc.data()['atmosphere'],
              job: doc.data()['job'],
              discretion: doc.data()['discretion'],
              workingHours: doc.data()['workingHours'],
              environment: doc.data()['environment'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addJobReview', review)
          })
          if (docCount == 0) {
            commit('setAllJobReviewsQueried', true)
          }
          commit('updateIsInitialJobReviewsLoading', false)
          commit('updateIsJobReviewsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialJobReviewsLoading', false)
          commit('updateIsJobReviewsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (reviews.length != 0) {
      const lastIndex = reviews.length - 1
      const lastDate = reviews[lastIndex].createdAt
      firestore.collection('reviews')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const review = {
              reviewId: doc.id,
              uid: doc.data()['uid'],
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              atmosphere: doc.data()['atmosphere'],
              job: doc.data()['job'],
              discretion: doc.data()['discretion'],
              workingHours: doc.data()['workingHours'],
              environment: doc.data()['environment'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addJobReview', review)
          })
          if (docCount == 0) {
            commit('setAllJobReviewsQueried', true)
          }
          commit('updateIsJobReviewsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsJobReviewsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  updateIsInitialJobReviewsLoading({commit}, isLoading) {
    commit('updateIsInitialJobReviewsLoading', isLoading)
  },
  updateIsJobReviewsLoading({commit}, isLoading) {
    commit('updateIsJobReviewsLoading', isLoading)
  },
  // 企業に対するレビューをクエリ
  queryCompanyReviews({commit, state}, companyId) {
    const reviews = state.companyReviews
    if (reviews.length == 0) {
      firestore.collection('reviews')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const review = {
              reviewId: doc.id,
              uid: doc.data()['uid'],
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              atmosphere: doc.data()['atmosphere'],
              job: doc.data()['job'],
              discretion: doc.data()['discretion'],
              workingHours: doc.data()['workingHours'],
              environment: doc.data()['environment'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addCompanyReview', review)
          })
          if (docCount == 0) {
            commit('setAllCompanyReviewsQueried', true)
          }
          commit('updateIsInitialCompanyReviewsLoading', false)
          commit('updateIsCompanyReviewsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialCompanyReviewsLoading', false)
          commit('updateIsCompanyReviewsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (reviews.length != 0) {
      const lastIndex = reviews.length - 1
      const lastDate = reviews[lastIndex].createdAt
      firestore.collection('reviews')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }

            const review = {
              reviewId: doc.id,
              uid: doc.data()['uid'],
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              atmosphere: doc.data()['atmosphere'],
              job: doc.data()['job'],
              discretion: doc.data()['discretion'],
              workingHours: doc.data()['workingHours'],
              environment: doc.data()['environment'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addCompanyReview', review)
          })
          if (docCount == 0) {
            commit('setAllCompanyReviewsQueried', true)
          }
          commit('updateIsCompanyReviewsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsCompanyReviewsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  updateIsInitialCompanyReviewsLoading({commit}, isLoading) {
    commit('updateIsInitialCompanyReviewsLoading', isLoading)
  },
  updateIsCompanyReviewsLoading({commit}, isLoading) {
    commit('updateIsCompanyReviewsLoading', isLoading)
  },
  // ユーザーが記入したレビュー
  queryUserReviews({commit, state}, uid) {
    const reviews = state.userReviews

    if (reviews.length == 0) {
      return firestore.collection('reviews')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            var timestamp = doc.data()['createdAt']
            if (timestamp) {
              let date = new Date( timestamp.seconds * 1000 )
              let year  = date.getFullYear()
              let month = date.getMonth() + 1
              let day  = date.getDate()
              timestamp = `${year}/${month}/${day}`
            }
            const review = {
              reviewId: doc.id,
              companyId: doc.data()['companyId'],
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp
            }
            commit('addUserReview', review)
          })
          if (docCount == 0) {
            commit('setAllUserReviewsQueried',true)
          }
          commit('updateIsInitialUserReviewsLoading', false)
          commit('updateIsUserReviewsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialUserReviewsLoading', false)
          commit('updateIsUserReviewsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (reviews.length != 0) {
      const lastIndex = reviews.length - 1
      const lastDate = reviews[lastIndex].createdAt
      return firestore.collection('reviews')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0

          var timestamp = doc.data()['createdAt']
          if (timestamp) {
            let date = new Date( timestamp.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            timestamp = `${year}/${month}/${day}`
          }
          snapshot.forEach(function(doc) {
            docCount += 1
            const review = {
              reviewId: doc.id,
              companyId: doc.data()['companyId'],
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp
            }
            commit('addUserReview', review)
          })
          if (docCount == 0) {
            commit('setAllUserReviewsQueried', true)
          }
          commit('updateIsUserReviewsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsUserReviewsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  updateIsInitialUserReviewsLoading({commit}, isLoading) {
    commit('updateIsInitialUserReviewsLoading', isLoading)
  },
  updateIsUserReviewsLoading({commit}, isLoading) {
    commit('updateIsUserReviewsLoading', isLoading)
  },
  resetJobReviewsState({commit}) {
    commit('resetJobReviews')
    commit('updateIsInitialJobReviewsLoading', false)
    commit('updateIsJobReviewsLoading', false)
    commit('setAllJobReviewsQueried', false)
  },
  resetCompanyReviewsState({commit}) {
    commit('resetCompanyReviews')
    commit('updateIsInitialCompanyReviewsLoading', false)
    commit('updateIsCompanyReviewsLoading', false)
    commit('setAllCompanyReviewsQueried', false)
  },
  resetUserReviewsState({commit}) {
    commit('resetUserReviews')
    commit('updateIsInitialUserReviewsLoading', false)
    commit('updateIsUserReviewsLoading', false)
    commit('setAllUserReviewsQueried', false)
  },
}
