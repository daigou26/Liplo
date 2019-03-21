const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// 内定パスを承諾した時の処理
exports.acceptJobOffer = functions.firestore
  .document('passes/{passId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()

    if (newValue.isAccepted != true || previousValue.isAccepted != false) {
      return 0
    }

    const uid = newValue.uid
    const userName = newValue.userName
    const profileImageUrl = newValue.profileImageUrl
    const userMessage = newValue.userMessage
    const companyId = newValue.companyId
    const companyName = newValue.companyName
    const companyImageUrl = newValue.companyImageUrl
    const occupation = newValue.occupation
    const passId = context.params.passId
    const acceptedOffer = {
      acceptedOffer: {
        companyId: companyId,
        companyName: companyName,
        companyImageUrl: companyImageUrl,
        passId: passId,
        occupation: occupation,
        isContracted: false,
      }
    }
    const message = {
      message: userMessage,
      createdAt: newValue.acceptedAt,
      type: 'acceptOffer',
      user: {
        uid: uid,
        name: userName,
        profileImageUrl: profileImageUrl
      }
    }

    // user に acceptedOffer を追加, メッセージを messages に追加
    return admin.firestore()
      .collection('chats')
      .where('uid', '==', uid)
      .where('companyId', '==', companyId)
      .get()
      .then(function(snapshot) {
        var docCount = 0
        snapshot.forEach(function(doc) {
          docCount += 1
          console.log('docCount', docCount)
          if (docCount == 1) {
            const batch = admin.firestore().batch()
            const userRef = admin.firestore().collection('users').doc(uid)
            batch.update(userRef, acceptedOffer)
            const messagesRef = admin.firestore().collection('chats').doc(doc.id).collection('messages').doc()
            batch.set(messagesRef, message)
            batch.commit()
              .then(() => {
                console.log('acceptJobOffer complete.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          }
        })
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  })

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
