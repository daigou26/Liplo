export const strict = false
import { firestore, auth, GoogleProvider } from '@/plugins/firebase'


export const state = () => ({
  uid: null,
  isVerified: false,
  sentVerifyEmail: false,
  authError: null,
  loading: false,
  isRefreshed: false,
  isRecruiterSignedIn: false,
})

export const mutations = {
  setUid(state, uid) {
    state.uid = uid
  },
  updateIsVerified(state, isVerified) {
    state.isVerified = isVerified
  },
  updateSentVerifyEmail(state, sentVerifyEmail) {
    state.sentVerifyEmail = sentVerifyEmail
  },
  setAuthError(state, error) {
    state.authError = error
  },
  resetAuthError(state) {
    state.authError = null
  },
  setLoading(state) {
    state.loading = true
  },
  resetLoading(state) {
    state.loading = false
  },
  updateIsRefreshed(state, isRefreshed) {
    state.isRefreshed = isRefreshed
  },
  updateIsRecruiterSignedIn(state, isSignedIn) {
    state.isRecruiterSignedIn = isSignedIn
  }
}

export const actions = {
  async signUp({commit}, {email, password}) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(function() {
        commit('resetLoading')
      })
      .catch(function(error) {
        var errorCode = error.code
        switch (errorCode) {
          case 'auth/email-already-in-use':
            commit('setAuthError', 'この メールアドレスはすでに使用されています')
            break
          case 'auth/invalid-email':
            commit('setAuthError', 'メールアドレスの形式が正しくありません')
            break
          default:
            commit('setAuthError', 'サインアップに失敗しました')
            break
        }
        commit('resetLoading')
      })
  },
  // 招待された担当者のサインアップ
  async recruiterSignedIn({commit}, {recruiterType, companyId, email, password}) {
    if (recruiterType == 'invited') {
      firestore.collection('companies')
        .doc(companyId)
        .collection('invitedMembers')
        .where('email', '==', email)
        .get()
        .then(function(snapshot) {
          // 招待済みかどうか
          if (!snapshot.empty) {
            auth.createUserWithEmailAndPassword(email, password)
              .then(function() {
                commit('resetLoading')
              })
              .catch(function(error) {
                var errorCode = error.code
                switch (errorCode) {
                  case 'auth/email-already-in-use':
                    commit('setAuthError', 'このメールアドレスはすでに使用されています')
                    break
                  case 'auth/invalid-email':
                    commit('setAuthError', 'メールアドレスの形式が正しくありません')
                    break
                  default:
                    commit('setAuthError', 'サインアップに失敗しました')
                    break
                }
                commit('resetLoading')
              })
          } else {
            commit('setAuthError', 'このメールアドレスは招待されていません。')
            commit('resetLoading')
          }
        })
    } else if (recruiterType == 'initial') {
      firestore.collection('companies')
        .doc(companyId)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            const members = doc.data()['members']
            if (members.length == 1) {
              if (members[0].email == email) {
                auth.createUserWithEmailAndPassword(email, password)
                  .then(function() {
                    commit('resetLoading')
                  })
                  .catch(function(error) {
                    var errorCode = error.code
                    switch (errorCode) {
                      case 'auth/email-already-in-use':
                        commit('setAuthError', 'このメールアドレスはすでに使用されています')
                        break
                      case 'auth/invalid-email':
                        commit('setAuthError', 'メールアドレスの形式が正しくありません')
                        break
                      default:
                        commit('setAuthError', 'サインアップに失敗しました')
                        break
                    }
                    commit('resetLoading')
                  })
              } else {
                commit('setAuthError', 'メールアドレスが間違っています')
                commit('resetLoading')
              }
            } else if (members.length >= 2){
              commit('setAuthError', 'すでにこの企業のアカウントが存在しています。この企業のメンバーになるには、すでにアカウントを作成している担当者の方に招待してもらう必要があります。')
              commit('resetLoading')
            }
          } else {
            commit('setAuthError', '企業が存在しません。もう一度メールのリンクからアクセスしてください。')
            commit('resetLoading')
          }
        })
    }
  },
  async signIn({commit}, {email, password}) {
    auth.signInWithEmailAndPassword(email, password)
      .then(function() {
        commit('resetLoading')
      })
      .catch(function(error) {
        var errorCode = error.code;
        switch (errorCode) {
          case 'auth/user-disabled':
            commit('setAuthError', 'このアカウントは無効になっています')
            break
          case 'auth/user-not-found':
            commit('setAuthError', 'ユーザーが見つかりません')
            break
          case 'auth/wrong-password':
            commit('setAuthError', 'パスワードが間違っています')
            break
          case 'auth/invalid-email':
            commit('setAuthError', 'メールアドレスの形式が正しくありません')
            break
          default:
            commit('setAuthError', 'サインアップに失敗しました')
            break
        }
        commit('resetLoading')
      })
  },
  async signOut({dispatch, commit}) {
    auth.signOut()
    dispatch('chats/resetMessagesListener')
    dispatch('chats/resetHasNewMessage')
    dispatch('notifications/resetNotificationsListener')
    dispatch('notifications/resetHasNewNotification')
    dispatch('career/resetState')
    dispatch('chat/resetState')
    dispatch('chats/resetState')
    dispatch('feedback/resetState')
    dispatch('feedbacks/resetState')
    dispatch('resetState')
    dispatch('messages/resetState')
    dispatch('profile/resetState')
    dispatch('review/resetState')
    dispatch('reviews/resetState')
    dispatch('pass/resetState')
    dispatch('passes/resetState')
    dispatch('companyJobs/resetState')
  },
  setUid({commit}, uid) {
    commit('setUid', uid)
  },
  resetAuthError({commit}) {
    commit('resetAuthError')
  },
  setLoading({commit}) {
    commit('setLoading')
  },
  setAuthInfo({dispatch, commit, state}, {
    url,
    route,
    router,
    user,
    type,
    firstName,
    lastName,
    companyId,
    position
  }) {
    if (user) {
      commit('setUid', user.uid)

      firestore.collection('users').doc(user.uid).get()
        .then(function(doc) {
          if (!doc.exists) {
            // サインアップ時
            if (firstName != '' && lastName != '') {
              if (type == 'recruiter') {
                // recruiter
                if (companyId != null) {
                  // 招待された担当者
                  const batch = firestore.batch()

                  const userRef = firestore.collection('users').doc(user.uid)
                  batch.set(userRef, {
                    companyId: companyId,
                    firstName: firstName,
                    lastName: lastName,
                    type: 'recruiter',
                    email: user.email,
                    isEmailVerified: user.emailVerified,
                  })
                  const profileRef = firestore.collection('users')
                    .doc(user.uid).collection('profile').doc(user.uid)
                  var profileData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: user.email
                  }
                  if (position) {
                    profileData.position = position
                  }
                  batch.set(profileRef, profileData)
                  batch.commit()
                    .then(() => {
                      commit('updateIsRecruiterSignedIn', true)
                      dispatch('profile/setCompanyId', companyId)
                      dispatch('profile/setFirstName', firstName)
                      dispatch('profile/setLastName', lastName)
                      dispatch('profile/setEmail', user.email)
                      dispatch('profile/setType', 'recruiter')
                      router.replace('/recruiter/dashboard')
                    })
                    .catch((error) => {
                      console.error("Error adding document: ", error)
                    })
                }
              } else if (type == 'user') {
                // user
                // メールアドレスの確認が済んでいない場合はメール送信
                commit('updateIsVerified',  user.emailVerified)
                if (!user.emailVerified && !state.sentVerifyEmail) {
                  console.log('email not verified');
                  if (route.path !== '/' && route.name !== 'jobs-id') {
                    router.push('/')
                  }
                  commit('updateSentVerifyEmail', true)
                  var actionCodeSettings = {
                    url: url,
                    handleCodeInApp: true,
                  }
                  user.sendEmailVerification(actionCodeSettings)
                    .then(function() {
                      console.log('sent verify email')
                    })
                    .catch(function(error) {
                      console.error("Error adding document: ", error)
                    })
                }

                const batch = firestore.batch()
                const userRef = firestore.collection('users').doc(user.uid)
                batch.set(userRef, {
                  firstName: firstName,
                  lastName: lastName,
                  type: 'user',
                  points: 0,
                  email: user.email,
                  isEmailVerified: user.emailVerified,
                })
                const profileRef = firestore.collection('users')
                  .doc(user.uid).collection('profile').doc(user.uid)
                batch.set(profileRef, {
                  firstName: firstName,
                  lastName: lastName,
                  email: user.email
                })
                const detailRef = firestore.collection('users')
                  .doc(user.uid).collection('detail').doc(user.uid)
                batch.set(detailRef, {
                  firstName: firstName,
                  lastName: lastName,
                  email: user.email
                })
                batch.commit()
                  .then(() => {
                    dispatch('profile/setFirstName', firstName)
                    dispatch('profile/setLastName', lastName)
                    dispatch('profile/setEmail', user.email)
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error)
                  })
              }
            }
          } else {
            dispatch('profile/setFirstName', doc.data()['firstName'])
            dispatch('profile/setLastName', doc.data()['lastName'])
            dispatch('profile/setType', doc.data()['type'])
            dispatch('profile/setCompanyId', doc.data()['companyId'])
            dispatch('profile/setEmail', doc.data()['email'])

            if (doc.data()['imageUrl'] != null) {
              dispatch('profile/setImageUrl', doc.data()['imageUrl'])
            }

            if (user.emailVerified && !doc.data()['isEmailVerified']) {
              firestore.collection('users')
                .doc(user.uid)
                .update({
                  isEmailVerified: true,
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
            }

            if (doc.data()['type'] == 'recruiter') {
              // メッセージのリスナー
              dispatch('chats/setCompanyMessagesListener', doc.data()['companyId'])

              if (route.path.includes('/user') && !route.path.includes('users')) {
                router.replace('/recruiter/dashboard')
              } else if (route.path.includes('/messages') && !route.path.includes('recruiter/messages')) {
                router.replace('/recruiter/dashboard')
              }
            } else {
              // メールアドレスの確認が済んでいない場合はメール送信
              commit('updateIsVerified',  user.emailVerified)
              if (!user.emailVerified && !state.sentVerifyEmail) {
                console.log('email not verified');
                if (route.path !== '/' && route.name !== 'jobs-id') {
                  router.push('/')
                }
                commit('updateSentVerifyEmail', true)
                var actionCodeSettings = {
                  url: url,
                  handleCodeInApp: true,
                }
                user.sendEmailVerification(actionCodeSettings)
                  .then(function() {
                    console.log('sent verify email')
                  })
                  .catch(function(error) {
                    console.error("Error adding document: ", error)
                  })
              }

              // メッセージのリスナー
              dispatch('chats/setUserMessagesListener', user.uid)

              if (route.path.includes('/recruiter') || route.path.includes('/users')) {
                router.replace('/')
              }
            }
          }
          // 通知のリスナー
          dispatch('notifications/setNotificationsListener', user.uid)
        })

    } else {
      commit('setUid', null)
      if (route.path !== '/' && route.path !== '/signup' && route.path !== '/company_registration' && route.name !== 'jobs-id') {
        router.push('/')
      }
    }
  },
  updateIsRefreshed({commit}, isRefreshed) {
    commit('updateIsRefreshed', isRefreshed)
  },
  resetState({commit}) {
    commit('setUid', null)
    commit('updateIsVerified', false)
    commit('updateSentVerifyEmail', false)
    commit('setAuthError', null)
    commit('resetLoading')
    commit('updateIsRefreshed', false)
  },
}
