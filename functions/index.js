const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// ユーザーが応募した時の処理
exports.applyForJob = functions.firestore
  .document('companies/{companyId}/applicants/{applicantId}')
  .onCreate((snap, context) => {
    const uid = snap.data().uid
    const jobId = snap.data().jobId

    // 求人詳細に応募数とuidを格納
    return admin.firestore()
      .collection('jobs').doc(jobId)
      .collection('detail').doc(jobId)
      .get()
      .then(doc => {
        if (doc.exists) {
          let count
          let users
          let applicants

          if (doc.data().applicants) {
            count = doc.data().applicants.count
            users = doc.data().applicants.users
            users.push(uid)
          } else {
            count = 0
            users = [uid]
          }

          applicants = {
            count: count + 1,
            users: users
          }

          admin.firestore()
            .collection('jobs').doc(jobId)
            .collection('detail').doc(jobId)
            .update({
              applicants: applicants
            })
            .then(() => {
              console.log('applyForJob completed.')
            })
            .catch(err => {
              console.log('Error getting document', err)
            })
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  })

// メッセージを送信した時の処理
exports.sendMessageFromUser = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate((snap, context) => {
    const chatId = context.params.chatId
    const messageId = context.params.messageId

    // chatのupdatedAt, picUnreadCountを更新
    return admin.firestore()
      .collection('chats').doc(chatId)
      .collection('messages').doc(messageId)
      .get()
      .then(doc => {
        if (doc.exists) {
          let picUnreadCount
          if (doc.data().picUnreadCount != null) {
            picUnreadCount = doc.data().picUnreadCount
          } else {
            picUnreadCount = 0
          }

          admin.firestore()
            .collection('chats').doc(chatId)
            .update({
              updatedAt: snap.data().createdAt,
              picUnreadCount: picUnreadCount + 1,
            })
            .then(() => {
              console.log('sendMessageFromUser completed.')
            })
            .catch(err => {
              console.log('Error getting document', err)
            })
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  })
