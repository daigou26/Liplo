export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  uid: null,
  profileImageUrl: null,
  userName: null,
  companyId: null,
  companyImageUrl: null,
  companyName: null,
  goodPoint: '',
  advice: '',
  createdAt: null,
  timestamp: null,
})

export const mutations = {
  setUid(state, uid) {
    state.uid = uid
  },
  setProfileImageUrl(state, profileImageUrl) {
    state.profileImageUrl = profileImageUrl
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  setCompanyId(state, companyId) {
    state.companyId = companyId
  },
  setCompanyImageUrl(state, companyImageUrl) {
    state.companyImageUrl = companyImageUrl
  },
  setCompanyName(state, companyName) {
    state.companyName = companyName
  },
  setGoodPoint(state, goodPoint) {
    state.goodPoint = goodPoint
  },
  setAdvice(state, advice) {
    state.advice = advice
  },
  setCreatedAt(state, createdAt) {
    state.createdAt = createdAt
  },
  setTimestamp(state, timestamp) {
    state.timestamp = timestamp
  }
}

export const actions = {
  queryFeedback({commit}, {nuxt, params, companyId}) {
    const feedbackId = params.id

    return firestore.collection('feedbacks')
      .doc(feedbackId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setUid', doc.data()['uid'])
          commit('setProfileImageUrl', doc.data()['profileImageUrl'])
          commit('setUserName', doc.data()['userName'])
          commit('setCompanyId', doc.data()['companyId'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setCompanyName', doc.data()['companyName'])
          commit('setGoodPoint', doc.data()['goodPoint'])
          commit('setAdvice', doc.data()['advice'])
          commit('setCreatedAt', doc.data()['createdAt'])

          var timestamp = doc.data()['createdAt']
          if (timestamp) {
            let date = new Date( timestamp.seconds * 1000 )
            let year  = date.getFullYear()
            let month = date.getMonth() + 1
            let day  = date.getDate()
            timestamp = `${year}/${month}/${day}`
          }
          commit('setTimestamp', timestamp)

          if (companyId) {
            if (companyId != doc.data()['companyId']) {
              console.log('404')
              nuxt.error({ statusCode: 404, message: 'not found' })
            }
          }
        } else {
          // 404
          console.log('404')
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
        nuxt.error({ statusCode: 404, message: 'not found' })
      })
  },
  sendFeedback({commit, state}, {router, params, goodPoint, advice}) {
    const feedbackId = params.id
    const feedbackData = {
      goodPoint: goodPoint,
      advice: advice,
      createdAt: new Date(),
      isWritten: true
    }

    const batch = firestore.batch()
    const feedbackRef = firestore.collection('feedbacks').doc(feedbackId)
    batch.update(feedbackRef, feedbackData)
    const notificationRef = firestore.collection('users')
      .doc(state.uid).collection('notifications').doc()
    const url = '/user/feedbacks/' + feedbackId
    batch.set(notificationRef, {
      type: 'normal',
      isImportant: false,
      content: state.companyName + 'にフィードバックをもらいました！ 確認してみましょう。',
      createdAt: new Date(),
      url: url,
      isUnread: true,
    })

    batch.commit()
      .then(() => {
        router.replace({path: '/recruiter/feedbacks'})
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  resetState({commit}) {
    commit('setUid', null)
    commit('setProfileImageUrl', null)
    commit('setUserName', null)
    commit('setCompanyId', null)
    commit('setCompanyImageUrl', null)
    commit('setCompanyName', null)
    commit('setGoodPoint', '')
    commit('setAdvice', '')
    commit('setCreatedAt', null)
  },
}
