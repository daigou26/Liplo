export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'


export const state = () => ({
  type: null,
  position: null,
  isEditingPosition: false,
  companyId: null,
  imageUrl: '',
  imageFileSizeValid: true,
  isEditingProfileImage: false,
  firstName: '',
  lastName: '',
  isEditingUserName: false,
  selfIntro: '',
  isEditingSelfIntro: false,
  whatWantToDo: '',
  isEditingWhatWantToDo: false,
  portfolio: null,
  isPortfolioImageChanged: false,
  selectedPortfolioItemIndex: null,
  isEditingPortfolio: false,
  skills: null,
  selectedSkillIndex: null,
  isEditingSkills: false,
  links: null,
  selectedLinkIndex: null,
  isEditingLinks: false,
  email: '',
  university: '',
  faculty: '',
  department: '',
  birthTimestamp: '',
  isEditingUserInfo: false,
  acceptedOffers: [],
})

export const mutations = {
  setType(state, type) {
    state.type = type
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
  setSelectedSkillIndex(state, index) {
    state.selectedSkillIndex = index
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
  setBirthTimestamp(state, birthTimestamp) {
    state.birthTimestamp = birthTimestamp
  },
  updateIsEditingUserInfo(state, isEditing) {
    state.isEditingUserInfo = isEditing
  },
  setAcceptedOffers(state, acceptedOffers) {
    state.acceptedOffers = acceptedOffers
  },
}

export const actions = {
  queryProfile({commit}, uid) {
    // profile情報取得
    firestore.collection('users').doc(uid).collection('profile').doc(uid)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setPosition', doc.data()['position'])
          commit('setFirstName', doc.data()['firstName'])
          commit('setLastName', doc.data()['lastName'])
          commit('setSelfIntro', doc.data()['selfIntro'] != null ? doc.data()['selfIntro'] : '')
          commit('setWhatWantToDo', doc.data()['whatWantToDo'] != null ? doc.data()['whatWantToDo'] : '')
          commit('setPortfolio', doc.data()['portfolio'])
          commit('setSkills', doc.data()['skills'])
          commit('setLinks', doc.data()['links'])
          commit('setEmail', doc.data()['email'])
          commit('setUniversity', doc.data()['university'] != null ? doc.data()['university'] : '')
          commit('setFaculty', doc.data()['faculty'] != null ? doc.data()['faculty'] : '')
          commit('setDepartment', doc.data()['department'] != null ? doc.data()['department'] : '')
          commit('setBirthTimestamp', doc.data()['birthTimestamp'])
          commit('setAcceptedOffers', doc.data()['acceptedOffers'])
        }
      })
  },
  setType({commit}, type) {
    commit('setType', type)
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
  updateProfileImage({commit}, {uid, imageFile}) {
    // アップロード
    const uploadTask = storageRef.child(`users/${uid}/profile.jpg`).put(imageFile)
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // dbにurl保存
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL)
        firestore.collection('users').doc(uid)
          .update({
            imageUrl: downloadURL
          })
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
  updateUserName({commit}, {uid, firstName, lastName}) {
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
  updateIsEditingSelfIntro({commit}, isEditing) {
    commit('updateIsEditingSelfIntro', isEditing)
  },
  updateSelfIntro({commit}, {uid, selfIntro}) {
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        selfIntro: selfIntro,
      })
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
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        whatWantToDo: whatWantToDo,
      })
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
          firestore.collection('users').doc(uid)
            .collection('profile').doc(uid)
            .update({
              portfolio: tempPortfolio,
            })
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
      firestore.collection('users').doc(uid)
        .collection('profile').doc(uid)
        .update({
          portfolio: tempPortfolio,
        })
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
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        portfolio: tempPortfolio,
      })
      .then(() => {
        commit('setPortfolio', tempPortfolio)
        commit('updateIsEditingPortfolio', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  setSelectedSkillIndex({commit}, index) {
    commit('setSelectedSkillIndex', index)
  },
  updateIsEditingSkills({commit}, isEditing) {
    commit('updateIsEditingSkills', isEditing)
  },
  updateSkills({commit}, {uid, selectedIndex, skills, title, content}) {
    // 新しいスキル
    const tempSkill = {
      title: title,
      content: content
    }
    // listに入れる
    if (selectedIndex != null) {
      skills.splice(selectedIndex, 1)
      skills.splice(selectedIndex, 0, tempSkill)
    } else {
      if (skills == null) {
        skills = []
      }
      skills.push(tempSkill)
    }
    // dbに保存
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        skills: skills,
      })
      .then(() => {
        commit('setSkills', skills)
        commit('updateIsEditingSkills', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  deleteSkill({commit}, {uid, selectedIndex, skills}) {
    skills.splice(selectedIndex, 1)
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        skills: skills,
      })
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
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        links: links,
      })
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
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        links: links,
      })
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
  updateUserInfo({commit}, {uid, university, faculty, department}) {
    firestore.collection('users').doc(uid)
      .collection('profile').doc(uid)
      .update({
        university: university,
        faculty: faculty,
        department: department,
      })
      .then(() => {
        commit('setUniversity', university)
        commit('setFaculty', faculty)
        commit('setDepartment', department)
        commit('updateIsEditingUserInfo', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  resetState({commit}) {
    commit('setType', null)
    commit('setImageUrl', '')
    commit('updateImageFileSizeValid', true)
    commit('updateIsEditingProfileImage', false)
    commit('setFirstName', '')
    commit('setLastName', '')
    commit('updateIsEditingUserName', false)
    commit('setSelfIntro', '')
    commit('updateIsEditingSelfIntro', false)
    commit('setWhatWantToDo', '')
    commit('updateIsEditingWhatWantToDo', false)
    commit('setPortfolio', null)
    commit('updateIsPortfolioImageChanged', false)
    commit('setSelectedPortfolioItemIndex', null)
    commit('updateIsEditingPortfolio', false)
    commit('setSkills', null)
    commit('setSelectedSkillIndex', null)
    commit('updateIsEditingSkills', false)
    commit('setLinks', null)
    commit('setSelectedLinkIndex', null)
    commit('updateIsEditingLinks', false)
    commit('setEmail', '')
    commit('setUniversity', '')
    commit('setFaculty', '')
    commit('setDepartment', '')
    commit('setBirthTimestamp', '')
    commit('updateIsEditingUserInfo', null)
    commit('setAcceptedOffers', [])
  },
}
