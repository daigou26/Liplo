export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  companies: [],
  isInitialLoading: false,
  isLoading: false,
  allCompaniesQueried: false,
})

export const mutations = {
  addCompany(state, company) {
    state.companies.push(company)
  },
  resetCompanies(state) {
    state.companies = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllCompaniesQueried(state, allCompaniesQueried) {
    state.allCompaniesQueried = allCompaniesQueried
  }
}

export const actions = {
  queryCompanies({commit, state}) {
    const companies = state.companies

    if (companies.length == 0) {
      firestore.collection('companies')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const company = {
              companyId: doc.id,
              imageUrl: doc.data()['imageUrl'],
              companyName: doc.data()['companyName'],
              createdAt: doc.data()['createdAt'],
              isDeleted: doc.data()['isDeleted'],
            }

            commit('addCompany', company)
          })
          if (docCount == 0) {
            commit('setAllCompaniesQueried', true)
          }

          // loading
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (companies.length != 0) {
      const lastIndex = companies.length - 1
      const lastDate = companies[lastIndex].createdAt
      firestore.collection('companies')
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const company = {
              companyId: doc.id,
              imageUrl: doc.data()['imageUrl'],
              companyName: doc.data()['companyName'],
              createdAt: doc.data()['createdAt'],
              isDeleted: doc.data()['isDeleted'],
            }
            commit('addCompany', company)
          })
          if (docCount == 0) {
            commit('setAllCompaniesQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  searchCompanies({commit, state}, searchText) {
    const companies = state.companies

    if (companies.length == 0) {
      // 最初の20件だけクエリ
      firestore.collection('companies')
        .orderBy('companyName')
        .startAt(searchText)
        .endAt(searchText + "\uf8ff")
        .limit(20)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const company = {
              companyId: doc.id,
              imageUrl: doc.data()['imageUrl'],
              companyName: doc.data()['companyName'],
              createdAt: doc.data()['createdAt'],
              isDeleted: doc.data()['isDeleted'],
            }
            commit('addCompany', company)
          })
          // loading
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
  resetState({commit}) {
    commit('resetCompanies')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('setAllCompaniesQueried', false)
  },
}
