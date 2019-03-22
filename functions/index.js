const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// レビューした時の処理
exports.addReview = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate((snap, context) => {

    const uid = snap.data().uid
    const jobId = snap.data().jobId
    const companyId = snap.data().companyId
    const content = snap.data().content
    const occupation = snap.data().occupation
    const createdAt = snap.data().createdAt
    const comment = {
      reviewId: context.params.reviewId,
      occupation: occupation,
      content: content,
      createdAt: createdAt,
    }

    // job, job detail, companies detail の reviews を更新
    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const reviewCount = doc.data().reviews.rating.count
          const atmosphere = Math.round((doc.data().reviews.rating.atmosphere * reviewCount + snap.data().atmosphere) / (reviewCount + 1) * 10) / 10
          const job = Math.round((doc.data().reviews.rating.job * reviewCount + snap.data().job) / (reviewCount + 1) * 10) / 10
          const discretion = Math.round((doc.data().reviews.rating.discretion * reviewCount + snap.data().discretion) / (reviewCount + 1) * 10) / 10
          const flexibleSchedule = Math.round((doc.data().reviews.rating.flexibleSchedule * reviewCount + snap.data().flexibleSchedule) / (reviewCount + 1) * 10) / 10
          const flexibility = Math.round((doc.data().reviews.rating.flexibility * reviewCount + snap.data().flexibility) / (reviewCount + 1) * 10) / 10
          const mentor = Math.round((doc.data().reviews.rating.mentor * reviewCount + snap.data().mentor) / (reviewCount + 1) * 10) / 10
          const growth = Math.round((doc.data().reviews.rating.growth * reviewCount + snap.data().growth) / (reviewCount + 1) * 10) / 10
          const all = Math.round((atmosphere + job + discretion + flexibleSchedule + flexibility + mentor + growth) / 7 * 10) / 10
          const comments = doc.data().reviews.comments
          console.log('comments length:', comments.length)
          console.log('comments :', comments)

          if (comments == null) {
            comments = [comment]
          } else if (comments.length < 3) {
            comments.push(comment)
          } else if (comments.length >= 3) {
            var date
            var index
            comments.forEach((comment, i) => {
              if (date == null || date > comment.createdAt.seconds * 1000) {
                date = comment.createdAt.seconds * 1000
                index = i
              }
            })
            comments.splice(index, 1)
            comments.push(comment)
          }
          const reviews = {
            reviews: {
              rating: {
                all: all,
                count: reviewCount + 1,
                atmosphere: atmosphere,
                job: job,
                discretion: discretion,
                flexibleSchedule: flexibleSchedule,
                flexibility: flexibility,
                mentor: mentor,
                growth: growth
              },
              comments: comments,
            }
          }

          const batch = admin.firestore().batch()
          const companyDetailRef = admin.firestore().collection('companies').doc(companyId).collection('detail').doc(companyId)
          batch.update(companyDetailRef, reviews)
          const careerRef = admin.firestore().collection('users').doc(uid).collection('career').doc(jobId)
          batch.update(careerRef, {
            isReviewWritten: true
          })
          batch.commit()
            .then(() => {
              console.log('addReview completed.')
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  })
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
