export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  users: [],
  isLoading: false,
  allUsersQueried: false,
  engineer: false,
  designer: false,
  sales: false,
  others: false,
  toolbarExtension: false,
  loading: false,
})

export const mutations = {
  addUser(state, user) {
    state.users.push(user)
  },
  resetUsers(state) {
    state.users = []
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllUsersQueried(state) {
    state.allUsersQueried = true
  },
  resetAllUsersQueried(state) {
    state.allUsersQueried = false
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
  queryUsers({commit, state}, {queryParams, acceptScout}) {
    const users = state.users
    const occupationParams = queryParams.occupation

    var usersRef = firestore.collection('users')

    // occupation
    if (typeof occupationParams == 'string') {
      usersRef = usersRef.where(`desiredOccupations.${occupationParams}`, '==', true)
    }
    if (Array.isArray(occupationParams) && occupationParams.length == 1) {
      usersRef = usersRef.where(`desiredOccupations.${occupationParams[0]}`, '==', true)
    }
    // if (Array.isArray(occupationParams) && occupationParams.length > 1) {
    //   if (!occupationParams.includes('engineer')) {
    //     usersRef = usersRef.where('desiredOccupations.engineer', '==', false)
    //   }
    //   if (!occupationParams.includes('designer')) {
    //     usersRef = usersRef.where('desiredOccupations.designer', '==', false)
    //   }
    //   if (!occupationParams.includes('sales')) {
    //     usersRef = usersRef.where('desiredOccupations.sales', '==', false)
    //   }
    //   if (!occupationParams.includes('others')) {
    //     usersRef = usersRef.where('desiredOccupations.others', '==', false)
    //   }
    // }

    if (users.length == 0) {
      return usersRef
        .where('acceptScout', '==', true)
        .where('type', '==', 'user')
        .where('isDeleted', '==', false)
        .orderBy('points', 'desc')
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const user = {
              uid: doc.id,
              imageUrl: doc.data()['imageUrl'],
              firstName: doc.data()['firstName'],
              lastName: doc.data()['lastName'],
              hasPortfolio: doc.data()['hasPortfolio'],
              interestingFields: doc.data()['interestingFields'],
              desiredOccupations: doc.data()['desiredOccupations'],
              skills: doc.data()['skills'],
              points: doc.data()['points'],
            }
            commit('addUser', user)
          })
          if (docCount == 0) {
            commit('setAllUsersQueried')
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else {
      const lastIndex = users.length - 1
      const points = users[lastIndex].points
      return usersRef
        .where('acceptScout', '==', true)
        .where('type', '==', 'user')
        .where('isDeleted', '==', false)
        .orderBy('points', 'desc')
        .startAfter(points)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const user = {
              uid: doc.id,
              imageUrl: doc.data()['imageUrl'],
              firstName: doc.data()['firstName'],
              lastName: doc.data()['lastName'],
              hasPortfolio: doc.data()['hasPortfolio'],
              interestingFields: doc.data()['interestingFields'],
              desiredOccupations: doc.data()['desiredOccupations'],
              skills: doc.data()['skills'],
              points: doc.data()['points'],
            }
            commit('addUser', user)
          })
          if (docCount == 0) {
            commit('setAllUsersQueried')
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    }
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetUsers({commit}) {
    commit('resetUsers')
  },
  setFilter({commit}, queryParams) {
    const occupationParams = queryParams.occupation
    if (occupationParams != null) {
      commit('updateEngineer', occupationParams.includes('engineer'))
      commit('updateDesigner', occupationParams.includes('designer'))
      commit('updateSales', occupationParams.includes('sales'))
      commit('updateOthers', occupationParams.includes('others'))
    }
  },
  setToolbarExtension({commit}) {
    commit('setToolbarExtension')
  },
  resetToolbarExtension({commit}) {
    commit('resetToolbarExtension')
  },
  resetState({commit}) {
    commit('resetUsers')
    commit('updateIsLoading', false)
    commit('resetAllUsersQueried')
  },
}
