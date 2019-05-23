const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
})
const rp = require('request-promise')
const slack_url = functions.config().slack.webhook_url
const admin = require('firebase-admin')
admin.initializeApp()

// フィードバックをローカルにdownload
// exports.downloadFeedbacks = functions.https..onCall((data, context) => {
//   const json2csv = require("json2csv").parse
//
//   if (data.uid == null) {
//     return 0
//   }
//
//   return admin.firestore()
//     .collection('adminUsers')
//     .doc(data.uid)
//     .get()
//     .then(adminDoc => {
//       if (adminDoc.exists) {
//         admin.firestore()
//           .collection('appFeedbacks')
//           .get()
//           .then(snapshot => {
//             const feedbacks = []
//             if (!snapshot.empty) {
//
//               snapshot.forEach(doc => {
//                 var createdAt = doc.data().createdAt
//                 if (createdAt) {
//                   let date = new Date( createdAt.seconds * 1000 )
//                   let year  = date.getFullYear()
//                   let month = date.getMonth() + 1
//                   let day  = date.getDate()
//                   createdAt = `${year}/${month}/${day}`
//                 }
//
//                 const feedback = {
//                   createdAt: createdAt,
//                   type: doc.data().type,
//                   content: doc.data().content,
//
//                 }
//                 feedbacks.push(feedback)
//               })
//               console.log('feedback ok');
//               const csv = json2csv(feedbacks)
//               response.setHeader(
//                 "Content-disposition",
//                 "attachment; filename=lighthouse-feedbacks.csv"
//               );
//               response.set("Content-Type", "text/csv");
//               response.status(200).send(csv);
//               console.log('download ok');
//             } else {
//               console.log('no feedbacks');
//             }
//           })
//           .catch(error => {
//             response.status(200).send("エラー： " + error);
//           })
//       }
//     })
//     .catch(error => {
//       console.error("Error: ", error)
//     })
// })

// サービスのフィードバックが送信された時の処理
// exports.sendFeedbacksOfApp = functions.region('asia-northeast1')
//   .firestore
//   .document('appFeedbacks/{feedbackId}')
//   .onCreate((snap, context) => {
//     const feedbackId = context.params.feedbackId
//     const createdAt = snap.data().createdAt
//     const content = snap.data().content
//     const type = snap.data().type
//
//     return rp({
//       method: 'POST',
//       uri: slack_url,
//       body: {
//         text: `${type}: ${content}`,
//       },
//       json: true,
//     });
//   })

// 企業メンバーが招待された時の処理
exports.sendMailToInvitedMember = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/invitedMembers/{memberId}')
  .onCreate((snap, context) => {
    const companyId = context.params.companyId
    const email = snap.data().email
    const companyName = snap.data().companyName
    const userName = snap.data().userName
    const url = `http://localhost:3000/?type=invited&id=${companyId}`

    // 招待されたユーザーにメール送信
    const mailOptions = {
      from: `LightHouse <noreply@firebase.com>`,
      to: email,
    }
    mailOptions.subject = `${userName}さんが${companyName}にあなたを招待しました。`
    mailOptions.text = `${userName}さんが${companyName}にあなたを招待しました。${url}にアクセスして、サインアップしてください。`
    return mailTransport.sendMail(mailOptions)
      .then(() => {
        console.log('sendMailToInvitedMember completed. sent to:', email)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  })

// 候補者のステータスが変わった時、user の career を更新
exports.updateCareer = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/candidates/{candidateId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()
    const beforeStatus = previousValue.status
    const newStatus = newValue.status
    // ステータス変化なし
    if (
      newStatus.scouted == beforeStatus.scouted &&
      newStatus.inbox == beforeStatus.inbox &&
      newStatus.inProcess == beforeStatus.inProcess &&
      newStatus.intern == beforeStatus.intern &&
      newStatus.pass == beforeStatus.pass &&
      newStatus.contracted == beforeStatus.contracted &&
      newStatus.hired == beforeStatus.hired &&
      newStatus.rejected == beforeStatus.rejected
    ) {
      return 0
    }
    // 前のステータスが選考中、インターンでなければ終了
    if (!(beforeStatus.inProcess || beforeStatus.intern)) {
      return 0
    }

    const companyId = context.params.companyId
    const candidateId = context.params.candidateId
    const createdAt = newValue.updatedAt
    const user = newValue.user
    const career = newValue.career
    const occupation = career.internOccupation

    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const companyName = doc.data().companyName
          const companyImageUrl = doc.data().imageUrl

          if (newStatus.intern) {
            // ステータスがインターンになった時
            const batch = admin.firestore().batch()
            // キャリア更新
            const careerId = admin.firestore().collection('users').doc(user.uid)
              .collection('career').doc().id
            const careerRef = admin.firestore().collection('users').doc(user.uid)
              .collection('career').doc(careerId)
            var careerData = {
              occupation: occupation,
              companyId: companyId,
              companyName: companyName,
              startedAt: createdAt,
              end: false,
              isReviewWritten: false,
              isInternExtended: false,
              extendedInternEnd: false,
            }
            if (companyImageUrl) {
              careerData.companyImageUrl = companyImageUrl
            }
            batch.set(careerRef, careerData)
            // キャリア情報をcandidateに格納
            const candidateRef = admin.firestore().collection('companies')
              .doc(companyId).collection('candidates').doc(candidateId)
            career.careerId = careerId
            batch.update(candidateRef, {
              career: career
            })
            batch.commit()
              .then(() => {
                console.log('updateCareer completed.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })

            // userスコア更新
            admin.firestore()
              .collection('users')
              .doc(user.uid)
              .get()
              .then(userDoc => {
                var points = userDoc.data().points
                if (points == null) {
                  points = 0
                }
                admin.firestore()
                  .collection('users')
                  .doc(user.uid)
                  .update({
                    points: points + 1,
                  })
                  .then(() => {
                    console.log('updateCareer: update user score completed.')
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error)
                  })
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          } else if (newStatus.pass || newStatus.rejected) {
            // ステータスがインターン、インターン延長から変わった時
            var careerData = {
              end: true,
              endedAt: new Date()
            }

            const batch = admin.firestore().batch()
            // キャリア
            const careerRef = admin.firestore().collection('users').doc(user.uid)
              .collection('career').doc(career.careerId)
            batch.update(careerRef, careerData)
            // 通知
            const notificationRef = admin.firestore().collection('users').doc(user.uid)
              .collection('notifications').doc()
            const url = '/user/reviews/new?id=' + career.careerId
            batch.set(notificationRef, {
              type: 'normal',
              isImportant: true,
              content:
                'インターンが終了しました。お疲れ様でした！ ' +
                companyName +
                'のレビューをしましょう！',
              createdAt: new Date(),
              url: url,
              isUnread: true,
            })
            batch.commit()
              .then(() => {
                console.log('updateCareer completed.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          }
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  })

// 候補者のステータスが internから変わった時、フィードバックを送る処理
exports.sendFeedback = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/candidates/{candidateId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()
    const beforeStatus = previousValue.status
    const newStatus = newValue.status
    // ステータス変化なし
    if (
      newStatus.scouted == beforeStatus.scouted &&
      newStatus.inbox == beforeStatus.inbox &&
      newStatus.inProcess == beforeStatus.inProcess &&
      newStatus.intern == beforeStatus.intern &&
      newStatus.pass == beforeStatus.pass &&
      newStatus.contracted == beforeStatus.contracted &&
      newStatus.hired == beforeStatus.hired &&
      newStatus.rejected == beforeStatus.rejected
    ) {
      return 0
    }
    if (!previousValue.status.intern) {
      return 0
    }

    const companyId = context.params.companyId
    const internOccupation = newValue.internOccupation
    const feedback = newValue.feedback
    const updatedAt = newValue.updatedAt
    const user = newValue.user

    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const companyName = doc.data().companyName
          const companyImageUrl = doc.data().imageUrl

          var feedbackData = {
            uid: user.uid,
            userName: user.name,
            companyId: companyId,
            companyName: companyName,
            occupation: internOccupation,
            createdAt: updatedAt,
          }
          if (user.imageUrl) {
            feedbackData.profileImageUrl = user.imageUrl
          }
          if (companyImageUrl) {
            feedbackData.companyImageUrl = companyImageUrl
          }

          if (newValue.feedback == null) {
            feedbackData.isWritten = false
          } else {
            feedbackData.isWritten = true
            feedbackData.goodPoint = feedback.goodPoint
            feedbackData.advice = feedback.advice
          }

          const feedbackId = admin.firestore().collection('feedbacks').doc().id
          const batch = admin.firestore().batch()

          // company feedback all 更新
          var companyFeedbackData = doc.data().feedback
          companyFeedbackData.all += 1
          const companyRef = admin.firestore().collection('companies').doc(companyId)
          batch.update(companyRef, {
            feedback: companyFeedbackData,
          })
          const companyDetailRef = admin.firestore().collection('companies')
            .doc(companyId).collection('detail').doc(companyId)
          batch.update(companyDetailRef, {
            feedback: companyFeedbackData,
          })
          // フィードバック
          const feedbackRef = admin.firestore().collection('feedbacks').doc(feedbackId)
          batch.set(feedbackRef, feedbackData)

          if (newValue.feedback != null) {
            // 通知
            const notificationRef = admin.firestore().collection('users').doc(user.uid)
              .collection('notifications').doc()
            const url = '/user/feedbacks/' + feedbackId
            batch.set(notificationRef, {
              type: 'normal',
              isImportant: false,
              content: companyName + 'からフィードバックが送られました！ ',
              createdAt: new Date(),
              url: url,
              isUnread: true,
            })
          }

          batch.commit()
            .then(() => {
              console.log('sendFeedback completed.')
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  })

// フィードバックが送られた時、企業のfeedback countを更新
exports.updateCompanyFeedbackCount = functions.region('asia-northeast1')
  .firestore
  .document('feedbacks/{feedbackId}')
  .onCreate((snap, context) => {
    const companyId = snap.data().companyId

    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          // company feedback writtenCount 更新
          var feedback = doc.data().feedback
          feedback.writtenCount += 1

          const batch = admin.firestore().batch()
          const companyRef = admin.firestore().collection('companies').doc(companyId)
          batch.update(companyRef, {
            feedback: feedback
          })
          const companyDetailRef = admin.firestore().collection('companies')
            .doc(companyId).collection('detail').doc(companyId)
          batch.update(companyDetailRef, {
            feedback: feedback
          })

          batch.commit()
            .then(() => {
              console.log('updateCompanyFeedbackCount completed.')
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  })

// 候補者のステータスが pass になった時、パスを送る処理
exports.sendPass = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/candidates/{candidateId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()
    const beforeStatus = previousValue.status
    const newStatus = newValue.status
    // ステータス変化なし
    if (
      newStatus.scouted == beforeStatus.scouted &&
      newStatus.inbox == beforeStatus.inbox &&
      newStatus.inProcess == beforeStatus.inProcess &&
      newStatus.intern == beforeStatus.intern &&
      newStatus.pass == beforeStatus.pass &&
      newStatus.contracted == beforeStatus.contracted &&
      newStatus.hired == beforeStatus.hired &&
      newStatus.rejected == beforeStatus.rejected
    ) {
      return 0
    }
    if (previousValue.status.pass || !newValue.status.pass) {
      return 0
    }

    const companyId = context.params.companyId
    const candidateId = context.params.candidateId
    const updatedAt = newValue.updatedAt
    const user = newValue.user
    var pass = newValue.pass
    // パスの種類
    var passType
    if (pass.type == 'hiring') {
      passType = '入社パス'
    } else if (pass.type == 'offer') {
      passType = '内定パス'
    } else if (pass.type == 'limited') {
      passType = '先着パス'
    }

    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const companyName = doc.data().companyName
          const companyImageUrl = doc.data().imageUrl
          // 入社パスのカウント
          const hiringPassCount = doc.data().hiringPassCount
          const passId = admin.firestore().collection('passes').doc().id

          var passData = {
            candidateId: candidateId,
            uid: user.uid,
            userName: user.name,
            companyId: companyId,
            companyName: companyName,
            createdAt: updatedAt,
            type: pass.type,
            expirationDate: pass.expirationDate,
            occupation: pass.occupation,
            picMessage: pass.message,
            pic: pass.pic,
            isAccepted: false,
            isContracted: false,
            isValid: true,
            candidateId: candidateId,
          }
          if (user.imageUrl) {
            passData.profileImageUrl = user.imageUrl
          }
          if (companyImageUrl) {
            passData.companyImageUrl = companyImageUrl
          }
          if (pass.type != 'hiring') {
            passData.joiningYear = pass.joiningYear
          }

          const batch = admin.firestore().batch()
          // 入社パスの場合、hiringPassCount を更新
          if (pass.type == 'hiring') {
            const companyRef = admin.firestore().collection('companies').doc(companyId)
            var companyData
            if (hiringPassCount) {
              companyData = {
                hiringPassCount: hiringPassCount + 1,
              }
            } else {
              companyData = {
                hiringPassCount: 1
              }
            }
            batch.update(companyRef, companyData)
          }
          // パス
          const passRef = admin.firestore().collection('passes').doc(passId)
          batch.set(passRef, passData)
          // パスのデータをcandidateに
          const candidateRef = admin.firestore().collection('companies')
            .doc(companyId).collection('candidates').doc(candidateId)
          pass.passId = passId
          batch.update(candidateRef, {
            pass: pass
          })
          // 通知
          const notificationRef = admin.firestore().collection('users').doc(user.uid)
            .collection('notifications').doc()
          const url = '/user/passes/' + passId
          batch.set(notificationRef, {
            type: 'normal',
            isImportant: true,
            content: `${companyName}から${passType}が送られました！ パスを使用する場合は、使用ボタンを押してから企業と連絡を取り、契約をしてください。`,
            createdAt: new Date(),
            url: url,
            isUnread: true,
          })
          batch.commit()
            .then(() => {
              admin.firestore().collection('users')
                .doc(user.uid)
                .get()
                .then(userDoc => {
                  if (userDoc.exists) {
                    if (userDoc.data().notificationsSetting == null || userDoc.data().notificationsSetting.pass) {
                      // パスが渡されたユーザーにメール送信
                      const mailOptions = {
                        from: `LightHouse <noreply@firebase.com>`,
                        to: userDoc.data().email,
                      }
                      mailOptions.subject = `${companyName}に${passType}をもらいました！`
                      mailOptions.text = `${companyName}に${passType}をもらいました！　ご確認ください。`
                      mailTransport.sendMail(mailOptions, (err, info) => {
                        if (err) {
                          console.log(err)
                        }
                        console.log('New pass email sent to:', userDoc.data().email)
                      })
                    }
                  }
                })
                .catch((error) => {
                  console.error("Error getting document: ", error)
                })

              console.log('update pass info & send notification completed.')
            })
            .catch((error) => {
              console.error("Error: ", error)
            })

          // 内定パスまたは先着パスの場合
          if (pass.type != 'hiring') {
            admin.firestore()
              .collection('companies')
              .doc(companyId)
              .collection('yearPasses')
              .doc(String(pass.joiningYear))
              .get()
              .then(doc => {
                if (doc.exists) {
                  // すでにカウントある場合
                  var count = doc.data().count
                  if (pass.type == 'offer') {
                    // 内定パス
                    count.offer.all += 1
                  } else if (pass.type == 'limited') {
                    // 先着パス
                    count.limited.all += 1
                  }
                  // 更新
                  admin.firestore()
                    .collection('companies')
                    .doc(companyId)
                    .collection('yearPasses')
                    .doc(String(pass.joiningYear))
                    .update({
                      count: count
                    })
                    .then(() => {
                      console.log('update pass count completed.')
                    })
                    .catch((error) => {
                      console.error("Error updating document: ", error)
                    })
                } else {
                  // まだカウントがない場合
                  var passData
                  if (pass.type == 'offer') {
                    // 内定パス
                    passData = {
                      count: {
                        hiring: {
                          used: 0
                        },
                        offer: {
                          all: 1,
                          used: 0
                        },
                        limited: {
                          all: 0,
                          used: 0
                        }
                      }
                    }
                  } else if (pass.type == 'limited') {
                    // 先着パス
                    passData = {
                      count: {
                        hiring: {
                          used: 0
                        },
                        offer: {
                          all: 0,
                          used: 0
                        },
                        limited: {
                          all: 1,
                          used: 0
                        }
                      }
                    }
                  }
                  passData.year = pass.joiningYear
                  passData.limit = null
                  // 更新
                  admin.firestore()
                    .collection('companies')
                    .doc(companyId)
                    .collection('yearPasses')
                    .doc(String(pass.joiningYear))
                    .set(passData)
                    .then(() => {
                      console.log('set pass count completed.')
                    })
                    .catch((error) => {
                      console.error("Error adding document: ", error)
                    })
                }
              })
              .catch((error) => {
                console.error("Error getting document: ", error)
              })
          }
        }
      })
      .catch((error) => {
        console.error("Error getting document: ", error)
      })
  })

// パスの情報が変更された時の処理 （パスを使用した時、recruiter がパスの入社年度を変更した時）
exports.passHasChanged = functions.region('asia-northeast1')
  .firestore
  .document('passes/{passId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()

    const uid = newValue.uid
    const userName = newValue.userName
    const profileImageUrl = newValue.profileImageUrl
    const userMessage = newValue.userMessage
    const companyId = newValue.companyId
    const companyName = newValue.companyName
    const companyImageUrl = newValue.companyImageUrl
    const type = newValue.type
    const joiningYear = newValue.joiningYear
    const occupation = newValue.occupation
    const candidateId = newValue.candidateId
    const isAccepted = newValue.isAccepted
    const passId = context.params.passId

    if (isAccepted == true && previousValue.isAccepted == false) {
      // パスを承諾した時の処理
      const message = {
        message: userMessage,
        createdAt: newValue.acceptedDate,
        type: 'acceptOffer',
        user: {
          uid: uid,
          name: userName,
          imageUrl: profileImageUrl
        }
      }
      // パスの種類
      var typeText
      if (type == 'hiring') {
        typeText = '入社パス'
      } else if (type == 'offer') {
        typeText = '内定パス'
      } else if (type == 'limited') {
        typeText = '先着パス'
      }

      // メッセージを messages に追加
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
              admin.firestore().collection('chats').doc(doc.id)
                .collection('messages')
                .add(message)
                .then(() => {
                  console.log('acceptJobOffer: add message complete.')
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
            }
          })

          // パス　カウント 更新
          admin.firestore()
            .collection('companies')
            .doc(companyId)
            .collection('yearPasses')
            .doc(String(joiningYear))
            .get()
            .then(doc => {
              if (doc.exists) {
                var count = doc.data().count
                if (type == 'hiring') {
                  count.hiring.used += 1
                } else if (type == 'offer') {
                  count.offer.used += 1
                } else if (type == 'limited') {
                  count.limited.used += 1
                }
                admin.firestore()
                  .collection('companies')
                  .doc(companyId)
                  .collection('yearPasses')
                  .doc(String(joiningYear))
                  .update({
                    count: count
                  })
                  .then(() => {
                    console.log('acceptJobOffer: update pass count complete.')
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error)
                  })
              } else {
                var passData
                if (type == 'hiring') {
                  // 内定パス
                  passData = {
                    count: {
                      hiring: {
                        used: 1
                      },
                      offer: {
                        all: 0,
                        used: 0
                      },
                      limited: {
                        all: 0,
                        used: 0
                      }
                    }
                  }
                }
                passData.year = joiningYear
                passData.limit = null
                // 更新
                admin.firestore()
                  .collection('companies')
                  .doc(companyId)
                  .collection('yearPasses')
                  .doc(String(joiningYear))
                  .set(passData)
                  .then(() => {
                    console.log('acceptJobOffer: update pass count complete.')
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error)
                  })
              }
            })
            .catch((error) => {
              console.error("Error getting document: ", error)
            })

          // 通知
          admin.firestore()
            .collection('companies')
            .doc(companyId)
            .get()
            .then(doc => {
              if (doc.exists) {
                const members = doc.data().members
                const batch = admin.firestore().batch()
                members.forEach((member, i) => {
                  const notificationRef = admin.firestore().collection('users').doc(member.uid)
                    .collection('notifications').doc()
                  const url = '/recruiter/candidates/' + candidateId
                  batch.set(notificationRef, {
                    type: 'normal',
                    isImportant: true,
                    content: `${userName}さんが${typeText}を使用しました！ 契約が済みましたら、ステータスを採用予定に変更してください。`,
                    createdAt: new Date(),
                    url: url,
                    isUnread: true,
                  })
                })
                batch.commit()
                  .then(() => {
                    // パスが使用されたら担当者にメール送信
                    members.forEach((member, i) => {
                      if (member.notificationsSetting == null || member.notificationsSetting.acceptPass) {
                        const mailOptions = {
                          from: `LightHouse <noreply@firebase.com>`,
                          to: member.email,
                        }
                        mailOptions.subject = `${userName}さんが${typeText}を使用しました。`
                        mailOptions.text = `${userName}さんが${typeText}を使用しました。　契約が済みましたら、ステータスを採用予定に変更してください。`
                        mailTransport.sendMail(mailOptions, (err, info) => {
                          if (err) {
                            console.log(err)
                          }
                          console.log('New accept pass email sent to:', member.email)
                        })
                      }
                    })
                    console.log('acceptJobOffer: notification complete.')
                  })
                  .catch((error) => {
                    console.error("Error: ", error)
                  })
              }
            })
            .catch(err => {
              console.log('Error getting document', err)
            })
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    } else if (
      type != 'hiring' &&
      joiningYear &&
      previousValue.joiningYear &&
      joiningYear != previousValue.joiningYear
    ) {
      // recruiter がパスの入社年度を変更した時
      return admin.firestore()
        .collection('companies')
        .doc(companyId)
        .collection('yearPasses')
        .doc(String(previousValue.joiningYear))
        .get()
        .then(previousDoc => {
          // 変更前の入社年度のパスカウント　更新
          if (previousDoc.exists) {
            var count = previousDoc.data().count
            var passData
            if (type == 'offer') {
              // 内定パス
              count.offer.all -= 1

              // 使用済みなら usedも-1
              if (isAccepted) {
                count.offer.used -= 1
              }
            } else if (type == 'limited') {
              // 先着パス
              count.limited.all -= 1

              // 使用済みなら usedも-1
              if (isAccepted) {
                count.limited.used -= 1
              }
            }
            // 更新
            admin.firestore()
              .collection('companies')
              .doc(companyId)
              .collection('yearPasses')
              .doc(String(previousValue.joiningYear))
              .update({
                count: count
              })
              .then(() => {
                console.log('updatePassesCount: update previous year passes count completed.')
              })
              .catch((error) => {
                console.error("Error updating document: ", error)
              })
          }

          // 変更後の入社年度のパスカウント更新
          admin.firestore()
            .collection('companies')
            .doc(companyId)
            .collection('yearPasses')
            .doc(String(joiningYear))
            .get()
            .then(newDoc => {
              var passData
              if (newDoc.exists) {
                var count = newDoc.data().count
                if (type == 'offer') {
                  // 内定パス
                  count.offer.all += 1

                  // 使用済みなら usedも+1
                  if (isAccepted) {
                    count.offer.used += 1
                  }
                } else if (type == 'limited') {
                  // 先着パス
                  count.limited.all += 1

                  // 使用済みなら usedも+1
                  if (isAccepted) {
                    count.limited.used += 1
                  }
                }
                // 更新
                admin.firestore()
                  .collection('companies')
                  .doc(companyId)
                  .collection('yearPasses')
                  .doc(String(joiningYear))
                  .update({
                    count: count
                  })
                  .then(() => {
                    console.log('updatePassesCount: update new year passes count completed.')
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error)
                  })
              } else {
                // まだ年度が存在しない場合
                if (type == 'offer') {
                  // 内定パス
                  passData = {
                    count: {
                      hiring: {
                        used: 0
                      },
                      offer: {
                        all: 1,
                        used: 0
                      },
                      limited: {
                        all: 0,
                        used: 0
                      }
                    }
                  }
                  // 使用済みなら usedも+1
                  if (isAccepted) {
                    passData.count.offer.used += 1
                  }
                } else if (type == 'limited') {
                  // 先着パス
                  passData = {
                    count: {
                      hiring: {
                        used: 0
                      },
                      offer: {
                        all: 0,
                        used: 0
                      },
                      limited: {
                        all: 1,
                        used: 0
                      }
                    }
                  }
                  // 使用済みなら usedも+1
                  if (isAccepted) {
                    passData.count.limited.used += 1
                  }
                }
                passData.year = joiningYear
                passData.limit = null

                // 更新
                admin.firestore()
                  .collection('companies')
                  .doc(companyId)
                  .collection('yearPasses')
                  .doc(String(joiningYear))
                  .set(passData)
                  .then(() => {
                    console.log('updatePassesCount: update new year passes count completed.')
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error)
                  })
              }
            })
            .catch((error) => {
              console.error("Error getting document: ", error)
            })
        })
        .catch((error) => {
          console.error("Error getting document: ", error)
        })
    } else {
      return 0
    }
  })

// 候補者のステータスが変更した時の処理(候補者数やパスの発行数を更新する)
exports.updateCompany = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/candidates/{candidateId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()
    const beforeStatus = previousValue.status
    const newStatus = newValue.status

    // ステータス変化なし
    if (
      newStatus.scouted == beforeStatus.scouted &&
      newStatus.inbox == beforeStatus.inbox &&
      newStatus.inProcess == beforeStatus.inProcess &&
      newStatus.intern == beforeStatus.intern &&
      newStatus.pass == beforeStatus.pass &&
      newStatus.contracted == beforeStatus.contracted &&
      newStatus.hired == beforeStatus.hired &&
      newStatus.rejected == beforeStatus.rejected
    ) {
      return 0
    }

    if (newValue.status.scouted == true || newValue.status.inbox == true ||
      previousValue.status.rejected == true || previousValue.status.hired == true) {
      return 0
    }

    const companyId = context.params.companyId
    const candidateId = context.params.candidateId
    const passType = newValue.pass.type
    const type = newValue.type

    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          // candidate
          var currentCandidates = doc.data().currentCandidates
          var allCandidates = doc.data().allCandidates

          if (beforeStatus.scouted) {
            currentCandidates.scouted -= 1
          } else if (beforeStatus.inbox) {
            currentCandidates.inbox -= 1
          } else if (beforeStatus.inProcess) {
            currentCandidates.inProcess -= 1
          } else if (beforeStatus.intern) {
            currentCandidates.intern -= 1
          } else if (beforeStatus.pass) {
            currentCandidates.pass -= 1
          } else if (beforeStatus.contracted) {
            currentCandidates.contracted -= 1
          }

          if (newStatus.inProcess) {
            currentCandidates.inProcess += 1
            allCandidates.inProcess.all += 1
            if (type == 'scout') {
              allCandidates.inProcess.scout += 1
            } else {
              allCandidates.inProcess.application += 1
            }
          } else if (newStatus.intern) {
            currentCandidates.intern += 1
            allCandidates.intern.all += 1
            if (type == 'scout') {
              allCandidates.intern.scout += 1
            } else {
              allCandidates.intern.application += 1
            }
          } else if (newStatus.pass) {
            currentCandidates.pass += 1
            allCandidates.pass.all += 1
            if (type == 'scout') {
              allCandidates.pass.scout += 1
            } else {
              allCandidates.pass.application += 1
            }
          }  else if (newStatus.contracted) {
            currentCandidates.contracted += 1
            allCandidates.contracted.all += 1
            if (type == 'scout') {
              allCandidates.contracted.scout += 1
            } else {
              allCandidates.contracted.application += 1
            }
          } else if (newStatus.hired) {
            currentCandidates.hired += 1
            allCandidates.hired.all += 1
            if (type == 'scout') {
              allCandidates.hired.scout += 1
            } else {
              allCandidates.hired.application += 1
            }
          } else if (newStatus.rejected) {
            allCandidates.rejected.all += 1
            if (type == 'scout') {
              allCandidates.rejected.scout += 1
            } else {
              allCandidates.rejected.application += 1
            }
          }

          var companyData = {
            currentCandidates: currentCandidates,
            allCandidates: allCandidates
          }
          // hiringPassCount
          if ((newStatus.hired || newStatus.rejected) && passType == 'hiring') {
            var hiringPassCount = doc.data().hiringPassCount
            companyData.hiringPassCount = hiringPassCount - 1
          }

          admin.firestore().collection('companies')
            .doc(companyId)
            .update(companyData)
            .then(() => {
              console.log('updateCompany completed.')
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  })

// recruiterがスカウトした時の処理
exports.scoutUser = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/candidates/{candidateId}')
  .onCreate((snap, context) => {
    if (snap.data().status.scouted == false) {
      return 0
    }
    const user = snap.data().user
    const pic = snap.data().scout.pic
    const message = snap.data().scout.message
    const createdAt = snap.data().createdAt
    const companyId = context.params.companyId
    const candidateId = context.params.candidateId

    // company の応募者数の更新、応募者の情報格納, スカウトメッセージ送信
    return admin.firestore()
      .collection('companies').doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const companyName = doc.data().companyName
          const companyImageUrl = doc.data().imageUrl
          var currentCandidates = doc.data().currentCandidates
          var allCandidates = doc.data().allCandidates
          // 処理が完了したかのフラグ
          var isUpdatedCandidates = false
          var isSendedMessage = false

          // company の応募者数の更新、応募者の情報格納
          if (currentCandidates) {
            currentCandidates.scouted += 1
          } else {
            currentCandidates = {
              scouted: 1,
              inbox: 0,
              inProcess: 0,
              intern: 0,
              pass: 0,
              contracted: 0,
              hired: 0
            }
          }

          const initialValue = {
            all: 0,
            scout: 0,
            application: 0,
          }
          if (allCandidates) {
            allCandidates.scouted += 1
          } else {
            allCandidates = {
              scouted: 1,
              inbox: 0,
              inProcess: initialValue,
              intern: initialValue,
              pass :initialValue,
              contracted: initialValue,
              hired: initialValue,
              rejected: initialValue,
            }
          }

          const batch = admin.firestore().batch()
          const companyRef = admin.firestore().collection('companies').doc(companyId)
          batch.update(companyRef, {
            currentCandidates: currentCandidates,
            allCandidates: allCandidates,
          })
          const companyScoutedUsersRef = admin.firestore().collection('companies').doc(companyId).collection('scoutedUsers').doc()
          batch.set(companyScoutedUsersRef, {
            user: user,
            createdAt: createdAt,
          })
          batch.commit()
            .then(() => {
              isUpdatedCandidates = true
              if (isUpdatedCandidates && isSendedMessage) {
                console.log('scoutUser completed.')
              }
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })

          // chatにスカウト メッセージを送信(chatがなければ作成)
          admin.firestore()
            .collection('chats')
            .where('companyId', '==', companyId)
            .where('uid', '==', user.uid)
            .get()
            .then(function(snapshot) {
              if (!snapshot.empty) {
                var docCount = 0
                snapshot.forEach(function(chatDoc) {
                  docCount += 1
                  if (docCount == 1) {
                    const batch = admin.firestore().batch()
                    // スカウトメッセージ作成
                    const messagesRef = admin.firestore().collection('chats').doc(chatDoc.id)
                      .collection('messages').doc()
                    batch.set(messagesRef, {
                      pic: pic,
                      message: message,
                      createdAt: createdAt,
                      type: 'scout',
                    })
                    // candidate に chatId 格納
                    const candidateRef = admin.firestore().collection('companies').doc(companyId)
                      .collection('candidates').doc(candidateId)
                    batch.update(candidateRef, {
                      chatId: chatDoc.id
                    })
                    // 通知
                    const notificationRef = admin.firestore().collection('users').doc(user.uid)
                      .collection('notifications').doc()
                    const url = '/messages/' + chatDoc.id
                    batch.set(notificationRef, {
                      type: 'normal',
                      isImportant: true,
                      content: companyName + 'にスカウトされました！ メッセージを確認してみましょう。',
                      createdAt: new Date(),
                      url: url,
                      isUnread: true,
                    })
                    batch.commit()
                      .then(() => {
                        isSendedMessage = true
                        if (isUpdatedCandidates && isSendedMessage) {
                          admin.firestore().collection('users')
                            .doc(user.uid)
                            .get()
                            .then(userDoc => {
                              if (userDoc.exists) {
                                if (userDoc.data().notificationsSetting == null || userDoc.data().notificationsSetting.scout) {
                                  // スカウトされたユーザーにメール送信
                                  const mailOptions = {
                                    from: `LightHouse <noreply@firebase.com>`,
                                    to: userDoc.data().email,
                                  }
                                  mailOptions.subject = `${companyName}にスカウトされました！`
                                  mailOptions.text = `${companyName}にスカウトされました！　ご確認ください。`
                                  mailTransport.sendMail(mailOptions, (err, info) => {
                                    if (err) {
                                      console.log(err)
                                    }
                                    console.log('New scout email sent to:', userDoc.data().email)
                                  })
                                }
                              }
                            })
                            .catch((error) => {
                              console.error("Error adding document: ", error)
                            })

                          console.log('scoutUser completed.')
                        }
                      })
                      .catch((error) => {
                        console.error("Error adding document: ", error)
                      })
                  }
                })
              } else {
                const chatId = admin.firestore().collection('chats').doc().id
                var chatData = {
                  uid: user.uid,
                  userName: user.name,
                  companyId: companyId,
                  companyName: companyName,
                  lastMessage: message,
                  messagesExist: true,
                  updatedAt: createdAt,
                }
                if (user.imageUrl) {
                  chatData.profileImageUrl = user.imageUrl
                }
                if (companyImageUrl) {
                  chatData.companyImageUrl = companyImageUrl
                }

                const batch = admin.firestore().batch()
                // chat 作成
                const chatsRef = admin.firestore().collection('chats').doc(chatId)
                batch.set(chatsRef, chatData)
                // スカウトメッセージ作成
                const messagesRef = admin.firestore().collection('chats').doc(chatId)
                  .collection('messages').doc()
                batch.set(messagesRef, {
                  pic: pic,
                  message: message,
                  createdAt: createdAt,
                  type: 'scout',
                })
                // candidate に chatId 格納
                const candidateRef = admin.firestore().collection('companies').doc(companyId)
                  .collection('candidates').doc(candidateId)
                batch.update(candidateRef, {
                  chatId: chatId
                })
                // 通知
                const notificationRef = admin.firestore().collection('users').doc(user.uid)
                  .collection('notifications').doc()
                const url = '/messages/' + chatId
                batch.set(notificationRef, {
                  type: 'normal',
                  isImportant: true,
                  content: companyName + 'にスカウトされました！ メッセージを確認してみましょう。',
                  createdAt: new Date(),
                  url: url,
                  isUnread: true,
                })
                batch.commit()
                  .then(() => {
                    isSendedMessage = true
                    if (isUpdatedCandidates && isSendedMessage) {
                      admin.firestore().collection('users')
                        .doc(user.uid)
                        .get()
                        .then(userDoc => {
                          if (userDoc.exists) {
                            if (userDoc.data().notificationsSetting == null || userDoc.data().notificationsSetting.scout) {
                              // スカウトされたユーザーにメール送信
                              const mailOptions = {
                                from: `LightHouse <noreply@firebase.com>`,
                                to: userDoc.data().email,
                              }
                              mailOptions.subject = `${companyName}にスカウトされました！`
                              mailOptions.text = `${companyName}にスカウトされました！　ご確認ください。`
                              mailTransport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                  console.log(err)
                                }
                                console.log('New scout email sent to:', userDoc.data().email)
                              })
                            }
                          }
                        })
                        .catch((error) => {
                          console.error("Error adding document: ", error)
                        })

                      console.log('scoutUser completed.')
                    }
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error)
                  })
              }
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

// ユーザーが応募した時の処理
exports.applyForJob = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/candidates/{candidateId}')
  .onCreate((snap, context) => {
    if (snap.data().status.inbox == false) {
      return 0
    }
    const companyId = context.params.companyId
    const candidateId = context.params.candidateId
    const uid = snap.data().user.uid
    const user = snap.data().user
    const jobId = snap.data().jobId
    const createdAt = snap.data().createdAt

    // company の応募者数の更新、応募者の情報格納
    return admin.firestore()
      .collection('companies').doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const companyName = doc.data().companyName
          const companyImageUrl = doc.data().imageUrl
          const members = doc.data().members
          var currentCandidates = doc.data().currentCandidates
          var allCandidates = doc.data().allCandidates
          // 処理が完了したかのフラグ
          var isUpdatedCandidates = false
          var setChatId = false

          if (currentCandidates) {
            currentCandidates.inbox += 1
          } else {
            currentCandidates = {
              scouted: 0,
              inbox: 1,
              inProcess: 0,
              intern: 0,
              pass: 0,
              contracted: 0,
              hired: 0
            }
          }

          const initialValue = {
            all: 0,
            scout: 0,
            application: 0,
          }

          if (allCandidates) {
            allCandidates.inbox += 1
          } else {
            allCandidates = {
              scouted: 0,
              inbox: 1,
              inProcess: initialValue,
              intern: initialValue,
              pass: initialValue,
              contracted: initialValue,
              hired: initialValue,
              rejected: initialValue,
            }
          }

          const batch = admin.firestore().batch()
          // 候補者カウント更新
          const companyRef = admin.firestore().collection('companies').doc(companyId)
          batch.update(companyRef, {
            currentCandidates: currentCandidates,
            allCandidates: allCandidates,
          })
          const companyApplicantsRef = admin.firestore().collection('companies').doc(companyId).collection('applicants').doc()
          batch.set(companyApplicantsRef, {
            user: user,
            createdAt: createdAt,
            jobId: jobId
          })
          // 通知
          members.forEach((member, i) => {
            const notificationRef = admin.firestore().collection('users').doc(member.uid)
              .collection('notifications').doc()
            const url = '/recruiter/candidates/' + candidateId
            batch.set(notificationRef, {
              type: 'normal',
              isImportant: true,
              content: user.name + 'さんから応募が届きました。',
              createdAt: new Date(),
              url: url,
              isUnread: true,
            })
          })
          batch.commit()
            .then(() => {
              isUpdatedCandidates = true
              if (isUpdatedCandidates && setChatId) {
                console.log('applyForJob completed.')
              }
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })

          // chat作成、chatIdをcandidateに格納
          admin.firestore()
            .collection('chats')
            .where('companyId', '==', companyId)
            .where('uid', '==', user.uid)
            .get()
            .then(function(snapshot) {
              if (!snapshot.empty) {
                var docCount = 0
                snapshot.forEach(function(chatDoc) {
                  docCount += 1
                  if (docCount == 1) {
                    admin.firestore().collection('companies')
                      .doc(companyId)
                      .collection('candidates')
                      .doc(candidateId)
                      .update({
                        chatId: chatDoc.id
                      })
                      .then(() => {
                        setChatId = true
                        if (isUpdatedCandidates && setChatId) {
                          // 応募が来たら担当者にメール送信
                          members.forEach((member, i) => {
                            if (member.notificationsSetting == null ||
                              member.notificationsSetting.application) {
                              const mailOptions = {
                                from: `LightHouse <noreply@firebase.com>`,
                                to: member.email,
                              }
                              mailOptions.subject = `${user.name}さんから応募が来ました。`
                              mailOptions.text = `${user.name}さんから応募が来ました。　ご確認ください。`
                              mailTransport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                  console.log(err)
                                }
                                console.log('New apply email sent to:', member.email)
                              })
                            }
                          })
                          console.log('applyForJob completed.')
                        }
                      })
                      .catch((error) => {
                        console.error("Error adding document: ", error)
                      })
                  }
                })
              } else {
                const chatId = admin.firestore().collection('chats').doc().id
                var chatData = {
                  uid: user.uid,
                  userName: user.name,
                  companyId: companyId,
                  companyName: companyName,
                  messagesExist: false,
                  updatedAt: createdAt,
                }
                if (user.imageUrl) {
                  chatData.profileImageUrl = user.imageUrl
                }
                if (companyImageUrl) {
                  chatData.companyImageUrl = companyImageUrl
                }

                const batch = admin.firestore().batch()
                const chatsRef = admin.firestore().collection('chats').doc(chatId)
                batch.set(chatsRef, chatData)
                const candidateRef = admin.firestore().collection('companies').doc(companyId)
                  .collection('candidates').doc(candidateId)
                batch.update(candidateRef, {
                  chatId: chatId
                })
                batch.commit()
                  .then(() => {
                    setChatId = true
                    if (isUpdatedCandidates && setChatId) {
                      // 応募が来たら担当者にメール送信
                      members.forEach((member, i) => {
                        if (member.notificationsSetting == null ||
                          member.notificationsSetting.application) {
                          const mailOptions = {
                            from: `LightHouse <noreply@firebase.com>`,
                            to: member.email,
                          }
                          mailOptions.subject = `${user.name}さんから応募が来ました。`
                          mailOptions.text = `${user.name}さんから応募が来ました。　ご確認ください。`
                          mailTransport.sendMail(mailOptions, (err, info) => {
                            if (err) {
                              console.log(err)
                            }
                            console.log('New apply email sent to:', member.email)
                          })
                        }
                      })

                      console.log('applyForJob completed.')
                    }
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error)
                  })
              }
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

// 採用担当者が募集を投稿した時の処理
exports.postJob = functions.region('asia-northeast1')
  .firestore
  .document('jobs/{jobId}/detail/{detailId}')
  .onCreate((snap, context) => {
    const jobId = context.params.jobId
    const companyId = snap.data().companyId
    const initialStatus = snap.data().initialStatus

    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const companyName = doc.data().companyName
          const companyImageUrl = doc.data().companyImageUrl
          const mission = doc.data().mission
          const vision = doc.data().vision
          const value = doc.data().value
          const culture = doc.data().culture
          const system = doc.data().system
          const why = doc.data().why
          const what = doc.data().what
          const services = doc.data().services
          const welfare = doc.data().welfare
          const feedback = doc.data().feedback
          const points = doc.data().points

          var jobData = {
            companyName: companyName,
            status: initialStatus,
            feedback: feedback,
            points: points
          }
          if (companyImageUrl) {
            jobData.companyImageUrl = companyImageUrl
          }
          if (doc.data().reviews) {
            rating = doc.data().reviews.rating
            jobData.rating = rating
          }

          // 投稿更新
          const batch = admin.firestore().batch()
          const jobsRef = admin.firestore().collection('jobs').doc(jobId)
          batch.update(jobsRef, jobData)

          var jobDetailData = {
            companyName: companyName,
            status: initialStatus,
            feedback: feedback,
            points: points
          }
          if (companyImageUrl) {
            jobDetailData.companyImageUrl = companyImageUrl
          }
          if (mission) {
            jobDetailData.mission = mission
          }
          if (vision) {
            jobDetailData.vision = vision
          }
          if (value) {
            jobDetailData.value = value
          }
          if (culture) {
            jobDetailData.culture = culture
          }
          if (system) {
            jobDetailData.system = system
          }
          if (why) {
            jobDetailData.why = why
          }
          if (what) {
            jobDetailData.what = what
          }
          if (services) {
            jobDetailData.services = services
          }
          if (welfare) {
            jobDetailData.welfare = welfare
          }

          const jobDetailRef = admin.firestore().collection('jobs').doc(jobId).collection('detail').doc(jobId)
          batch.update(jobDetailRef, jobDetailData)
          batch.commit()
            .then(() => {
              console.log('postJob completed.')
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

// 企業アカウントが削除された時の処理
exports.deleteCompany = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}')
  .onUpdate((change, context) => {
    const previousValue = change.before.data()
    const newValue = change.after.data()
    const companyId = context.params.companyId
    const isDeleted = newValue.isDeleted

    // 変化がない場合は終了
    if (isDeleted == previousValue.isDeleted) {
      return 0
    }

    return admin.firestore()
      .collection('jobs')
      .where('companyId', '==', companyId)
      .get()
      .then(function(snapshot) {
        // job関連更新
        const batch = admin.firestore().batch()

        snapshot.forEach(function(doc) {
          const jobRef = admin.firestore().collection('jobs').doc(doc.id)
          batch.update(jobRef, {
            status: 'private'
          })

          const jobDetailRef = admin.firestore().collection('jobs').doc(doc.id)
            .collection('detail')
            .doc(doc.id)
          batch.update(jobDetailRef, {
            status: 'private'
          })
        })
        batch.commit()
          .then(() => {
            console.log('deleteCompany completed.')
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  })

// 企業情報を編集した時の処理
exports.editCompanyProfile = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/detail/{companyDetailId}')
  .onUpdate((change, context) => {
    const previousValue = change.before.data()
    const newValue = change.after.data()
    const companyId = context.params.companyId
    const companyName = newValue.companyName
    const companyImageUrl = newValue.companyImageUrl
    const mission = newValue.mission
    const vision = newValue.vision
    const value = newValue.value
    const culture = newValue.culture
    const system = newValue.system
    const why = newValue.why
    const what = newValue.what
    const services = newValue.services
    const welfare = newValue.welfare
    const url = newValue.url
    const location = newValue.location
    const foundedDate = newValue.foundedDate
    const employeesCount = newValue.employeesCount
    const feedback = newValue.feedback
    const members = newValue.members
    var isCompanyNameChanged = false
    var isCompanyImageUrlChanged = false

    // 変化がない場合は終了
    if (
      companyName == previousValue.companyName &&
      companyImageUrl == previousValue.companyImageUrl &&
      mission == previousValue.mission &&
      vision == previousValue.vision &&
      value == previousValue.value &&
      culture == previousValue.culture &&
      system == previousValue.system &&
      why == previousValue.why &&
      what == previousValue.what &&
      services == previousValue.services &&
      welfare == previousValue.welfare &&
      url == previousValue.url &&
      location == previousValue.location &&
      foundedDate == previousValue.foundedDate &&
      employeesCount == previousValue.employeesCount &&
      feedback.all == previousValue.feedback.all &&
      feedback.writtenCount == previousValue.feedback.writtenCount &&
      members == previousValue.members
    ) {
      return 0
    }

    if (companyName != previousValue.companyName) {
      isCompanyNameChanged = true
    }
    if (companyImageUrl != previousValue.companyImageUrl) {
      isCompanyImageUrlChanged = true
    }
    var companyData = {
      companyName: companyName,
    }
    if (companyImageUrl) {
      companyData.companyImageUrl = companyImageUrl
    }

    return admin.firestore()
      .collection('jobs')
      .where('companyId', '==', companyId)
      .get()
      .then(function(snapshot) {
        // job関連更新
        const jobBatch = admin.firestore().batch()

        snapshot.forEach(function(doc) {
          if (isCompanyNameChanged || isCompanyImageUrlChanged) {
            const jobRef = admin.firestore().collection('jobs').doc(doc.id)
            jobBatch.update(jobRef, companyData)
          }
          const jobDetailRef = admin.firestore().collection('jobs').doc(doc.id)
            .collection('detail')
            .doc(doc.id)

          var jobDetailData = {
            companyName: companyName,
          }
          if (companyImageUrl) {
            jobDetailData.companyImageUrl = companyImageUrl
          }
          if (mission) {
            jobDetailData.mission = mission
          }
          if (vision) {
            jobDetailData.vision = vision
          }
          if (value) {
            jobDetailData.value = value
          }
          if (culture) {
            jobDetailData.culture = culture
          }
          if (system) {
            jobDetailData.system = system
          }
          if (why) {
            jobDetailData.why = why
          }
          if (what) {
            jobDetailData.what = what
          }
          if (services) {
            jobDetailData.services = services
          }
          if (welfare) {
            jobDetailData.welfare = welfare
          }
          if (url) {
            jobDetailData.url = url
          }
          if (location) {
            jobDetailData.location = location
          }
          if (foundedDate) {
            jobDetailData.foundedDate = foundedDate
          }
          if (employeesCount) {
            jobDetailData.employeesCount = employeesCount
          }
          if (feedback) {
            jobDetailData.feedback = feedback
          }
          jobBatch.update(jobDetailRef, jobDetailData)
        })
        jobBatch.commit()
          .then(() => {
            console.log('editCompanyProfile job completed.')
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })

          // name or imageUrl が変わっていれば続行
        if (isCompanyNameChanged || isCompanyImageUrlChanged) {
          // chats
          admin.firestore()
            .collection('chats')
            .where('companyId', '==', companyId)
            .get()
            .then(function(snapshot) {
              const batch = admin.firestore().batch()

              snapshot.forEach(function(doc) {
                const chatRef = admin.firestore().collection('chats').doc(doc.id)
                batch.update(chatRef, companyData)
              })
              batch.commit()
                .then(() => {
                  console.log('editCompanyProfile chat completed.')
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
            })
            .catch(err => {
              console.log('Error getting document', err)
            })

          // reviews
          admin.firestore()
            .collection('reviews')
            .where('companyId', '==', companyId)
            .get()
            .then(function(snapshot) {
              const batch = admin.firestore().batch()

              snapshot.forEach(function(doc) {
                const reviewRef = admin.firestore().collection('reviews').doc(doc.id)
                batch.update(reviewRef, companyData)
              })
              batch.commit()
                .then(() => {
                  console.log('editCompanyProfile review completed.')
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
            })
            .catch(err => {
              console.log('Error getting document', err)
            })

          // feedbacks
          admin.firestore()
            .collection('feedbacks')
            .where('companyId', '==', companyId)
            .get()
            .then(function(snapshot) {
              const batch = admin.firestore().batch()

              snapshot.forEach(function(doc) {
                const feedbackRef = admin.firestore().collection('feedbacks').doc(doc.id)
                batch.update(feedbackRef, companyData)
              })
              batch.commit()
                .then(() => {
                  console.log('editCompanyProfile feedback completed.')
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
            })
            .catch(err => {
              console.log('Error getting document', err)
            })

          // passes
          admin.firestore()
            .collection('passes')
            .where('companyId', '==', companyId)
            .get()
            .then(function(snapshot) {
              const batch = admin.firestore().batch()

              snapshot.forEach(function(doc) {
                const passRef = admin.firestore().collection('passes').doc(doc.id)
                batch.update(passRef, companyData)
              })
              batch.commit()
                .then(() => {
                  console.log('editCompanyProfile pass completed.')
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
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

// 問い合わせがあった時
exports.sendAddCompanyMail = functions
  .https
  .onCall((data, context) => {
    const mailOptions = {
      from: `${data.email}`,
      to: 'go26dev@gmail.com',
    }
    mailOptions.subject = `${data.companyName}の${data.userName}様からのお問い合わせ`
    mailOptions.text =
      `${data.companyName}の${data.userName}様からお問い合わせを頂きました。\n\n
      id: ${data.companyId} \n\n
      メールアドレス： ${data.email} \n\n
      お問い合わせ内容：${data.inquiry}`
    mailTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
      }
      console.log('sendAddCompanyMail completed.')
    })
  })

// 担当者がサインアップした時の処理
exports.createRecruiter = functions.region('asia-northeast1')
  .firestore
  .document('users/{uid}')
  .onCreate((snap, context) => {
    const uid = context.params.uid
    const companyId = snap.data().companyId
    const firstName = snap.data().firstName
    const lastName = snap.data().lastName
    const email = snap.data().email
    const position = snap.data().position
    const notificationsSetting = snap.data().notificationsSetting

    // userの場合終了
    if (companyId == null) {
      return 0
    }

    // 企業の member 内の情報更新
    return admin.firestore()
      .collection('companies').doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          var members = doc.data().members
          var member = {
            uid: uid,
            name: lastName + ' ' + firstName,
            email: email,
            notificationsSetting: notificationsSetting
          }
          if (position) {
            member.position = position
          }

          if (members.length == 1) {
            if (members[0].isInitialMember != null && members[0].isInitialMember) {
              member.position = members[0].position
              members = [member]
            } else {
              members.push(member)
            }
          } else if (members.length > 1) {
            members.push(member)
          }

          // members更新
          const batch = admin.firestore().batch()
          const companyRef = admin.firestore().collection('companies').doc(companyId)
          batch.update(companyRef, {
            members: members,
          })
          const companyDetailRef = admin.firestore().collection('companies').doc(companyId).collection('detail').doc(companyId)
          batch.update(companyDetailRef, {
            members: members,
          })
          batch.commit()
            .then(() => {
              console.log('createInvitedMemberProfile completed.')
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

// 担当者が設定を編集した時の処理（メールアドレス、通知設定変更、アカウント削除）
exports.editRecruiterSetting = functions.region('asia-northeast1')
  .firestore
  .document('users/{uid}')
  .onUpdate((change, context) => {
    const previousValue = change.before.data()
    const newValue = change.after.data()
    const uid = context.params.uid
    const companyId = newValue.companyId
    const email = newValue.email
    const notificationsSetting = newValue.notificationsSetting
    const isDeleted = newValue.isDeleted

    // 担当者でない場合は終了
    if (companyId == null) {
      return 0
    }

    if (
      email != previousValue.email ||
      notificationsSetting.application != previousValue.notificationsSetting.application ||
      notificationsSetting.acceptPass != previousValue.notificationsSetting.acceptPass
    ) {
      // 設定が変わっている場合
      // 企業の member 内の情報更新
      return admin.firestore()
        .collection('companies').doc(companyId)
        .get()
        .then(doc => {
          if (doc.exists) {
            let members = doc.data().members

            var index
            members.forEach((member, i) => {
              if (member.uid == uid) {
                index = i
              }
            })

            var member = members[index]
            member.email = email
            member.notificationsSetting = notificationsSetting
            members.splice(index, 1)
            members.push(member)

            // members更新
            const batch = admin.firestore().batch()
            const companyRef = admin.firestore().collection('companies').doc(companyId)
            batch.update(companyRef, {
              members: members,
            })
            const companyDetailRef = admin.firestore().collection('companies').doc(companyId).collection('detail').doc(companyId)
            batch.update(companyDetailRef, {
              members: members,
            })
            batch.commit()
              .then(() => {
                console.log('recruiter editRecruiterSetting completed.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    } else if (isDeleted != previousValue.isDeleted) {
      // アカウントが削除された場合
      // 企業の member 内の情報更新
      return admin.firestore()
        .collection('companies').doc(companyId)
        .get()
        .then(doc => {
          if (doc.exists) {
            var companyData
            var members = doc.data().members

            if (members.length <= 1) {
              members = []
              companyData = {
                members: members,
                isDeleted: true
              }
            } else {
              var index
              members.forEach((member, i) => {
                if (member.uid == uid) {
                  index = i
                }
              })
              members.splice(index, 1)
              companyData = {
                members: members,
              }
            }

            // members更新
            const batch = admin.firestore().batch()
            const companyRef = admin.firestore().collection('companies').doc(companyId)
            batch.update(companyRef, companyData)
            const companyDetailRef = admin.firestore().collection('companies').doc(companyId).collection('detail').doc(companyId)
            batch.update(companyDetailRef, companyData)
            batch.commit()
              .then(() => {
                console.log('recruiter editRecruiterSetting completed.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    }
  })

// プロフィールを編集した時の処理
exports.editProfile = functions.region('asia-northeast1')
  .firestore
  .document('users/{uid}/profile/{profile}')
  .onUpdate((change, context) => {
    const previousValue = change.before.data()
    const newValue = change.after.data()
    const uid = context.params.uid
    const companyId = newValue.companyId
    const position = newValue.position
    const firstName = newValue.firstName
    const lastName = newValue.lastName
    const imageUrl = newValue.imageUrl
    const selfIntro = newValue.selfIntro
    const whatWantToDo = newValue.whatWantToDo
    const portfolio = newValue.portfolio
    const skills = newValue.skills
    const links = newValue.links
    const graduationDate = newValue.graduationDate
    const university = newValue.university
    const faculty = newValue.faculty
    const department = newValue.department
    const desiredOccupations = newValue.desiredOccupations

    if (companyId == null) {
      // user が profile を編集した時
      // プロフィール完成度などを更新
      var percentage = 0
      var canSearch = false

      percentage += (imageUrl && imageUrl != '') ? 12 : 0
      if (desiredOccupations) {
        var isSelected = false
        if (desiredOccupations.engineer == true) {
          isSelected = true
        }
        if (desiredOccupations.designer == true) {
          isSelected = true
        }
        if (desiredOccupations.sales == true) {
          isSelected = true
        }
        if (desiredOccupations.others == true) {
          isSelected = true
        }
        percentage += isSelected ? 12 : 0
      }
      percentage += (selfIntro && selfIntro != '') ? 12 : 0
      percentage += (whatWantToDo && whatWantToDo != '') ? 12 : 0
      percentage += (portfolio && portfolio.length > 0) ? 12 : 0
      percentage += (skills && skills.length > 0) ? 12 : 0
      percentage += (links && links.length > 0) ? 12 : 0
      percentage += (university && university != '') ? 4 : 0
      percentage += (faculty && faculty != '') ? 4 : 0
      percentage += (department && department != '') ? 4 : 0
      percentage += (graduationDate && graduationDate != '') ? 4 : 0

      // プロフィール完成度が 50% を超えていたら検索に表示される
      if (percentage > 50) {
        canSearch = true
      }

      admin.firestore()
        .collection('users')
        .doc(uid)
        .update({
          completionPercentage: percentage,
          canSearch: canSearch
        })
        .then(() => {
          console.log('user editProfile: update completionPercentage completed.')
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })

      if (
        firstName != previousValue.firstName ||
        lastName != previousValue.lastName ||
        imageUrl != previousValue.imageUrl
      ) {
        var userData = {
          userName: lastName + ' ' + firstName,
        }
        if (imageUrl) {
          userData.profileImageUrl = imageUrl
        }

        // chats 更新
        return admin.firestore()
          .collection('chats')
          .where('uid', '==', uid)
          .get()
          .then(function(snapshot) {
            const batch = admin.firestore().batch()

            snapshot.forEach(function(doc) {
              const chatRef = admin.firestore().collection('chats').doc(doc.id)
              batch.update(chatRef, userData)
            })

            batch.commit()
              .then(() => {
                console.log('user editProfile completed.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      } else {
        return 0
      }
    } else {
      // recruiter
      // name, imageUrl, position, selfIntro どれも変わっていない場合はreturn
      if (
        firstName == previousValue.firstName &&
        lastName == previousValue.lastName &&
        imageUrl == previousValue.imageUrl &&
        position == previousValue.position &&
        selfIntro == previousValue.selfIntro
      ) {
        return 0
      }

      // recruiter が profile を編集した時
      // 企業の member 内の情報更新
      return admin.firestore()
        .collection('companies').doc(companyId)
        .get()
        .then(doc => {
          if (doc.exists) {
            let members = doc.data().members

            var index
            members.forEach((member, i) => {
              if (member.uid == uid) {
                index = i
              }
            })

            const member = {
              uid: uid,
              position: position,
              name: lastName + ' ' + firstName,
              selfIntro: selfIntro,
            }
            members.splice(index, 1)
            members.push(member)

            // members更新
            const batch = admin.firestore().batch()
            const companyRef = admin.firestore().collection('companies').doc(companyId)
            batch.update(companyRef, {
              members: members,
            })
            const companyDetailRef = admin.firestore().collection('companies').doc(companyId).collection('detail').doc(companyId)
            batch.update(companyDetailRef, {
              members: members,
            })
            batch.commit()
              .then(() => {
                console.log('recruiter editProfile completed.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    }
  })

// レビューした時の処理
exports.sendReview = functions.region('asia-northeast1')
  .firestore
  .document('reviews/{reviewId}')
  .onCreate((snap, context) => {

    const uid = snap.data().uid
    const companyId = snap.data().companyId
    const content = snap.data().content
    const occupation = snap.data().occupation
    const createdAt = snap.data().createdAt
    const comment = {
      uid: uid,
      reviewId: context.params.reviewId,
      occupation: occupation,
      content: content,
      createdAt: createdAt,
    }

    // job の rating, companies detail の reviews, points を更新
    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          // スコア更新
          var points = doc.data().points
          if (points == null) {
            points = 100
          }
          if (snap.data().all < 1.5) {
            if (points < 2) {
              points = 0
            } else {
              points -= 2
            }
          } else if (snap.data().all >= 1.5 && snap.data().all < 2.5) {
            if (points < 1) {
              points = 0
            } else {
              points -= 1
            }
          } else if (snap.data().all >= 2.5 && snap.data().all < 3.5) {
            // points維持
          } else if (snap.data().all >= 3.5 && snap.data().all < 4.5) {
            points += 1
          } else if (snap.data().all >= 4.5) {
            points += 2
          }

          var reviewCount
          var atmosphere
          var job
          var discretion
          var flexibleSchedule
          var flexibility
          var mentor
          var growth
          var all
          var comments

          if (doc.data().reviews) {
            reviewCount = doc.data().reviews.rating.count
            atmosphere = Math.round((doc.data().reviews.rating.atmosphere * reviewCount + snap.data().atmosphere) / (reviewCount + 1) * 10) / 10
            job = Math.round((doc.data().reviews.rating.job * reviewCount + snap.data().job) / (reviewCount + 1) * 10) / 10
            discretion = Math.round((doc.data().reviews.rating.discretion * reviewCount + snap.data().discretion) / (reviewCount + 1) * 10) / 10
            flexibleSchedule = Math.round((doc.data().reviews.rating.flexibleSchedule * reviewCount + snap.data().flexibleSchedule) / (reviewCount + 1) * 10) / 10
            flexibility = Math.round((doc.data().reviews.rating.flexibility * reviewCount + snap.data().flexibility) / (reviewCount + 1) * 10) / 10
            mentor = Math.round((doc.data().reviews.rating.mentor * reviewCount + snap.data().mentor) / (reviewCount + 1) * 10) / 10
            growth = Math.round((doc.data().reviews.rating.growth * reviewCount + snap.data().growth) / (reviewCount + 1) * 10) / 10
            all = Math.round((atmosphere + job + discretion + flexibleSchedule + flexibility + mentor + growth) / 7 * 10) / 10
            comments = doc.data().reviews.comments

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
          } else {
            reviewCount = 0
            atmosphere = snap.data().atmosphere
            job = snap.data().job
            discretion = snap.data().discretion
            flexibleSchedule = snap.data().flexibleSchedule
            flexibility = snap.data().flexibility
            mentor = snap.data().mentor
            growth = snap.data().growth
            all = Math.round((atmosphere + job + discretion + flexibleSchedule + flexibility + mentor + growth) / 7 * 10) / 10
            comments = [comment]
          }

          const rating = {
            all: all,
            count: reviewCount + 1,
            atmosphere: atmosphere,
            job: job,
            discretion: discretion,
            flexibleSchedule: flexibleSchedule,
            flexibility: flexibility,
            mentor: mentor,
            growth: growth
          }
          const reviews = {
            rating: rating,
            comments: comments,
          }
          // company rating, points 更新
          const batch = admin.firestore().batch()
          const companyRef = admin.firestore().collection('companies').doc(companyId)
          batch.update(companyRef, {
            rating: rating,
            points: points
          })
          const companyDetailRef = admin.firestore().collection('companies').doc(companyId).collection('detail').doc(companyId)
          batch.update(companyDetailRef, {
            reviews: reviews,
            points: points,
          })
          batch.commit()
            .then(() => {
              console.log('sendReview company completed.')
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })

          // job rating, points更新
          admin.firestore()
            .collection('jobs')
            .where('companyId', '==', companyId)
            .get()
            .then(function(snapshot) {
              const jobsBatch = admin.firestore().batch()

              snapshot.forEach(function(doc) {
                const jobRef = admin.firestore().collection('jobs').doc(doc.id)
                jobsBatch.update(jobRef, {
                  rating: rating,
                  points: points
                })
              })
              jobsBatch.commit()
                .then(() => {
                  console.log('sendReview job completed.')
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
            })
            .catch(err => {
              console.log('Error getting document', err)
            })

          // userスコア更新
          admin.firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then(userDoc => {
              var points = userDoc.data().points
              if (points == null) {
                points = 0
              }
              admin.firestore()
                .collection('users')
                .doc(uid)
                .update({
                  points: points + 1,
                })
                .then(() => {
                  console.log('sendReview: update user score completed.')
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
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

// メッセージを送信した時の処理
exports.sendMessageFromUser = functions.region('asia-northeast1')
  .firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate((snap, context) => {
    const chatId = context.params.chatId
    const messageId = context.params.messageId
    const message = snap.data().message
    const user = snap.data().user
    const pic = snap.data().pic

    // chatのupdatedAt, picUnreadCountを更新
    return admin.firestore()
      .collection('chats').doc(chatId)
      .get()
      .then(doc => {
        if (doc.exists) {
          var from
          var picUnreadCount
          var userUnreadCount

          if (user != null && pic == null) {
            from = 'user'
            if (doc.data().picUnreadCount != null) {
              picUnreadCount = doc.data().picUnreadCount
            } else {
              picUnreadCount = 0
            }
          } else if (user == null && pic != null) {
            from = 'pic'
            if (doc.data().userUnreadCount != null) {
              userUnreadCount = doc.data().userUnreadCount
            } else {
              userUnreadCount = 0
            }
          }

          var chatData = {
            updatedAt: snap.data().createdAt,
            lastMessage: message,
            messagesExist: true,
          }

          if (from == 'user') {
            chatData.picUnreadCount = picUnreadCount + 1
          } else if (from == 'pic') {
            chatData.userUnreadCount = userUnreadCount + 1
          }

          admin.firestore()
            .collection('chats').doc(chatId)
            .update(chatData)
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

exports.sendContact = functions
  .https
  .onCall((data, context) => {
    const mailOptions = {
      from: `${data.email}`,
      to: 'go26dev@gmail.com',
    }
    mailOptions.subject = `${data.name}様からのお問い合わせ`
    mailOptions.text = `${data.name}様からお問い合わせを頂きました。\n\n メールアドレス： ${data.email} \n\n お問い合わせ内容：${data.content}`
    mailTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
      }
      console.log('sendContact completed.')
    })
  })
