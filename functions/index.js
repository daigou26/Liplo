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
const admin = require('firebase-admin')
admin.initializeApp()


// 企業メンバーが招待された時の処理
exports.inviteMember = functions.region('asia-northeast1')
  .firestore
  .document('companies/{companyId}/invitedMembers/{memberId}')
  .onCreate((snap, context) => {
    const companyId = context.params.companyId
    const email = snap.data().email
    const companyName = snap.data().companyName
    const userName = snap.data().userName
    const url = `http://localhost:3000/?type=invited&id=${companyId}`

    // 内定パスが渡されたユーザーにメール送信
    const mailOptions = {
      from: `LightHouse <noreply@firebase.com>`,
      to: email,
    }
    mailOptions.subject = `${userName}さんが${companyName}にあなたを招待しました。`
    mailOptions.text = `${userName}さんが${companyName}にあなたを招待しました。${url}にアクセスして、サインアップしてください。`
    return mailTransport.sendMail(mailOptions)
      .then(() => {
        console.log('New pass email sent to:', email)
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
      newStatus.extendedIntern == beforeStatus.extendedIntern &&
      newStatus.pass == beforeStatus.pass &&
      newStatus.contracted == beforeStatus.contracted &&
      newStatus.hired == beforeStatus.hired &&
      newStatus.rejected == beforeStatus.rejected
    ) {
      return 0
    }
    // 前のステータスが選考中、インターン、インターン延長でなければ終了
    if (!(beforeStatus.inProcess || beforeStatus.intern || beforeStatus.extendedIntern)) {
      return 0
    }

    const companyId = context.params.companyId
    const candidateId = context.params.candidateId
    const createdAt = newValue.updatedAt
    const user = newValue.user
    const career = newValue.career
    const occupation = career.internOccupation

    // ステータスがインターンになった時
    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          const companyName = doc.data().companyName
          const companyImageUrl = doc.data().imageUrl

          if (newStatus.intern) {
            const careerId = admin.firestore().collection('users').doc(user.uid)
              .collection('career').doc().id
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

            const batch = admin.firestore().batch()
            // キャリア
            const careerRef = admin.firestore().collection('users').doc(user.uid)
              .collection('career').doc(careerId)
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
          } else if (newStatus.extendedIntern || newStatus.pass || newStatus.rejected) {
            // ステータスがインターン、インターン延長から変わった時
            var careerData = {
              end: true,
              endedAt: new Date()
            }
            if (newStatus.extendedIntern) {
              careerData.isInternExtended = true
            }
            if (beforeStatus.extendedIntern) {
              careerData.extendedInternEnd = true
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
                'のレビューをしましょう！　（レビューをすることで企業がスカウトする際のユーザー検索で上位に表示されやすくなります）',
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
      newStatus.extendedIntern == beforeStatus.extendedIntern &&
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
              content: companyName + 'にフィードバックをもらいました！ 確認してみましょう。',
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

// 候補者のステータスが pass になった時、内定パスを送る処理
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
      newStatus.extendedIntern == beforeStatus.extendedIntern &&
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
    var pass = newValue.pass
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
          const passId = admin.firestore().collection('passes').doc().id

          var passData = {
            uid: user.uid,
            userName: user.name,
            companyId: companyId,
            companyName: companyName,
            createdAt: updatedAt,
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

          const batch = admin.firestore().batch()
          // 内定パス
          const passRef = admin.firestore().collection('passes').doc(passId)
          batch.set(passRef, passData)
          // 内定パスのデータをcandidateに
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
            content: companyName + 'に内定パスをもらいました！ 内定を受諾する場合は、受諾ボタンを押して企業と連絡を取り、内定承諾証などで契約をしましょう。',
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
                      // 内定パスが渡されたユーザーにメール送信
                      const mailOptions = {
                        from: `LightHouse <noreply@firebase.com>`,
                        to: user.email,
                      }
                      mailOptions.subject = `${companyName}に内定パスをもらいました！`
                      mailOptions.text = `${companyName}に内定パスをもらいました！　ご確認ください。`
                      mailTransport.sendMail(mailOptions, (err, info) => {
                        if (err) {
                          console.log(err)
                        }
                        console.log('New pass email sent to:', user.email)
                      })
                    }
                  }
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
              
              console.log('sendPass completed.')
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

// 候補者のステータスが変更した時、候補者数を更新する処理
exports.updateCandidatesCount = functions.region('asia-northeast1')
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
      newStatus.extendedIntern == beforeStatus.extendedIntern &&
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
    const type = newValue.type

    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
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
          } else if (beforeStatus.extendedIntern) {
            currentCandidates.extendedIntern -= 1
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
          } else if (newStatus.extendedIntern) {
            currentCandidates.extendedIntern += 1
            allCandidates.extendedIntern.all += 1
            if (type == 'scout') {
              allCandidates.extendedIntern.scout += 1
            } else {
              allCandidates.extendedIntern.application += 1
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

          admin.firestore().collection('companies')
            .doc(companyId)
            .update({
              currentCandidates: currentCandidates,
              allCandidates: allCandidates
            })
            .then(() => {
              console.log('updateCandidatesCount completed.')
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
              extendedIntern: 0,
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
              extendedIntern: initialValue,
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
                                    to: user.email,
                                  }
                                  mailOptions.subject = `${companyName}にスカウトされました！`
                                  mailOptions.text = `${companyName}にスカウトされました！　ご確認ください。`
                                  mailTransport.sendMail(mailOptions, (err, info) => {
                                    if (err) {
                                      console.log(err)
                                    }
                                    console.log('New scout email sent to:', user.email)
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
                                to: user.email,
                              }
                              mailOptions.subject = `${companyName}にスカウトされました！`
                              mailOptions.text = `${companyName}にスカウトされました！　ご確認ください。`
                              mailTransport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                  console.log(err)
                                }
                                console.log('New scout email sent to:', user.email)
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
              extendedIntern: 0,
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
              extendedIntern: initialValue,
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
              content: user.name + 'さんが応募しました。',
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

          var jobData = {
            companyName: companyName,
            status: initialStatus,
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
            mission: mission,
            vision: vision,
            value: value,
            culture: culture,
            system: system,
            why: why,
            what: what,
            services: services,
            welfare: welfare,
          }
          if (companyImageUrl) {
            jobDetailData.companyImageUrl = companyImageUrl
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

exports.sendAddCompanyMail = functions
  .https
  .onCall((data, context) => {
    const mailOptions = {
      from: `${data.email}`,
      to: 'go26dev@gmail.com',
    }
    mailOptions.subject = `${data.companyName}の${data.userName}様からのお問い合わせ`
    mailOptions.text = `${data.companyName}の${data.userName}様からお問い合わせを頂きました。\n\n メールアドレス： ${data.email} \n\n お問い合わせ内容：${data.inquiry}`
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

    if (companyId == null) {
      // user
      // name, imageUrl どれも変わっていない場合はreturn
      if (
        firstName == previousValue.firstName &&
        lastName == previousValue.lastName &&
        imageUrl == previousValue.imageUrl
      ) {
        return 0
      }

      var userData = {
        userName: lastName + ' ' + firstName,
      }
      if (imageUrl) {
        userData.profileImageUrl = imageUrl
      }

      // user が profile を編集した時
      // chats のみ
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
      reviewId: context.params.reviewId,
      occupation: occupation,
      content: content,
      createdAt: createdAt,
    }

    // job の rating, companies detail の reviews を更新
    return admin.firestore()
      .collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
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
            reviews: {
              rating: rating,
              comments: comments,
            }
          }

          const batch = admin.firestore().batch()
          const companyRef = admin.firestore().collection('companies').doc(companyId)
          batch.update(companyRef, {
            rating: rating
          })
          const companyDetailRef = admin.firestore().collection('companies').doc(companyId).collection('detail').doc(companyId)
          batch.update(companyDetailRef, reviews)
          batch.commit()
            .then(() => {
              console.log('sendReview company completed.')
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })

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
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  })

// 内定パスを承諾した時の処理
exports.acceptJobOffer = functions.region('asia-northeast1')
  .firestore
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
    const candidateId = newValue.candidateId
    const passId = context.params.passId
    const message = {
      message: userMessage,
      createdAt: newValue.acceptedAt,
      type: 'acceptOffer',
      user: {
        uid: uid,
        name: userName,
        imageUrl: profileImageUrl
      }
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
                console.log('acceptJobOffer complete.')
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          }
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
                  content: userName + 'さんが内定を受諾しました！ 内定契約が済みましたら、ステータスを採用予定に変更してください。',
                  createdAt: new Date(),
                  url: url,
                  isUnread: true,
                })
              })
              batch.commit()
                .then(() => {
                  // 内定が承諾されたら担当者にメール送信
                  members.forEach((member, i) => {
                    const mailOptions = {
                      from: `LightHouse <noreply@firebase.com>`,
                      to: member.email,
                    }
                    mailOptions.subject = `${userName}さんが内定を承諾しました。`
                    mailOptions.text = `${userName}さんが内定を承諾しました。　内定契約が済みましたら、ステータスを採用予定に変更してください。`
                    mailTransport.sendMail(mailOptions, (err, info) => {
                      if (err) {
                        console.log(err)
                      }
                      console.log('New accept pass email sent to:', member.email)
                    })
                  })
                  console.log('acceptJobOffer notification completed.')
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
