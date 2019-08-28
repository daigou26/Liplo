export const strict = false
import { firestore } from '@/plugins/firebase'

export const state = () => ({
  latestNotifications: [],
  isLatestNotificationsLoading: false,
  notifications: [],
  isInitialLoading: false,
  isLoading: false,
  allNotificationsQueried: false,
  canReadAll: false,
  hasNewNotification: false,
  unsubscribe: null,
})

export const mutations = {
  addLatestNotification(state, notification) {
    state.latestNotifications.push(notification)
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
  resetNotifications(state) {
    state.notifications = []
  },
  updateIsInitialLoading(state, isLoading) {
    state.isInitialLoading = isLoading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setAllNotificationsQueried(state, allNotificationsQueried) {
    state.allNotificationsQueried = allNotificationsQueried
  },
  // 通知をクリックした時に isUnread を false に
  updateNotificationIsUnread(state, notificationId) {
    state.latestNotifications = state.latestNotifications.map(notification => {
      if (notification.notificationId == notificationId) {
        notification.isUnread = false
      }
      return notification
    })

    state.notifications = state.notifications.map(notification => {
      if (notification.notificationId == notificationId) {
        notification.isUnread = false
      }
      return notification
    })
  },
  // 全ての通知の isUnread を false に
  updateAllNotificationsIsUnread(state) {
    state.latestNotifications = state.latestNotifications.map(notification => {
      notification.isUnread = false
      return notification
    })

    state.notifications = state.notifications.map(notification => {
      notification.isUnread = false
      return notification
    })
  },
  updateCanReadAll(state, canReadAll) {
    state.canReadAll = canReadAll
  },
  updateHasNewNotification(state, hasNewNotification) {
    state.hasNewNotification = hasNewNotification
  },
  setUnsubscribe(state, unsubscribe) {
    state.unsubscribe = unsubscribe
  },
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
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
        })
        .catch(function(error) {
          commit('updateIsInitialLoading', false)
          commit('updateIsLoading', false)
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
        commit('updateNotificationIsUnread', notificationId)
      })
      .catch((error) => {
        console.error("Error updating document: ", error)
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
            commit('updateAllNotificationsIsUnread')
          })
          .catch((error) => {
            console.error("Error", error)
          })
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  },
  // 未読の通知があるか
  setNotificationsListener({commit}, uid) {
    if (!state.unsubscribe) {
      const listener = firestore.collection('users')
        .doc(uid)
        .collection('notifications')
        .where('isUnread', '==', true)
        .onSnapshot(function(snapshot) {
          if (!snapshot.empty) {
            commit('updateHasNewNotification', true)
          } else {
            commit('updateHasNewNotification', false)
          }
        })
      commit('setUnsubscribe', listener)
    }
  },
  resetHasNewNotification({commit}) {
    commit('updateHasNewNotification', false)
  },
  resetNotificationsListener({commit, state}) {
    if (state.unsubscribe) {
      state.unsubscribe()
    }
    commit('setUnsubscribe', null)
  },
  resetLatestNotificationsState({commit}) {
    commit('resetLatestNotifications')
    commit('updateIsLatestNotificationsLoading', false)
    commit('updateCanReadAll', false)
  },
  resetState({commit}) {
    commit('resetNotifications')
    commit('updateIsInitialLoading', false)
    commit('updateIsLoading', false)
    commit('setAllNotificationsQueried', false)
  },
}
