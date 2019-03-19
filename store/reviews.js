export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  reviews: null,
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
  addUserReview(state, review) {
    state.userReviews.push(review)
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
        .limit(2)
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
        .limit(2)
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
  queryUserReviews({commit}, {uid, reviews}) {
    if (reviews.length == 0) {
      return firestore.collection('reviews')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(2)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            console.log(doc.data())
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
        .limit(2)
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
}
