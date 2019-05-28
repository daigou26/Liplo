export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  inquiries: [],
  isInitialLoading: false,
  isLoading: false,
  allInquiriesQueried: false,
})

export const mutations = {
  addInquiry(state, inquiry) {
    state.inquiries.push(inquiry)
  },
  resetInquiries(state) {
    state.inquiries = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllInquiriesQueried(state, allInquiriesQueried) {
    state.allInquiriesQueried = allInquiriesQueried
  },
}

export const actions = {
  searchInquiries({commit, state}, searchText) {
    const inquiries = state.inquiries

    if (inquiries.length == 0) {
      // 最初の20件だけクエリ
      firestore.collection('inquiries')
        .orderBy('companyName')
        .startAt(searchText)
        .endAt(searchText + "\uf8ff")
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

            const inquiry = {
              inquiryId: doc.id,
              companyEmail: doc.data()['companyEmail'],
              companyName: doc.data()['companyName'],
              userName: doc.data()['userName'],
              email: doc.data()['email'],
              position: doc.data()['position'],
              type: doc.data()['type'],
              content: doc.data()['content'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp
            }
            commit('addInquiry', inquiry)
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
  queryInquiries({commit, state}) {
    const inquiries = state.inquiries

    if (inquiries.length == 0) {
      firestore.collection('inquiries')
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

            const inquiry = {
              inquiryId: doc.id,
              companyEmail: doc.data()['companyEmail'],
              companyName: doc.data()['companyName'],
              userName: doc.data()['userName'],
              email: doc.data()['email'],
              position: doc.data()['position'],
              type: doc.data()['type'],
              content: doc.data()['content'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp
            }
            commit('addInquiry', inquiry)
          })
          if (docCount == 0) {
            commit('setAllInquiriesQueried', true)
          }
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
          console.log("Error getting document:", error);
        })
    } else if (inquiries.length != 0) {
      const lastIndex = inquiries.length - 1
      const lastDate = inquiries[lastIndex].createdAt

      firestore.collection('inquiries')
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

            const inquiry = {
              inquiryId: doc.id,
              companyEmail: doc.data()['companyEmail'],
              companyName: doc.data()['companyName'],
              userName: doc.data()['userName'],
              email: doc.data()['email'],
              position: doc.data()['position'],
              type: doc.data()['type'],
              content: doc.data()['content'],
              createdAt: doc.data()['createdAt'],
              timestamp: timestamp
            }
            commit('addInquiry', inquiry)
          })
          if (docCount == 0) {
            commit('setAllInquiriesQueried', true)
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
  resetState({commit}) {
    commit('resetInquiries')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('setAllInquiriesQueried', false)
  },
}
