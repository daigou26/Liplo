export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  latestNotifications: [],
  isLatestNotificationsLoading: false,
  notifications: [],
  isLoading: false,
  allNotificationsQueried: false,
  canReadAll: false,
})

export const mutations = {
  addLatestNotification(state, notification) {
    state.latestNotifications.push(notification)
  },
  setLatestNotifications(state, notifications) {
    state.latestNotifications = notifications
  },
  resetLatestNotifications(state) {
    state.latestNotifications = []
  },
  updateIsLatestNotificationsLoading(state, isLoading) {
    state.isLatestNotificationsLoading = isLoading
  },
  addNotification(state, notification) {
    state.notifications.push(notification)
  },
  setNotifications(state, notifications) {
    state.notifications = notifications
  },
  resetNotifications(state) {
    state.notifications = []
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllNotificationsQueried(state, allNotificationsQueried) {
    state.allNotificationsQueried = allNotificationsQueried
  },
  updateCanReadAll(state, canReadAll) {
    state.canReadAll = canReadAll
  }
}

export const actions = {
  queryLatestNotifications({commit}, uid) {
    firestore.collection('users')
      .doc(uid)
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .limit(4)
      .get()
      .then(function(snapshot) {
        var docCount = 0
        snapshot.forEach(function(doc) {
          docCount += 1
          let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
          let currentDate = new Date()

          var timestamp = Math.floor((currentDate - createdAt) / 3600000)
          if (timestamp >= 24) {
            timestamp = Math.floor((currentDate - createdAt) / 86400000)
            timestamp = String(timestamp) + '日前'
          } else {
            if (timestamp <= 1) {
              timestamp = '1時間以内'
            } else {
              timestamp = String(timestamp) + '時間前'
            }
          }

          if (docCount < 4) {
            const notification = {
              notificationId: doc.id,
              type: doc.data()['type'],
              isImportant: doc.data()['isImportant'],
              content: doc.data()['content'],
              createdAt: doc.data()['createdAt'],
              url: doc.data()['url'],
              isUnread: doc.data()['isUnread'],
              timestamp: timestamp
            }
            commit('addLatestNotification', notification)
          }
        })

        commit('updateCanReadAll', docCount == 4)
        commit('updateIsLatestNotificationsLoading', false)
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  },
  updateIsLatestNotificationsLoading({commit}, isLoading) {
    commit('updateIsLatestNotificationsLoading', isLoading)
  },
  queryNotifications({commit, state}, uid) {
    const notifications = state.notifications

    if (notifications.length == 0) {
      firestore.collection('users')
        .doc(uid)
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
            let currentDate = new Date()

            var timestamp = Math.floor((currentDate - createdAt) / 3600000)
            if (timestamp >= 24) {
              timestamp = Math.floor((currentDate - createdAt) / 86400000)
              timestamp = String(timestamp) + '日前'
            } else {
              if (timestamp <= 1) {
                timestamp = '1時間以内'
              } else {
                timestamp = String(timestamp) + '時間前'
              }
            }

            const notification = {
              notificationId: doc.id,
              type: doc.data()['type'],
              isImportant: doc.data()['isImportant'],
              content: doc.data()['content'],
              createdAt: doc.data()['createdAt'],
              url: doc.data()['url'],
              isUnread: doc.data()['isUnread'],
              timestamp: timestamp
            }
            commit('addNotification', notification)
          })
          if (docCount == 0) {
            commit('setAllNotificationsQueried', true)
          }
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    } else if (notifications.length != 0) {
      const lastIndex = notifications.length - 1
      const lastDate = notifications[lastIndex].createdAt
      firestore.collection('users')
        .doc(uid)
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .startAfter(lastDate)
        .limit(10)
        .get()
        .then(function(snapshot) {
          var docCount = 0
          snapshot.forEach(function(doc) {
            docCount += 1

            let createdAt = new Date( doc.data()['createdAt'].seconds * 1000 )
            let currentDate = new Date()

            var timestamp = Math.floor((currentDate - createdAt) / 3600000)
            if (timestamp >= 24) {
              timestamp = Math.floor((currentDate - createdAt) / 86400000)
              timestamp = String(timestamp) + '日前'
            } else {
              timestamp = String(timestamp) + '時間前'
            }

            const notification = {
              notificationId: doc.id,
              type: doc.data()['type'],
              isImportant: doc.data()['isImportant'],
              content: doc.data()['content'],
              createdAt: doc.data()['createdAt'],
              url: doc.data()['url'],
              isUnread: doc.data()['isUnread'],
              timestamp: timestamp
            }
            commit('addNotification', notification)
          })
          if (docCount == 0) {
            commit('setAllNotificationsQueried', true)
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
  // 指定されたnotificationIdの通知を既読にする
  updateIsUnread({commit, state}, {uid, notificationId}) {
    firestore.collection('users')
      .doc(uid)
      .collection('notifications')
      .doc(notificationId)
      .update({
        isUnread: false
      })
      .then(() => {
        var latestNotifications = state.latestNotifications
        var notifications = state.notifications

        latestNotifications.forEach((notification, index) => {
          if (notification.notificationId == notificationId) {
            latestNotifications[index].isUnread = false
          }
        })

        notifications.forEach((notification, index) => {
          if (notification.notificationId == notificationId) {
            notifications[index].isUnread = false
          }
        })
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  // 全ての通知を既読にする
  updateAllIsUnread({commit, state}, uid) {
    firestore.collection('users')
      .doc(uid)
      .collection('notifications')
      .where('isUnread', '==', true)
      .get()
      .then(function(snapshot) {
        const batch = firestore.batch()

        snapshot.forEach(function(doc) {
          const notificationRef = firestore.collection('users').doc(uid)
            .collection('notifications').doc(doc.id)
          batch.update(notificationRef, {
            isUnread: false,
          })
        })
        batch.commit()
          .then(() => {
            var latestNotifications = state.latestNotifications
            var notifications = state.notifications

            latestNotifications.forEach((notification, index) => {
              latestNotifications[index].isUnread = false
            })

            notifications.forEach((notification, index) => {
              notifications[index].isUnread = false
            })
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  },
  resetLatestNotificationsState({commit}) {
    commit('resetLatestNotifications')
    commit('updateIsLatestNotificationsLoading', false)
    commit('updateCanReadAll', false)
  },
  resetState({commit}) {
    commit('resetNotifications')
    commit('updateIsLoading', false)
    commit('setAllNotificationsQueried', false)
  },
}
