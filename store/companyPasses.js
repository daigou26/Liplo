export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  hiringPassCount: null,
  yearPasses: [],
  isInitialLoading: false,
  isLoading: false,
  allPssesQueried: false,
})

export const mutations = {
  setHiringPassCount(state, count) {
    state.hiringPassCount = count
  },
  addPass(state, pass) {
    state.yearPasses.push(pass)
  },
  setYearPasses(state, yearPasses) {
    state.yearPasses = yearPasses
  },
  resetYearPasses(state) {
    state.yearPasses = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllYearPassesQueried(state) {
    state.allYearPassesQueried = true
  },
  resetAllYearPassesQueried(state) {
    state.allYearPassesQueried = false
  },
}

export const actions = {
  queryHiringPassCount({commit}, companyId) {
    firestore.collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          if (doc.data()['hiringPassCount']) {
            commit('setHiringPassCount', doc.data()['hiringPassCount'])
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  },
  queryYearPasses({commit, state}, companyId) {
    const yearPasses = state.yearPasses
    if (yearPasses.length == 0) {
      firestore.collection('companies')
        .doc(companyId)
        .collection('yearPasses')
        .orderBy('year', 'desc')
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            const pass = {
              year: doc.data()['year'],
              limit: doc.data()['limit'],
              count: doc.data()['count'],
            }
            commit('addPass', pass)
          })
          if (docCount == 0) {
            commit('setAllYearPassesQueried')
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (yearPasses.length != 0) {
      const lastIndex = yearPasses.length - 1
      const lastYear = yearPasses[lastIndex].year
      firestore.collection('companies')
        .doc(companyId)
        .collection('yearPasses')
        .orderBy('year', 'desc')
        .startAfter(lastYear)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1
            const pass = {
              year: doc.data()['year'],
              limit: doc.data()['limit'],
              count: doc.data()['count'],
            }
            commit('addPass', pass)
          })
          if (docCount == 0) {
            commit('setAllYearPassesQueried')
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    }
  },
  // 先着パスの上限更新
  updatePassLimit({commit, state}, {year, limit}) {
    var yearPasses = state.yearPasses
    yearPasses.forEach((pass, i) => {
      if (pass.year == year) {
        pass.limit = limit
      }
    })
    commit('setYearPasses', yearPasses)
  },
  // 新規年度追加
  addYear({commit, state}, {year, limit}) {
    var yearPasses = state.yearPasses
    var newYear = {
      count: {
        hiring: {
          used: 0
        },
        offer: {
          all: 0,
          used: 0
        },
        limited: {
          all: 0,
          used: 0
        }
      },
      year: year,
    }
    if (limit) {
      newYear.limit = limit
    }

    var isAdded = false
    yearPasses.forEach((pass, i) => {
      if (!isAdded && pass.year < year) {
        yearPasses.splice(i, 0, newYear)
        isAdded = true
      }
    })
    if (!isAdded) {
      yearPasses.push(newYear)
    }
    commit('setYearPasses', yearPasses)
  },
  updateIsInitialLoading({commit}, isLoading) {
    commit('updateIsInitialLoading', isLoading)
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setHiringPassCount', null)
    commit('resetYearPasses')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('resetAllYearPassesQueried')
  },
}
