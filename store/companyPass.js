export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  addYearError: '',
})

export const mutations = {
  setAddYearError(state, error) {
    state.addYearError = error
  },
}

export const actions = {
  addYear({commit, dispatch}, {companyId, year, limit}) {
    firestore.collection('companies')
      .doc(companyId)
      .collection('yearPasses')
      .doc(String(year))
      .get()
      .then(doc => {
        // 年度が存在するかどうか
        if (doc.exists) {
          // 存在する場合、ユーザーに知らせる
          commit('setAddYearError', 'すでにこの年度は作成されています')
        } else {
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
            year: year
          }
          if (limit) {
            newYear.limit = limit
          }

          firestore.collection('companies')
            .doc(companyId)
            .collection('yearPasses')
            .doc(String(year))
            .set(newYear)
            .then(() => {
              dispatch('companyPasses/addYear', {year: year, limit: limit}, { root: true })
              commit('setAddYearError', null)
            })
            .catch(function(error) {
              commit('setAddYearError', 'エラーが発生しました')
              console.log("Error updating document:", error)
            })
        }
      })
      .catch(function(error) {
        commit('setAddYearError', 'エラーが発生しました')
        console.log("Error getting document:", error)
      })
  },
  updatePassLimit({commit, dispatch}, {companyId, year, limit}) {
    firestore.collection('companies')
      .doc(companyId)
      .collection('yearPasses')
      .doc(String(year))
      .update({
        limit: limit
      })
      .then(() => {
        dispatch('companyPasses/updatePassLimit', {year: year, limit: limit}, { root: true })
      })
      .catch(function(error) {
        console.log("Error updating document:", error)
      })
  },
  resetAddYearError({commit}) {
    commit('setAddYearError', '')
  },
}
