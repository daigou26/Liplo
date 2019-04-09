export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'

export const state = () => ({
  user: null,
  status: null,
  reviews: null,
  tags: null,
  pass: null,
  type: null,
  jobId: null,
  chatId: null,
  isEditingTags: false,
  isEditingPass: false,
  isLoading: true,
  messages: [],
  isInitialQuery: true,
  isMessagesLoading: false,
  allMessagesQueried: false,
  unsubscribe: null,
  isNewMessage: false,
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
  setType(state, type) {
    state.type = type
  },
  setJobId(state, jobId) {
    state.jobId = jobId
  },
  setChatId(state, chatId) {
    state.chatId = chatId
  },
  updateIsEditingTags(state, isEditing) {
    state.isEditingTags = isEditing
  },
  updateIsEditingPass(state, isEditing) {
    state.isEditingPass = isEditing
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
  }
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
          pass.expirationDate = new Date( doc.data()['pass'].expirationDate.seconds * 1000 )
          commit('setUser', doc.data()['user'])
          commit('setStatus', doc.data()['status'])
          commit('setReviews', doc.data()['reviews'])
          commit('setTags', doc.data()['tags'])
          commit('setPass', pass)
          commit('setType', doc.data()['type'])
          commit('setJobId', doc.data()['jobId'])
          commit('setChatId', doc.data()['chatId'])
          commit('updateIsLoading', false)

          if (doc.data()['status'].rejected || doc.data()['status'].hired) {
            commit('updateIsLoading', false)
            console.log('404')
            nuxt.error({ statusCode: 404, message: 'not found' })
          }
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
  updatePass({commit, state}, {params, companyId, expirationDate, occupation}) {
    const candidateId = params.id
    var pass = state.pass
    pass.expirationDate = expirationDate
    pass.occupation = occupation

    const batch = firestore.batch()
    const candidateRef = firestore.collection('companies').doc(companyId)
      .collection('candidates').doc(candidateId)
    batch.update(candidateRef, {
      pass: pass,
    })

    const passRef = firestore.collection('passes').doc(pass.passId)
    batch.update(passRef, {
      expirationDate: expirationDate,
      occupation: occupation,
    })

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
  updateStatus({commit, state}, {
    router,
    params,
    companyId,
    newStatus,
    feedback,
    pass
  }) {
    const currentStatus = state.status
    const user = state.user
    const type = state.type
    const jobId = state.jobId
    const candidateId = params.id

    // candidate 更新
    var candidateData = {
      status: newStatus,
      updatedAt: new Date()
    }

    if (newStatus.pass) {
      candidateData.pass = pass
    }
    if (currentStatus.intern && feedback) {
      candidateData.feedback = feedback
    }

    const batch = firestore.batch()
    const candidateRef = firestore.collection('companies').doc(companyId)
      .collection('candidates').doc(candidateId)
    batch.update(candidateRef, candidateData)

    // pass更新
    const passRef = firestore.collection('passes').doc(state.pass.passId)
    if (newStatus.rejected && currentStatus.pass) {
      batch.update(passRef, {
        isContracted: false,
        isValid: false,
      })
    }
    if (newStatus.contracted && currentStatus.pass) {
      batch.update(passRef, {
        isContracted: true,
        isAccepted: true,
        isValid: false,
      })
    }

    var setData = false
    let ref
    if (newStatus.intern) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('interns').doc()
    } else if (newStatus.extendedIntern) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('extendedInterns').doc()
    } else if (newStatus.pass) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('passedUsers').doc()
    } else if (newStatus.contracted) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('contractedUsers').doc()
    } else if (newStatus.hired) {
      setData = true
      ref = firestore.collection('companies').doc(companyId)
        .collection('hiredUsers').doc()
    }

    if (setData) {
      var data = {
        user: user,
        createdAt: new Date()
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
        if (newStatus.pass) {
          commit('setPass', pass)
        }
        if (newStatus.rejected || newStatus.hired) {
          router.replace({path: '/recruiter/candidates'})
        } else {
          commit('setStatus', newStatus)
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
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
            const message = {
              message: doc.data()['message'],
              createdAt: doc.data()['createdAt'],
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
              if (snapshot.docChanges().length != 0) {
                commit('updateIsNewMessage', true)
              }

              snapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                  const message = {
                    message: change.doc.data()['message'],
                    createdAt: change.doc.data()['createdAt'],
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
            const message = {
              message: doc.data()['message'],
              createdAt: doc.data()['createdAt'],
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
  },
  resetUnsubscribe({commit}) {
    commit('updateUnsubscribe', null)
  },
  resetState({commit}) {
    commit('setUser', null)
    commit('setStatus', null)
    commit('setReviews', null)
    commit('setTags', null)
    commit('setType', null)
    commit('setJobId', null)
    commit('updateIsEditingTags', false)
    commit('updateIsLoading', true)
    commit('resetMessages')
    commit('updateIsInitialQuery', true)
    commit('updateIsMessagesLoading', false)
    commit('resetAllMessagesQueried')
    commit('updateUnsubscribe', null)
  }
}
