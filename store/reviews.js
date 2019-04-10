export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  reviews: null,
  companyReviews: [],
  isCompanyReviewsLoading: false,
  allCompanyReviewsQueried: false,
  userReviews: [],
  isUserReviewsLoading: false,
  allUserReviewsQueried: false,
})

export const mutations = {
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  addReview(state, review) {
    state.reviews.push(review)
  },
  addCompanyReview(state, review) {
    state.companyReviews.push(review)
  },
  resetCompanyReviews(state) {
    state.companyReviews = []
  },
  updateIsCompanyReviewsLoading(state, isLoading) {
    state.iscompanyReviewsLoading = isLoading
  },
  setAllCompanyReviewsQueried(state) {
    state.allcompanyReviewsQueried = true
  },
  addUserReview(state, review) {
    state.userReviews.push(review)
  },
  resetUserReviews(state) {
    state.userReviews = []
  },
  updateUserReviewsLoading(state, isLoading) {
    state.isUserReviewsLoading = isLoading
  },
  setAllUserReviewsQueried(state) {
    state.allUserReviewsQueried = true
  }
}

export const actions = {
  queryReviews({commit}, {companyId, reviews}) {
    if (reviews == null) {
      return firestore.collection('reviews')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then(function(snapshot) {
          const data = []
          snapshot.forEach(function(doc) {
            const review = {
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              createdAt: doc.data()['createdAt']
            }
            data.push(review)
          })
          commit('setReviews', data)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else if (reviews.length != 0) {
      const lastIndex = reviews.length - 1
      const lastDate = reviews[lastIndex].createdAt
      return firestore.collection('reviews')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(function(doc) {
            const review = {
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              createdAt: doc.data()['createdAt']
            }
            commit('addReview', review)
          })
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    }
  },
  queryCompanyReviews({commit, state}, companyId) {
    const reviews = state.companyReviews
    if (reviews.length == 0) {
      return firestore.collection('reviews')
        .where('companyId', '==', companyId)
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
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              atmosphere: doc.data()['atmosphere'],
              job: doc.data()['job'],
              discretion: doc.data()['discretion'],
              flexibleSchedule: doc.data()['flexibleSchedule'],
              flexibility: doc.data()['flexibility'],
              mentor: doc.data()['mentor'],
              growth: doc.data()['growth'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addCompanyReview', review)
          })
          if (docCount == 0) {
            commit('setAllCompanyReviewsQueried')
          }
          commit('updateIsCompanyReviewsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else if (reviews.length != 0) {
      const lastIndex = reviews.length - 1
      const lastDate = reviews[lastIndex].createdAt
      return firestore.collection('reviews')
        .where('companyId', '==', companyId)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
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
              all: doc.data()['all'],
              content: doc.data()['content'],
              occupation: doc.data()['occupation'],
              atmosphere: doc.data()['atmosphere'],
              job: doc.data()['job'],
              discretion: doc.data()['discretion'],
              flexibleSchedule: doc.data()['flexibleSchedule'],
              flexibility: doc.data()['flexibility'],
              mentor: doc.data()['mentor'],
              growth: doc.data()['growth'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp,
            }
            commit('addCompanyReview', review)
          })
          if (docCount == 0) {
            commit('setAllCompanyReviewsQueried')
          }
          commit('updateIsCompanyReviewsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    }
  },
  updateIsCompanyReviewsLoading({commit}, isLoading) {
    commit('updateIsCompanyReviewsLoading', isLoading)
  },
  queryUserReviews({commit}, {uid, reviews}) {
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
            const review = {
              reviewId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              all: doc.data()['all'],
              createdAt: doc.data()['createdAt']
            }
            commit('addUserReview', review)
          })
          if (docCount == 0) {
            commit('setAllUserReviewsQueried')
          }
          commit('updateUserReviewsLoading', false)
        })
        .catch(function(error) {
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
          snapshot.forEach(function(doc) {
            docCount += 1
            const review = {
              reviewId: doc.id,
              companyImageUrl: doc.data()['companyImageUrl'],
              companyName: doc.data()['companyName'],
              all: doc.data()['all'],
              createdAt: doc.data()['createdAt']
            }
            commit('addUserReview', review)
          })
          if (docCount == 0) {
            commit('setAllUserReviewsQueried')
          }
          commit('updateUserReviewsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    }
  },
  updateUserReviewsLoading({commit}, isLoading) {
    commit('updateUserReviewsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setReviews', null)
    commit('resetCompanyReviews')
    commit('updateIsCompanyReviewsLoading', false)
    commit('setAllCompanyReviewsQueried', false)
    commit('resetUserReviews')
    commit('updateUserReviewsLoading', false)
    commit('setAllUserReviewsQueried', false)
  },
}
