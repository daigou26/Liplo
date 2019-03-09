export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  reviews: null,
})

export const mutations = {
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  addReview(state, review) {
    state.reviews.push(review)
  },
}

export const actions = {
  queryReviews({commit}, {companyId, reviews}) {
    if (reviews == null) {
      return firestore.collection('reviews')
        .where('companyId', '==', companyId)
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
}
