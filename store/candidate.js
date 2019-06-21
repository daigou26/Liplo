export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'
import { event } from 'vue-analytics'

export const state = () => ({
  user: null,
  status: null,
  reviews: null,
  tags: null,
  pass: null,
  isInternExtended: false,
  extendedInternEnd: false,
  type: null,
  jobId: null,
  chatId: null,
  careerId: null,
  isEditingTags: false,
  isEditingPass: false,
  isEditingExtendedIntern: false,
  isLoading: false,
  messages: [],
  isInitialQuery: true,
  isMessagesLoading: false,
  allMessagesQueried: false,
  unsubscribe: null,
  isNewMessage: false,
  error: '',
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setStatus(state, status) {
    state.status = status
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setTags(state, tags) {
    state.tags = tags
  },
  setPass(state, pass) {
    state.pass = pass
  },
  updateIsInternExtended(state, isInternExtended) {
    state.isInternExtended = isInternExtended
  },
  updateExtendedInternEnd(state, extendedInternEnd) {
    state.extendedInternEnd = extendedInternEnd
  },
  setType(state, type) {
    state.type = type
  },
  setJobId(state, jobId) {
    state.jobId = jobId
  },
  setChatId(state, chatId) {
    state.chatId = chatId
  },
  setCareerId(state, careerId) {
    state.careerId = careerId
  },
  updateIsEditingTags(state, isEditing) {
    state.isEditingTags = isEditing
  },
  updateIsEditingPass(state, isEditing) {
    state.isEditingPass = isEditing
  },
  updateIsEditingExtendedIntern(state, isEditing) {
    state.isEditingExtendedIntern = isEditing
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  // messages
  pushMessage(state, message) {
    state.messages.push(message)
  },
  unshiftMessage(state, message) {
    state.messages.unshift(message)
  },
  resetMessages(state) {
    state.messages = []
  },
  updateIsInitialQuery(state, isInitialQuery) {
    state.isInitialQuery = isInitialQuery
  },
  updateIsMessagesLoading(state, isLoading) {
    state.isMessagesLoading = isLoading
  },
  setAllMessagesQueried(state) {
    state.allMessagesQueried = true
  },
  resetAllMessagesQueried(state) {
    state.allMessagesQueried = false
  },
  updateUnsubscribe(state, unsubscribe) {
    state.unsubscribe = unsubscribe
  },
  updateIsNewMessage(state, isNew) {
    state.isNewMessage = isNew
  },
  setError(state, error) {
    state.error = error
  },
}

export const actions = {
  queryCandidate({commit}, {nuxt, params, companyId}) {
    const candidateId = params.id
    firestore.collection('companies')
      .doc(companyId)
      .collection('candidates')
      .doc(candidateId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          var pass = doc.data()['pass']
          if (pass) {
            pass.expirationDate = new Date( doc.data()['pass'].expirationDate.seconds * 1000 )
          }

          commit('setUser', doc.data()['user'])
          commit('setStatus', doc.data()['status'])
          commit('setReviews', doc.data()['reviews'])
          commit('setTags', doc.data()['tags'])
          commit('setPass', pass)
          commit('updateIsInternExtended', doc.data()['isInternExtended'])
          commit('updateExtendedInternEnd', doc.data()['extendedInternEnd'])
          commit('setType', doc.data()['type'])
          commit('setJobId', doc.data()['jobId'])
          commit('setChatId', doc.data()['chatId'])
          if (doc.data()['career']) {
            commit('setCareerId', doc.data()['career'].careerId)
          }

          commit('updateIsLoading', false)
        } else {
          commit('updateIsLoading', false)
          console.log('404')
          nuxt.error({ statusCode: 404, message: 'not found' })
        }
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
        nuxt.error({ statusCode: 404, message: 'not found' })
      })
  },
  updateIsEditingTags({commit}, isEditing) {
    commit('updateIsEditingTags', isEditing)
  },
  updateTags({commit}, {params, companyId, tags}) {
    const candidateId = params.id
    firestore.collection('companies').doc(companyId)
      .collection('candidates').doc(candidateId)
      .update({
        tags: tags,
      })
      .then(() => {
        commit('setTags', tags)
        commit('updateIsEditingTags', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingPass({commit}, isEditing) {
    commit('updateIsEditingPass', isEditing)
  },
  updatePass({commit, state}, {params, companyId, joiningYear, expirationDate, occupation}) {
    const candidateId = params.id
    var pass = state.pass

    pass.expirationDate = expirationDate
    pass.occupation = occupation

    if (joiningYear) {
      pass.joiningYear = joiningYear
    }

    const batch = firestore.batch()
    const candidateRef = firestore.collection('companies').doc(companyId)
      .collection('candidates').doc(candidateId)
    batch.update(candidateRef, {
      pass: pass,
    })

    const passRef = firestore.collection('passes').doc(pass.passId)
    var passData = {
      expirationDate: expirationDate,
      occupation: occupation,
    }

    if (joiningYear) {
      passData.joiningYear = joiningYear
    }

    batch.update(passRef, passData)

    batch.commit()
      .then(() => {
        commit('setPass', null)
        commit('setPass', pass)
        commit('updateIsEditingPass', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingExtendedIntern({commit}, isEditing) {
    commit('updateIsEditingExtendedIntern', isEditing)
  },
  updateExtendedIntern({commit, state}, {params, companyId, extendIntern}) {
    const candidateId = params.id
    const user = state.user
    const careerId = state.careerId

    const batch = firestore.batch()

    const candidateRef = firestore.collection('companies').doc(companyId)
      .collection('candidates').doc(candidateId)

    var candidateData

    if (extendIntern) {
      // インターンを延長する場合
      candidateData = {
        isInternExtended: true,
      }
    } else {
      // 延長したインターンを終了する場合
      candidateData = {
        extendedInternEnd: true,
      }
    }
    batch.update(candidateRef, candidateData)

    const careerRef = firestore.collection('users').doc(user.uid)
      .collection('career').doc(careerId)

    var careerData
    if (extendIntern) {
      careerData = {
        isInternExtended: true,
      }
    } else {
      careerData = {
        endedAt: new Date(),
        extendedInternEnd: true,
      }
    }
    batch.update(careerRef, careerData)

    batch.commit()
      .then(() => {
        commit('updateIsEditingExtendedIntern', false)
        if (extendIntern) {
          commit('updateIsInternExtended', true)
        } else {
          commit('updateExtendedInternEnd', true)
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateStatus({commit, state}, {
    router,
    params,
    companyId,
    newStatus,
    occupation,
    feedback,
    pass,
    plan
  }) {
    const currentStatus = state.status
    const user = state.user
    const type = state.type
    const jobId = state.jobId
    let careerId = state.careerId
    const candidateId = params.id
    const isInternExtended = state.isInternExtended
    const extendedInternEnd = state.extendedInternEnd
    const currentDate = new Date()

    if (newStatus.contracted) {
      // パスが使用されている場合に限り、ステータスを更新できる
      firestore.collection('passes')
        .doc(state.pass.passId)
        .get()
        .then(doc => {
          if (doc.exists) {
            if (doc.data().isAccepted) {
              // パスが使用されている
              commit('setError', null)
              // candidate 更新
              var candidateData = {
                status: newStatus,
                updatedAt: currentDate
              }

              const batch = firestore.batch()
              // candidate 更新
              const candidateRef = firestore.collection('companies').doc(companyId)
                .collection('candidates').doc(candidateId)
              batch.update(candidateRef, candidateData)

              // pass 更新
              const passRef = firestore.collection('passes').doc(state.pass.passId)
              batch.update(passRef, {
                isContracted: true,
                isAccepted: true,
                isValid: false,
                contractedDate: currentDate
              })

              // 候補者のデータを保存
              let ref = firestore.collection('companies').doc(companyId)
                .collection('contractedUsers').doc()

              var data = {
                user: user,
                createdAt: currentDate
              }
              if (type != null) {
                data.type = type
              }
              if (jobId != null) {
                data.jobId = jobId
              }
              batch.set(ref, data)

              batch.commit()
                .then(() => {
                  commit('setStatus', newStatus)
                })
                .catch((error) => {
                  console.error("Error", error)
                })
            } else {
              // パスが使用されいないため終了
              commit('setError', 'パスが使用されていないので更新できません。候補者がパスを使用すると更新することが出来るようになります。')
            }
          } else {
            commit('setError', 'エラーが発生しました')
          }
        })
        .catch(error => {
          console.log(error)
          commit('setError', 'エラーが発生しました')
        })
    } else {
      const batch = firestore.batch()

      var candidateData = {
        status: newStatus,
        updatedAt: currentDate
      }

      if (newStatus.intern) {
        careerId = firestore.collection('users').doc(user.uid)
          .collection('career').doc().id
        candidateData.career = {
          careerId: careerId,
          internOccupation: occupation,
        }
        candidateData.internOccupation = occupation
        // paidActions に書き込む時にインターン採用時のプランを確認するために使う
        candidateData.plan = plan
      }
      if (newStatus.pass) {
        pass.passId = firestore.collection('passes').doc().id
        candidateData.pass = pass
      }
      if (currentStatus.intern && feedback) {
        candidateData.feedback = feedback
      }
      // ステータスが入社または不採用に変わるときに、延長しているインターンが終了になっていない場合は、終了にする
      if ((newStatus.hired || newStatus.rejected) && isInternExtended && !extendedInternEnd) {
        candidateData.extendedInternEnd = true
      }

      // candidate 更新
      const candidateRef = firestore.collection('companies').doc(companyId)
        .collection('candidates').doc(candidateId)
      batch.update(candidateRef, candidateData)

      // pass更新
      if (newStatus.rejected && currentStatus.pass) {
        const passRef = firestore.collection('passes').doc(state.pass.passId)
        batch.update(passRef, {
          isContracted: false,
          isValid: false,
        })
      }

      // career更新 （ステータスが入社または不採用に変わるときに、延長しているインターンが終了になっていない場合は、終了にする）
      if ((newStatus.hired || newStatus.rejected) && isInternExtended && !extendedInternEnd) {
        const careerRef = firestore.collection('users').doc(user.uid)
          .collection('career').doc(careerId)

        var careerData = {
          endedAt: currentDate,
          extendedInternEnd: true,
        }
        batch.update(careerRef, careerData)
      }

      // 候補者のデータを保存
      var setData = false
      let ref
      if (newStatus.intern) {
        setData = true
        ref = firestore.collection('companies').doc(companyId)
          .collection('interns').doc()
      } else if (newStatus.pass) {
        setData = true
        ref = firestore.collection('companies').doc(companyId)
          .collection('passedUsers').doc()
      } else if (newStatus.hired) {
        setData = true
        ref = firestore.collection('companies').doc(companyId)
          .collection('hiredUsers').doc()
      }

      if (setData) {
        var data = {
          user: user,
          createdAt: currentDate
        }
        if (type != null) {
          data.type = type
        }
        if (jobId != null) {
          data.jobId = jobId
        }
        batch.set(ref, data)
      }

      batch.commit()
        .then(() => {
          commit('setError', null)
          if (newStatus.intern) {
            commit('setCareerId', careerId)
            // analytics
            event({
              eventCategory: 'user',
              eventAction: 'hire',
              eventLabel: 'intern'
            })
          } else if (newStatus.hired) {
            // analytics
            event({
              eventCategory: 'user',
              eventAction: 'hire',
              eventLabel: 'employ'
            })
          }
          if (newStatus.pass) {
            commit('setPass', pass)
            // analytics
            event({
              eventCategory: 'user',
              eventAction: 'pass',
              eventLabel: pass.type
            })
          }
          if (newStatus.rejected || newStatus.hired) {
            router.replace({path: '/recruiter/candidates'})
          } else {
            commit('setStatus', newStatus)
          }
        })
        .catch((error) => {
          commit('setError', 'エラーが発生しました')
          console.error("Error", error)
        })
    }
  },
  sendReview({commit, state}, {params, companyId, type, pic, rating, content}) {
    const candidateId = params.id
    var reviews = state.reviews

    const comment = {
      pic: pic,
      content: content,
      rating: rating,
      createdAt: new Date()
    }

    if (reviews) {
      // 新規レビュー or 編集
      if (type == 'new') {
        console.log('new');
        reviews.count += 1
        reviews.comments.push(comment)
      } else if (type == 'edit') {
        reviews.comments.forEach((item, index) => {
          if (item.pic.uid == pic.uid) {
            reviews.comments.splice(index, 1)
            reviews.comments.splice(index, 0, comment)
          }
        })
      }

      var ratingSum = 0
      for (const item of reviews.comments) {
        ratingSum += item.rating
      }
      reviews.rating = Math.round(ratingSum / reviews.count * 10) / 10
    } else {
      reviews = {
        count: 1,
        rating: rating,
        comments: [comment]
      }
    }

    firestore.collection('companies')
      .doc(companyId)
      .collection('candidates')
      .doc(candidateId)
      .update({
        reviews: reviews
      })
      .then(() => {
        commit('setReviews', reviews)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsMessagesLoading({commit}, isLoading) {
    commit('updateIsMessagesLoading', isLoading)
  },
  updateIsNewMessage({commit}, isNew) {
    commit('updateIsNewMessage', isNew)
  },
  queryMessages({commit, state}, infiniteState) {
    const messages = state.messages
    const chatId = state.chatId
    if (chatId) {
      // すでにクエリしているか
      if (messages.length == 0) {
        return firestore.collection('chats').doc(chatId)
          .collection('messages')
          .orderBy("createdAt", "desc")
          .limit(10)
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
                let hours = date.getHours()
                let minutes = date.getMinutes()
                timestamp = `${year}/${month}/${day} ${hours}:${minutes}`
              }
              const message = {
                message: doc.data()['message'],
                createdAt: doc.data()['createdAt'],
                timestamp: timestamp,
                pic: doc.data()['pic'],
                user: doc.data()['user'],
              }
              commit('unshiftMessage', message)
            })
            if (docCount == 0) {
              commit('setAllMessagesQueried')
            }
            commit('updateIsMessagesLoading', false)

            // listenerがあればremove
            if (state.unsubscribe) {
              state.unsubscribe()
              commit('updateUnsubscribe', null)
            }
            // listener set
            var lastDate
            if (state.messages.length == 0) {
              lastDate = new Date()
            } else {
              const lastIndex = state.messages.length - 1
              lastDate = state.messages[lastIndex].createdAt
            }
            const listener = firestore.collection("chats").doc(chatId)
              .collection('messages')
              .orderBy('createdAt', 'asc')
              .startAfter(lastDate)
              .onSnapshot(function(snapshot) {
                // unreadCount更新
                firestore.collection('chats')
                  .doc(chatId)
                  .update({
                    picUnreadCount: 0
                  })
                  .catch(err => {
                    console.log('Error getting document', err)
                  })

                if (!snapshot.empty) {
                  commit('updateIsNewMessage', true)
                }

                snapshot.docChanges().forEach(function(change) {
                  if (change.type === "added") {
                    var timestamp = change.doc.data()['createdAt']
                    if (timestamp) {
                      let date = new Date( timestamp.seconds * 1000 )
                      let year  = date.getFullYear()
                      let month = date.getMonth() + 1
                      let day  = date.getDate()
                      let hours = date.getHours()
                      let minutes = date.getMinutes()
                      timestamp = `${year}/${month}/${day} ${hours}:${minutes}`
                    }

                    const message = {
                      message: change.doc.data()['message'],
                      createdAt: change.doc.data()['createdAt'],
                      timestamp: timestamp,
                      pic: change.doc.data()['pic'],
                      user: change.doc.data()['user'],
                    }
                    commit('pushMessage', message)
                  }
                })
              })
              commit('updateUnsubscribe', listener)
          })
          .catch(function(error) {
            commit('updateIsMessagesLoading', false)
            console.log("Error getting document:", error)
          })
      } else {
        const lastDate = messages[0].createdAt
        return firestore.collection('chats').doc(chatId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .startAfter(lastDate)
          .limit(10)
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
                let hours = date.getHours()
                let minutes = date.getMinutes()
                timestamp = `${year}/${month}/${day} ${hours}:${minutes}`
              }
              const message = {
                message: doc.data()['message'],
                createdAt: doc.data()['createdAt'],
                timestamp: timestamp,
                pic: doc.data()['pic'],
                user: doc.data()['user'],
              }
              commit('unshiftMessage', message)
            })
            // infinite loading
            infiniteState.loaded()

            if (docCount == 0) {
              commit('setAllMessagesQueried')
            }
            commit('updateIsMessagesLoading', false)
          })
          .catch(function(error) {
            commit('updateIsLoading', false)
            console.log("Error getting document:", error)
          })
      }
    }
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetUnsubscribe({commit}) {
    commit('updateUnsubscribe', null)
  },
  resetError({commit}) {
    commit('setError', '')
  },
  resetState({commit}) {
    commit('setUser', null)
    commit('setStatus', null)
    commit('setReviews', null)
    commit('setTags', null)
    commit('setPass', null)
    commit('updateIsInternExtended', false)
    commit('updateExtendedInternEnd', false)
    commit('setType', null)
    commit('setJobId', null)
    commit('setChatId', null)
    commit('setCareerId', null)
    commit('updateIsEditingTags', false)
    commit('updateIsEditingPass', false)
    commit('updateIsEditingExtendedIntern', false)
    commit('updateIsLoading', true)
    commit('resetMessages')
    commit('updateIsInitialQuery', true)
    commit('updateIsMessagesLoading', false)
    commit('resetAllMessagesQueried')
    commit('setError', '')
  }
}
