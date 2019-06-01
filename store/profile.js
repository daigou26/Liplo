export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'


export const state = () => ({
  lastSignInDate: null,
  isAdmin: false,
  plan: null,
  type: null,
  points: 0,
  completionPercentage: 0,
  position: null,
  isEditingPosition: false,
  companyId: null,
  imageUrl: '',
  imageFileSizeValid: true,
  isEditingProfileImage: false,
  firstName: '',
  lastName: '',
  isEditingUserName: false,
  desiredOccupations: null,
  isEditingDesiredOccupations: false,
  selfIntro: '',
  isEditingSelfIntro: false,
  whatWantToDo: '',
  isEditingWhatWantToDo: false,
  portfolio: null,
  isPortfolioImageChanged: false,
  selectedPortfolioItemIndex: null,
  isEditingPortfolio: false,
  skills: null,
  isEditingSkills: false,
  links: null,
  selectedLinkIndex: null,
  isEditingLinks: false,
  email: '',
  university: '',
  faculty: '',
  department: '',
  graduationDate: '',
  birthDate: '',
  isEditingUserInfo: false,
  acceptedOffers: [],
  isLoading: false,
  unsubscribe: null,
})

export const mutations = {
  setLastSignInDate(state, date) {
    state.lastSignInDate = date
  },
  updateIsAdmin(state, isAdmin) {
    state.isAdmin = isAdmin
  },
  setPlan(state, plan) {
    state.plan = plan
  },
  setType(state, type) {
    state.type = type
  },
  setPoints(state, points) {
    state.points = points
  },
  setCompletionPercentage(state, completionPercentage) {
    state.completionPercentage = completionPercentage
  },
  setPosition(state, position) {
    state.position = position
  },
  updateIsEditingPosition(state, isEditing) {
    state.isEditingPosition = isEditing
  },
  setCompanyId(state, companyId) {
    state.companyId = companyId
  },
  setImageUrl(state, imageUrl) {
    state.imageUrl = imageUrl
  },
  updateImageFileSizeValid(state, valid) {
    state.imageFileSizeValid = valid
  },
  updateIsEditingProfileImage(state, isEditing) {
    state.isEditingProfileImage = isEditing
  },
  setFirstName(state, firstName) {
    state.firstName = firstName
  },
  setLastName(state, lastName) {
    state.lastName = lastName
  },
  updateIsEditingUserName(state, isEditing) {
    state.isEditingUserName = isEditing
  },
  setDesiredOccupations(state, occupations) {
    state.desiredOccupations = occupations
  },
  updateIsEditingDesiredOccupations(state, isEditing) {
    state.isEditingDesiredOccupations = isEditing
  },
  setSelfIntro(state, selfIntro) {
    state.selfIntro = selfIntro
  },
  updateIsEditingSelfIntro(state, isEditing) {
    state.isEditingSelfIntro = isEditing
  },
  setWhatWantToDo(state, whatWantToDo) {
    state.whatWantToDo = whatWantToDo
  },
  updateIsEditingWhatWantToDo(state, isEditing) {
    state.isEditingWhatWantToDo = isEditing
  },
  setPortfolio(state, portfolio) {
    state.portfolio = portfolio
  },
  updateIsPortfolioImageChanged(state, isChanged) {
    state.isPortfolioImageChanged = isChanged
  },
  setSelectedPortfolioItemIndex(state, index) {
    state.selectedPortfolioItemIndex = index
  },
  updateIsEditingPortfolio(state, isEditing) {
    state.isEditingPortfolio = isEditing
  },
  setSkills(state, skills) {
    state.skills = skills
  },
  updateIsEditingSkills(state, isEditing) {
    state.isEditingSkills = isEditing
  },
  setLinks(state, links) {
    state.links = links
  },
  setSelectedLinkIndex(state, index) {
    state.selectedLinkIndex = index
  },
  updateIsEditingLinks(state, isEditing) {
    state.isEditingLinks = isEditing
  },
  setEmail(state, email) {
    state.email = email
  },
  setUniversity(state, university) {
    state.university = university
  },
  setFaculty(state, faculty) {
    state.faculty = faculty
  },
  setDepartment(state, department) {
    state.department = department
  },
  setGraduationDate(state, graduationDate) {
    state.graduationDate = graduationDate
  },
  setBirthDate(state, birthDate) {
    state.birthDate = birthDate
  },
  updateIsEditingUserInfo(state, isEditing) {
    state.isEditingUserInfo = isEditing
  },
  setAcceptedOffers(state, acceptedOffers) {
    state.acceptedOffers = acceptedOffers
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
  setUnsubscribe(state, unsubscribe) {
    state.unsubscribe = unsubscribe
  },
}

export const actions = {
  queryProfile({commit}, uid) {
    // profile情報取得
    firestore.collection('users').doc(uid).collection('profile').doc(uid)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          let graduationDate = doc.data()['graduationDate']
          if (graduationDate) {
            let date = new Date( graduationDate.seconds * 1000 )
            graduationDate = date
          }

          commit('setPosition', doc.data()['position'])
          commit('setFirstName', doc.data()['firstName'])
          commit('setLastName', doc.data()['lastName'])
          commit('setDesiredOccupations', doc.data()['desiredOccupations'])
          commit('setSelfIntro', doc.data()['selfIntro'] != null ? doc.data()['selfIntro'] : '')
          commit('setWhatWantToDo', doc.data()['whatWantToDo'] != null ? doc.data()['whatWantToDo'] : '')
          commit('setPortfolio', doc.data()['portfolio'])
          commit('setSkills', doc.data()['skills'])
          commit('setLinks', doc.data()['links'])
          commit('setEmail', doc.data()['email'])
          commit('setUniversity', doc.data()['university'] != null ? doc.data()['university'] : '')
          commit('setFaculty', doc.data()['faculty'] != null ? doc.data()['faculty'] : '')
          commit('setDepartment', doc.data()['department'] != null ? doc.data()['department'] : '')
          commit('setGraduationDate', graduationDate)
          commit('setBirthDate', doc.data()['birthDate'])
          commit('setAcceptedOffers', doc.data()['acceptedOffers'])
        }
        commit('updateIsLoading', false)
      })
      .catch((error) => {
        commit('updateIsLoading', false)
        console.error("Error adding document: ", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  setLastSignInDate({commit}, date) {
    commit('setLastSignInDate', date)
  },
  updateIsAdmin({commit}, isAdmin) {
    commit('updateIsAdmin', isAdmin)
  },
  setPlan({commit}, plan) {
    commit('setPlan', plan)
  },
  setType({commit}, type) {
    commit('setType', type)
  },
  setCompletionPercentage({commit}, completionPercentage) {
    commit('setCompletionPercentage', completionPercentage)
  },
  setPoints({commit}, points) {
    commit('setPoints', points)
  },
  updateIsEditingPosition({commit}, isEditing) {
    commit('updateIsEditingPosition', isEditing)
  },
  updatePosition({commit}, {uid, position}) {
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        position: position,
      })
      .then(() => {
        commit('setPosition', position)
        commit('updateIsEditingPosition', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  setCompanyId({commit}, companyId) {
    commit('setCompanyId', companyId)
  },
  setEmail({commit}, email) {
    commit('setEmail', email)
  },
  setImageUrl({commit}, imageUrl) {
    commit('setImageUrl', imageUrl)
  },
  setFirstName({commit}, firstName) {
    commit('setFirstName', firstName)
  },
  setLastName({commit}, lastName) {
    commit('setLastName', lastName)
  },
  updateImageFileSizeValid({commit}, valid) {
    commit('updateImageFileSizeValid', valid)
  },
  updateIsEditingProfileImage({commit}, isEditing) {
    commit('updateIsEditingProfileImage', isEditing)
  },
  updateProfileImage({commit, state}, {uid, imageFile}) {
    const date = new Date()
    var timestamp = Math.floor( date.getTime() / 1000 )

    // アップロード
    const uploadTask = storageRef.child(`users/${uid}/profile/${timestamp}.jpg`).put(imageFile)
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // dbにurl保存
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL)
        const batch = firestore.batch()
        const userRef = firestore.collection('users').doc(uid)
        batch.update(userRef, {
          imageUrl: downloadURL
        })
        const profileRef = firestore.collection('users')
          .doc(uid).collection('profile').doc(uid)
        batch.update(profileRef, {
          imageUrl: downloadURL
        })
        if (state.type == 'user') {
          const detailRef = firestore.collection('users')
            .doc(uid).collection('detail').doc(uid)
          batch.update(detailRef, {
            imageUrl: downloadURL
          })
        }

        batch.commit()
          .then(() => {
            commit('updateIsEditingProfileImage', false)
            commit('setImageUrl', downloadURL)
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      })
    })
  },
  updateIsEditingUserName({commit}, isEditing) {
    commit('updateIsEditingUserName', isEditing)
  },
  updateUserName({commit, state}, {uid, firstName, lastName}) {
    const nameData = {
      firstName: firstName,
      lastName: lastName,
    }
    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(uid)
    batch.update(userRef, nameData)
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, nameData)

    if (state.type == 'user') {
      const detailRef = firestore.collection('users')
        .doc(uid).collection('detail').doc(uid)
      batch.update(detailRef, nameData)
    }

    batch.commit()
      .then(() => {
        commit('setFirstName', firstName)
        commit('setLastName', lastName)
        commit('updateIsEditingUserName', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingDesiredOccupations({commit}, isEditing) {
    commit('updateIsEditingDesiredOccupations', isEditing)
  },
  updateDesiredOccupations({commit}, {uid, desiredOccupations}) {
    let occupations = {
      engineer: false,
      designer: false,
      sales: false,
      others: false,
    }
    if (desiredOccupations.includes('エンジニア')) {
      occupations.engineer = true
    }
    if (desiredOccupations.includes('デザイナー')) {
      occupations.designer = true
    }
    if (desiredOccupations.includes('営業')) {
      occupations.sales = true
    }
    if (desiredOccupations.includes('その他')) {
      occupations.others = true
    }

    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(uid)
    batch.update(userRef, {
      desiredOccupations: occupations
    })
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      desiredOccupations: occupations
    })
    const detailRef = firestore.collection('users')
      .doc(uid).collection('detail').doc(uid)
    batch.update(detailRef, {
      desiredOccupations: occupations
    })
    batch.commit()
      .then(() => {
        commit('setDesiredOccupations', occupations)
        commit('updateIsEditingDesiredOccupations', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingSelfIntro({commit}, isEditing) {
    commit('updateIsEditingSelfIntro', isEditing)
  },
  updateSelfIntro({commit, state}, {uid, selfIntro}) {
    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(uid)
    batch.update(userRef, {
      selfIntro: selfIntro
    })
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      selfIntro: selfIntro,
    })

    if (state.type == 'user') {
      const detailRef = firestore.collection('users')
        .doc(uid).collection('detail').doc(uid)
      batch.update(detailRef, {
        selfIntro: selfIntro,
      })
    }

    batch.commit()
      .then(() => {
        commit('setSelfIntro', selfIntro)
        commit('updateIsEditingSelfIntro', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingWhatWantToDo({commit}, isEditing) {
    commit('updateIsEditingWhatWantToDo', isEditing)
  },
  updateWhatWantToDo({commit}, {uid, whatWantToDo}) {
    const batch = firestore.batch()
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      whatWantToDo: whatWantToDo,
    })
    const detailRef = firestore.collection('users')
      .doc(uid).collection('detail').doc(uid)
    batch.update(detailRef, {
      whatWantToDo: whatWantToDo,
    })
    batch.commit()
      .then(() => {
        commit('setWhatWantToDo', whatWantToDo)
        commit('updateIsEditingWhatWantToDo', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsPortfolioImageChanged({commit}, isChanged) {
    commit('updateIsPortfolioImageChanged', isChanged)
  },
  setSelectedPortfolioItemIndex({commit}, index) {
    commit('setSelectedPortfolioItemIndex', index)
  },
  updateIsEditingPortfolio({commit}, isEditing) {
    commit('updateIsEditingPortfolio', isEditing)
  },
  updatePortfolio({commit}, {uid, isPortfolioImageChanged, selectedIndex, portfolio, tempPortfolio, imageFile, imageUrl, title, content, url}) {
    // 画像が変更されているか
    if (isPortfolioImageChanged) {
      const date = new Date()
      var timestamp = Math.floor( date.getTime() / 1000 )

      if (selectedIndex != null) {
        const fileName = portfolio[selectedIndex].timestamp
        storageRef.child(`users/${uid}/portfolio/${fileName}.jpg`).delete()
      }

      // 画像アップロード
      const uploadTask = storageRef.child(`users/${uid}/portfolio/${timestamp}.jpg`).put(imageFile)
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // dbに保存
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL)
          // 新しいitem
          const tempPortfolioItem = {
            imageUrl: downloadURL,
            title: title,
            content: content,
            url: url,
            timestamp: timestamp
          }
          // listに入れる
          if (selectedIndex != null) {
            tempPortfolio.splice(selectedIndex, 1)
            tempPortfolio.splice(selectedIndex, 0, tempPortfolioItem)
          } else {
            if (tempPortfolio == null) {
              tempPortfolio = []
            }
            tempPortfolio.push(tempPortfolioItem)
          }
          // dbに保存
          const batch = firestore.batch()
          const userRef = firestore.collection('users').doc(uid)
          batch.update(userRef, {
            hasPortfolio: true
          })
          const profileRef = firestore.collection('users')
            .doc(uid).collection('profile').doc(uid)
          batch.update(profileRef, {
            portfolio: tempPortfolio,
          })
          const detailRef = firestore.collection('users')
            .doc(uid).collection('detail').doc(uid)
          batch.update(detailRef, {
            portfolio: tempPortfolio,
          })
          batch.commit()
            .then(() => {
              commit('setPortfolio', tempPortfolio)
              commit('updateIsEditingPortfolio', false)
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })
        })
      })
    } else {
      const tempPortfolioItem = {
        imageUrl: imageUrl,
        title: title,
        content: content,
        url: url
      }
      if (selectedIndex != null) {
        tempPortfolio.splice(selectedIndex, 1)
        tempPortfolio.splice(selectedIndex, 0, tempPortfolioItem)
      }
      const batch = firestore.batch()
      const userRef = firestore.collection('users').doc(uid)
      batch.update(userRef, {
        hasPortfolio: true
      })
      const profileRef = firestore.collection('users')
        .doc(uid).collection('profile').doc(uid)
      batch.update(profileRef, {
        portfolio: tempPortfolio,
      })
      const detailRef = firestore.collection('users')
        .doc(uid).collection('detail').doc(uid)
      batch.update(detailRef, {
        portfolio: tempPortfolio,
      })
      batch.commit()
        .then(() => {
          commit('setPortfolio', tempPortfolio)
          commit('updateIsEditingPortfolio', false)
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    }
  },
  deletePortfolioItem({commit}, {uid, selectedIndex, portfolio, tempPortfolio}) {
    // 画像削除
    if (selectedIndex != null) {
      const fileName = portfolio[selectedIndex].timestamp
      storageRef.child(`users/${uid}/portfolio/${fileName}.jpg`).delete()
    }
    tempPortfolio.splice(selectedIndex, 1)
    const hasPortfolio = tempPortfolio.length == 0 ? false : true

    const batch = firestore.batch()
    const userRef = firestore.collection('users').doc(uid)
    batch.update(userRef, {
      hasPortfolio: hasPortfolio
    })
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      portfolio: tempPortfolio,
    })
    const detailRef = firestore.collection('users')
      .doc(uid).collection('detail').doc(uid)
    batch.update(detailRef, {
      portfolio: tempPortfolio,
    })
    batch.commit()
      .then(() => {
        commit('setPortfolio', tempPortfolio)
        commit('updateIsEditingPortfolio', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingSkills({commit}, isEditing) {
    commit('updateIsEditingSkills', isEditing)
  },
  updateSkills({commit}, {uid, skills}) {
    // dbに保存
    const batch = firestore.batch()
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      skills: skills,
    })
    const detailRef = firestore.collection('users')
      .doc(uid).collection('detail').doc(uid)
    batch.update(detailRef, {
      skills: skills,
    })
    batch.commit()
      .then(() => {
        commit('setSkills', skills)
        commit('updateIsEditingSkills', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  setSelectedLinkIndex({commit}, index) {
    commit('setSelectedLinkIndex', index)
  },
  updateIsEditingLinks({commit}, isEditing) {
    commit('updateIsEditingLinks', isEditing)
  },
  updateLinks({commit}, {uid, selectedIndex, links, title, url}) {
    // 新しいリンク
    const tempLink = {
      title: title,
      url: url
    }
    // listに入れる
    if (selectedIndex != null) {
      links.splice(selectedIndex, 1)
      links.splice(selectedIndex, 0, tempLink)
    } else {
      if (links == null) {
        links = []
      }
      links.push(tempLink)
    }
    // dbに保存
    const batch = firestore.batch()
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      links: links,
    })
    const detailRef = firestore.collection('users')
      .doc(uid).collection('detail').doc(uid)
    batch.update(detailRef, {
      links: links,
    })
    batch.commit()
      .then(() => {
        commit('setLinks', links)
        commit('updateIsEditingLinks', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  deleteLink({commit}, {uid, selectedIndex, links}) {
    links.splice(selectedIndex, 1)
    const batch = firestore.batch()
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      links: links,
    })
    const detailRef = firestore.collection('users')
      .doc(uid).collection('detail').doc(uid)
    batch.update(detailRef, {
      links: links,
    })
    batch.commit()
      .then(() => {
        commit('setLinks', links)
        commit('updateIsEditingLinks', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingUserInfo({commit}, isEditing) {
    commit('updateIsEditingUserInfo', isEditing)
  },
  updateUserInfo({commit}, {uid, university, faculty, department, graduationDate}) {
    var graduationDateArr = graduationDate.split('-')
    graduationDate = new Date(graduationDateArr[0], graduationDateArr[1] - 1, graduationDateArr[2])

    const batch = firestore.batch()
    const profileRef = firestore.collection('users')
      .doc(uid).collection('profile').doc(uid)
    batch.update(profileRef, {
      university: university,
      faculty: faculty,
      department: department,
      graduationDate: graduationDate
    })
    const detailRef = firestore.collection('users')
      .doc(uid).collection('detail').doc(uid)
    batch.update(detailRef, {
      university: university,
      faculty: faculty,
      department: department,
      graduationDate: graduationDate
    })
    batch.commit()
      .then(() => {
        commit('setUniversity', university)
        commit('setFaculty', faculty)
        commit('setDepartment', department)
        commit('setGraduationDate', graduationDate)
        commit('updateIsEditingUserInfo', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  // プランの変更に対応
  setCompaniesListener({commit}, companyId) {
    if (!state.unsubscribe) {
      const listener = firestore.collection('companies')
        .doc(companyId)
        .onSnapshot(function(doc) {
          commit('setPlan', doc.data()['plan'])
        })
      commit('setUnsubscribe', listener)
    }
  },
  resetCompaniesListener({commit, state}) {
    if (state.unsubscribe) {
      state.unsubscribe()
    }
    commit('setUnsubscribe', null)
  },
  resetProfileState({commit}) {
    commit('updateImageFileSizeValid', true)
    commit('updateIsEditingProfileImage', false)
    commit('setFirstName', '')
    commit('setLastName', '')
    commit('updateIsEditingUserName', false)
    commit('setDesiredOccupations', [])
    commit('updateIsEditingDesiredOccupations', false)
    commit('setSelfIntro', '')
    commit('updateIsEditingSelfIntro', false)
    commit('setWhatWantToDo', '')
    commit('updateIsEditingWhatWantToDo', false)
    commit('setPortfolio', null)
    commit('updateIsPortfolioImageChanged', false)
    commit('setSelectedPortfolioItemIndex', null)
    commit('updateIsEditingPortfolio', false)
    commit('setSkills', null)
    commit('updateIsEditingSkills', false)
    commit('setLinks', null)
    commit('setSelectedLinkIndex', null)
    commit('updateIsEditingLinks', false)
    commit('setUniversity', '')
    commit('setFaculty', '')
    commit('setDepartment', '')
    commit('setGraduationDate', '')
    commit('setBirthDate', '')
    commit('updateIsEditingUserInfo', null)
    commit('setAcceptedOffers', [])
    commit('updateIsLoading', false)
  },
  resetState({commit}) {
    commit('setImageUrl', '')
    commit('setLastSignInDate', null)
    commit('updateIsAdmin', false)
    commit('setPlan', null)
    commit('setType', null)
    commit('setCompanyId', '')
    commit('setEmail', '')
    commit('setPoints', 0)
    commit('setCompletionPercentage', 0)
  }
}
