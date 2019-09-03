export const strict = false
import firebase from 'firebase/app'
import { firestore, functions, auth } from '@/plugins/firebase'
import { event } from 'vue-analytics'
const baseUrl = process.env.BASE_URL || 'https://liplo.jp'

export const state = () => ({
  uid: '',
  isVerified: true,
  sentVerifyEmail: false,
  authError: null,
  loading: false,
  isRefreshed: false,
  isRefreshing: true,
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
  updateIsRefreshing(state, isRefreshing) {
    state.isRefreshing = isRefreshing
  },
  updateIsRecruiterSignedIn(state, isSignedIn) {
    state.isRecruiterSignedIn = isSignedIn
  }
}

export const actions = {
  async signUp({commit}, {email, password, grade, university, type}) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(function() {
        commit('resetLoading')
        commit('setAuthError', '')
        // analytics
        event({
          eventCategory: 'user',
          eventAction: 'signUp',
          eventLabel: grade
        })
        event({
          eventCategory: 'university',
          eventAction: 'signUp',
          eventLabel: university
        })
        event({
          eventCategory: 'type',
          eventAction: 'signUp',
          eventLabel: type
        })
        event({
          eventCategory: 'grade & type',
          eventAction: 'signUp',
          eventLabel: grade + type
        })
      })
      .catch(function(error) {
        console.error("Error", error)
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
  async recruiterSignUp({commit}, {recruiterType, companyId, email, password}) {
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
                commit('setAuthError', '')
              })
              .catch(function(error) {
                console.error("Error", error)
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
        .collection('detail')
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
                    commit('setAuthError', '')
                  })
                  .catch(function(error) {
                    console.error("Error", error)
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
        commit('setAuthError', '')
      })
      .catch(function(error) {
        console.error("Error", error)
        var errorCode = error.code
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
            commit('setAuthError', 'ログインに失敗しました')
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
    dispatch('notifications/resetLatestNotificationsState')
    dispatch('notifications/resetState')
    dispatch('pass/resetState')
    dispatch('passes/resetState')
    dispatch('career/resetState')
    dispatch('career/resetNotReviewedCompanyState')
    dispatch('career/resetCareerDetailState')
    dispatch('chat/resetState')
    dispatch('chats/resetState')
    dispatch('feedback/resetState')
    dispatch('feedbacks/resetState')
    dispatch('resetState')
    dispatch('messages/resetState')
    dispatch('profile/resetState')
    dispatch('profile/resetProfileState')
    dispatch('profile/resetCompaniesListener')
    dispatch('review/resetState')
    dispatch('reviews/resetJobReviewsState')
    dispatch('reviews/resetCompanyReviewsState')
    dispatch('reviews/resetUserReviewsState')
    dispatch('pass/resetState')
    dispatch('passes/resetState')
    dispatch('candidate/resetState')
    dispatch('candidates/resetState')
    dispatch('companyInfo/resetState')
    dispatch('companyJob/resetState')
    dispatch('companyJobs/resetState')
    dispatch('companyPasses/resetPassesState')
    dispatch('companyPasses/resetYearPassesState')
    dispatch('companyProfile/resetState')
    dispatch('settings/resetState')
    dispatch('users/resetState')
    dispatch('users/resetFilterState')
    dispatch('user/resetState')
  },
  async changeEmail({dispatch, commit}, {type, newEmail, password}) {
    var user = auth.currentUser
    var credential = firebase.auth.EmailAuthProvider.credential(user.email, password)

    // 再認証
    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
      const batch = firestore.batch()
      const userRef = firestore.collection('users').doc(user.uid)
      batch.update(userRef, {
        email: newEmail,
      })
      const profileRef = firestore.collection('users').doc(user.uid)
        .collection('profile').doc(user.uid)
      batch.update(profileRef, {
        email: newEmail,
      })
      if (type == 'user') {
        const userDetailRef = firestore.collection('users').doc(user.uid)
          .collection('detail').doc(user.uid)
        batch.update(userDetailRef, {
          email: newEmail,
        })
      }

      batch.commit()
        .then(() => {
          // メアド変更
          user.updateEmail(newEmail).then(function() {
            dispatch('profile/setEmail', newEmail)
            commit('setAuthError', '')
            commit('resetLoading')
          }).catch(function(error) {
            console.error("Error adding document: ", error)
            commit('setAuthError', 'メールアドレスを変更できませんでした')
            commit('resetLoading')
          })
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    }).catch(function(error) {
      var errorCode = error.code
      switch (errorCode) {
        case 'auth/user-mismatch':
          commit('setAuthError', '別のアカウントのメールアドレスとパスワードを入力しています')
          break
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
          commit('setAuthError', 'ログインに失敗しました')
          break
      }
      commit('resetLoading')
    })
  },
  async deleteAccount({dispatch, commit}, {type, password}) {
    var user = auth.currentUser
    var credential = firebase.auth.EmailAuthProvider.credential(user.email, password)

    // 再認証
    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
      const batch = firestore.batch()
      const userRef = firestore.collection('users').doc(user.uid)
      batch.update(userRef, {
        isDeleted: true
      })
      if (type == 'user') {
        const userDetailRef = firestore.collection('users').doc(user.uid)
          .collection('detail').doc(user.uid)
        batch.update(userDetailRef, {
          isDeleted: true
        })
      }
      batch.commit()
        .then(() => {
          // delete
          user.delete().then(function() {
            commit('setAuthError', '')
            commit('resetLoading')
            dispatch('chats/resetMessagesListener')
            dispatch('chats/resetHasNewMessage')
            dispatch('notifications/resetNotificationsListener')
            dispatch('notifications/resetHasNewNotification')
            dispatch('notifications/resetLatestNotificationsState')
            dispatch('notifications/resetState')
            dispatch('pass/resetState')
            dispatch('passes/resetState')
            dispatch('career/resetState')
            dispatch('career/resetNotReviewedCompanyState')
            dispatch('career/resetCareerDetailState')
            dispatch('chat/resetState')
            dispatch('chats/resetState')
            dispatch('feedback/resetState')
            dispatch('feedbacks/resetState')
            dispatch('resetState')
            dispatch('messages/resetState')
            dispatch('profile/resetState')
            dispatch('profile/resetProfileState')
            dispatch('profile/resetCompaniesListener')
            dispatch('review/resetState')
            dispatch('reviews/resetJobReviewsState')
            dispatch('reviews/resetCompanyReviewsState')
            dispatch('reviews/resetUserReviewsState')
            dispatch('pass/resetState')
            dispatch('passes/resetState')
            dispatch('candidate/resetState')
            dispatch('candidates/resetState')
            dispatch('companyInfo/resetState')
            dispatch('companyJob/resetState')
            dispatch('companyJobs/resetState')
            dispatch('companyPasses/resetPassesState')
            dispatch('companyPasses/resetYearPassesState')
            dispatch('companyProfile/resetState')
            dispatch('settings/resetState')
            dispatch('users/resetState')
            dispatch('users/resetFilterState')
            dispatch('jobs/resetToolbarExtension')
          }).catch(function(error) {
            console.error("Error adding document: ", error)
            commit('setAuthError', 'アカウントが削除できませんでした')
            commit('resetLoading')
          })
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
          commit('setAuthError', 'アカウントが削除できませんでした')
          commit('resetLoading')
        })
    }).catch(function(error) {
      var errorCode = error.code
      switch (errorCode) {
        case 'auth/user-mismatch':
          commit('setAuthError', '別のアカウントのメールアドレスとパスワードを入力しています')
          break
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
          commit('setAuthError', 'ログインに失敗しました')
          break
      }
      commit('resetLoading')
    })
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
    birthDate,
    university,
    grade,
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
                  const batch = firestore.batch()

                  const userRef = firestore.collection('users').doc(user.uid)
                  batch.set(userRef, {
                    companyId: companyId,
                    firstName: firstName,
                    lastName: lastName,
                    type: 'recruiter',
                    email: user.email,
                    isEmailVerified: user.emailVerified,
                    notificationsSetting: {application: true, acceptPass: true},
                    isDeleted: false,
                  })
                  const profileRef = firestore.collection('users')
                    .doc(user.uid).collection('profile').doc(user.uid)
                  var profileData = {
                    companyId: companyId,
                    firstName: firstName,
                    lastName: lastName,
                    type: 'recruiter',
                    email: user.email
                  }
                  if (position) {
                    profileData.position = position
                  }
                  batch.set(profileRef, profileData)
                  batch.commit()
                    .then(() => {
                      // 契約しているか(recruiter)
                      firestore.collection('companies')
                        .doc(companyId)
                        .collection('info')
                        .doc(companyId)
                        .get()
                        .then(companyDoc => {
                          if (companyDoc.exists) {
                            dispatch('profile/setPlan', companyDoc.data()['plan'])
                          }
                        })

                      commit('updateIsRefreshing', false)
                      commit('updateIsRecruiterSignedIn', true)
                      dispatch('profile/setCompanyId', companyId)
                      dispatch('profile/setFirstName', firstName)
                      dispatch('profile/setLastName', lastName)
                      dispatch('profile/setEmail', user.email)
                      dispatch('profile/setType', 'recruiter')
                      router.replace('/recruiter/dashboard')
                    })
                    .catch((error) => {
                      commit('updateIsRefreshing', false)
                      console.error("Error adding document: ", error)
                    })
                }
              } else if (type == 'user') {
                // user
                // メールアドレスの確認が済んでいない場合はメール送信
                commit('updateIsVerified',  user.emailVerified)
                if (!user.emailVerified && !state.sentVerifyEmail) {
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
                // 管理者かどうか
                firestore.collection('adminUsers')
                  .doc(user.uid)
                  .get()
                  .then(doc => {
                    if (doc.exists) {
                      dispatch('profile/updateIsAdmin', true)
                    } else {
                      dispatch('profile/updateIsAdmin', false)
                    }
                  })

                // 学年
                switch (grade) {
                  case '大学１年':
                    grade = 'B1'
                    break
                  case '大学２年':
                    grade = 'B2'
                    break
                  case '大学３年':
                    grade = 'B3'
                    break
                  case '大学４年':
                    grade = 'B4'
                    break
                  case '修士１年':
                    grade = 'M1'
                    break
                  case '修士２年':
                    grade = 'M2'
                    break
                  case 'その他':
                    grade = 'others'
                    break
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
                  notificationsSetting: {scout: true, pass: true},
                  acceptScout: true,
                  isDeleted: false,
                  completionPercentage: 0,
                  canSearch: false,
                  university: university,
                  grade: grade,
                })
                // 生年月日
                if (typeof birthDate == 'string') {
                  let arr = birthDate.split('-')
                  birthDate = new Date(arr[0], arr[1] - 1, arr[2])
                }
                const profileRef = firestore.collection('users')
                  .doc(user.uid).collection('profile').doc(user.uid)
                batch.set(profileRef, {
                  firstName: firstName,
                  lastName: lastName,
                  type: 'user',
                  points: 0,
                  email: user.email,
                  birthDate: birthDate,
                  university: university,
                  grade: grade,
                })
                const detailRef = firestore.collection('users')
                  .doc(user.uid).collection('detail').doc(user.uid)
                batch.set(detailRef, {
                  firstName: firstName,
                  lastName: lastName,
                  email: user.email,
                  isDeleted: false,
                  acceptScout: true,
                  birthDate: birthDate,
                  university: university,
                  grade: grade,
                })
                batch.commit()
                  .then(() => {
                    commit('updateIsRefreshing', false)
                    dispatch('profile/setFirstName', firstName)
                    dispatch('profile/setLastName', lastName)
                    dispatch('profile/setType', 'user')
                    dispatch('profile/setEmail', user.email)
                    dispatch('settings/setNotificationsSetting', {scout: true, pass: true})
                    dispatch('settings/setAcceptScout', true)
                  })
                  .catch((error) => {
                    commit('updateIsRefreshing', false)
                    console.error("Error adding document: ", error)
                  })
              }
            }
          } else {
            // 管理者かどうか
            if (doc.data()['type'] == 'admin') {
              firestore.collection('adminUsers')
                .doc(user.uid)
                .get()
                .then(userDoc => {
                  if (userDoc.exists) {
                    commit('updateIsRefreshing', false)
                    dispatch('profile/updateIsAdmin', true)
                  } else {
                    dispatch('profile/updateIsAdmin', false)
                  }
                })
            } else {
              // 契約しているか(recruiter)
              if (doc.data()['type'] == 'recruiter' && doc.data()['companyId']) {
                dispatch('profile/setCompaniesListener', doc.data()['companyId'])
              }

              dispatch('profile/setFirstName', doc.data()['firstName'])
              dispatch('profile/setLastName', doc.data()['lastName'])
              dispatch('profile/setType', doc.data()['type'])
              dispatch('profile/setCompanyId', doc.data()['companyId'])
              dispatch('settings/setNotificationsSetting', doc.data()['notificationsSetting'])
              dispatch('settings/setAcceptScout', doc.data()['acceptScout'])

              // email を変更した後、リセットした場合、user.email と db がずれるため、更新
              if (user.email != doc.data()['email']) {
                const batch = firestore.batch()
                const userRef = firestore.collection('users').doc(user.uid)
                batch.update(userRef, {
                  email: user.email,
                })
                const profileRef = firestore.collection('users').doc(user.uid)
                  .collection('profile').doc(user.uid)
                batch.update(profileRef, {
                  email: user.email,
                })
                if (doc.data()['type'] == 'user') {
                  const userDetailRef = firestore.collection('users').doc(user.uid)
                    .collection('detail').doc(user.uid)
                  batch.update(userDetailRef, {
                    email: user.email,
                  })
                }
                batch.commit()
                  .then(() => {
                    dispatch('profile/setEmail', user.email)
                  })
                  .catch((error) => {
                    console.error("Error", error)
                  })
              } else {
                dispatch('profile/setEmail', doc.data()['email'])
              }

              if (doc.data()['imageUrl'] != null) {
                dispatch('profile/setImageUrl', doc.data()['imageUrl'])
              }

              commit('updateIsRefreshing', false)
              if (doc.data()['type'] == 'recruiter') {
                // メッセージのリスナー
                dispatch('chats/setCompanyMessagesListener', doc.data()['companyId'])

                if (route.path.includes('/user') && !route.path.includes('users') && !route.path.includes('settings')) {
                  router.replace('/recruiter/dashboard')
                } else if (route.path.includes('/messages') && !route.path.includes('recruiter/messages')) {
                  router.replace('/recruiter/dashboard')
                }
              } else {
                dispatch('profile/setPoints', doc.data()['points'])

                // emailVerified が false
                if (!user.emailVerified) {
                  commit('updateIsVerified',  false)
                }
                // emailVerifiedを true に
                if (user.emailVerified && !doc.data()['isEmailVerified']) {
                  commit('updateIsVerified',  true)
                  firestore.collection('users')
                    .doc(user.uid)
                    .update({
                      isEmailVerified: true,
                    })
                    .catch((error) => {
                      console.error("Error updating document: ", error)
                    })
                }
                // メールアドレスの確認が済んでいない場合はメール送信
                if (!doc.data()['isEmailVerified'] && !user.emailVerified && !state.sentVerifyEmail) {
                  if (route.path !== '/' && route.name !== 'jobs-id' && route.name !== 'user-settings-account') {
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
          }
          // 通知のリスナー
          dispatch('notifications/setNotificationsListener', user.uid)
        })

    } else {
      commit('updateIsRefreshing', false)
      commit('setUid', null)

      if (route.path !== '/' &&
        route.name !== 'inquiry_for_recruiter' &&
        route.name !== 'contact' &&
        route.name !== 'feedback' &&
        route.name !== 'how_to_use' &&
        route.name !== 'terms' &&
        route.name !== 'privacy_policy' &&
        route.name !== 'jobs-id' &&
        route.name !== 'companies-id' &&
        route.name !== 'companies-id-jobs' &&
        route.name != null
      ) {
        router.replace('/')
      }
    }
  },
  sendSignUpEmail({commit}, {companyId, name, email}) {
    var sendSignUpEmail = functions.httpsCallable("sendSignUpEmail")
    sendSignUpEmail({
      url: baseUrl + '/?type=initial&id=' + companyId,
      name: name,
      email: email
    })
  },
  updateIsRefreshed({commit}, isRefreshed) {
    commit('updateIsRefreshed', isRefreshed)
  },
  updateIsRefreshing({commit}, isRefreshing) {
    commit('updateIsRefreshing', isRefreshing)
  },
  resetState({commit}) {
    commit('setUid', '')
    commit('updateIsVerified', true)
    commit('updateSentVerifyEmail', false)
    commit('setAuthError', null)
    commit('resetLoading')
    commit('updateIsRefreshed', false)
    commit('updateIsRefreshing', true)
  },
}
