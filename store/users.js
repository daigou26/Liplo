export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  users: [],
  isInitialLoading: false,
  isLoading: false,
  allUsersQueried: false,
  engineer: false,
  designer: false,
  sales: false,
  marketer: false,
  planner: false,
  writer: false,
  others: false,
  toolbarExtension: false,
})

export const mutations = {
  addUser(state, user) {
    state.users.push(user)
  },
  resetUsers(state) {
    state.users = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
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
  updateMarketer(state, isActive) {
    state.marketer = isActive
  },
  updatePlanner(state, isActive) {
    state.planner = isActive
  },
  updateWriter(state, isActive) {
    state.writer = isActive
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
  queryUsers({commit, state}, queryParams) {
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

    if (users.length == 0) {
      usersRef
        .where('acceptScout', '==', true)
        .where('canSearch', '==', true)
        .where('type', '==', 'user')
        .where('isDeleted', '==', false)
        .orderBy('points', 'desc')
        .limit(20)
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
              selfIntro: doc.data()['selfIntro'],
              hasPortfolio: doc.data()['hasPortfolio'],
              desiredOccupations: doc.data()['desiredOccupations'],
              skills: doc.data()['skills'],
              points: doc.data()['points'],
              university: doc.data()['university'],
              faculty: doc.data()['faculty'],
              department: doc.data()['department'],
              grade: doc.data()['grade'],
              graduationYear: doc.data()['graduationYear'],
              completionPercentage: doc.data()['completionPercentage']
            }
            commit('addUser', user)
          })
          if (docCount == 0) {
            commit('setAllUsersQueried')
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else {
      const lastIndex = users.length - 1
      const points = users[lastIndex].points
      usersRef
        .where('acceptScout', '==', true)
        .where('canSearch', '==', true)
        .where('type', '==', 'user')
        .where('isDeleted', '==', false)
        .orderBy('points', 'desc')
        .startAfter(points)
        .limit(20)
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
              selfIntro: doc.data()['selfIntro'],
              hasPortfolio: doc.data()['hasPortfolio'],
              desiredOccupations: doc.data()['desiredOccupations'],
              skills: doc.data()['skills'],
              points: doc.data()['points'],
              university: doc.data()['university'],
              faculty: doc.data()['faculty'],
              department: doc.data()['department'],
              grade: doc.data()['grade'],
              graduationYear: doc.data()['graduationYear'],
              completionPercentage: doc.data()['completionPercentage']
            }
            commit('addUser', user)
          })
          if (docCount == 0) {
            commit('setAllUsersQueried')
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  updateIsInitialLoading({commit}, isLoading) {
    commit('updateIsInitialLoading', isLoading)
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
      commit('updateMarketer', occupationParams.includes('marketer'))
      commit('updatePlanner', occupationParams.includes('planner'))
      commit('updateWriter', occupationParams.includes('writer'))
      commit('updateOthers', occupationParams.includes('others'))
    } else {
      commit('updateEngineer', false)
      commit('updateDesigner', false)
      commit('updateSales', false)
      commit('updateMarketer', false)
      commit('updatePlanner', false)
      commit('updateWriter', false)
      commit('updateOthers', false)
    }
  },
  setToolbarExtension({commit}) {
    commit('setToolbarExtension')
  },
  resetToolbarExtension({commit}) {
    commit('resetToolbarExtension')
  },
  resetFilterState({commit}) {
    commit('updateEngineer', false)
    commit('updateDesigner', false)
    commit('updateSales', false)
    commit('updateMarketer', false)
    commit('updatePlanner', false)
    commit('updateWriter', false)
    commit('updateOthers', false)
  },
  resetState({commit}) {
    commit('resetUsers')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('resetAllUsersQueried')
  },
}
