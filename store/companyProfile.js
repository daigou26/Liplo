export const strict = false
import { firestore, storageRef, auth } from '@/plugins/firebase'

export const state = () => ({
  imageFileSizeValid: true,
  topImageUrl: '',
  isEditingTopImage: false,
  companyId: '',
  companyName: '',
  isEditingCompanyName: false,
  companyImageUrl: '',
  isEditingCompanyImage: false,
  email: '',
  members: null,
  location: '',
  foundedDate: '',
  url: '',
  employeesCount: 0,
  mission: '',
  isEditingMission: false,
  vision: '',
  isEditingVision: false,
  value: '',
  isEditingValue: false,
  culture: '',
  isEditingCulture: false,
  system: '',
  isEditingSystem: false,
  why: '',
  isEditingWhy: false,
  what: '',
  isEditingWhat: false,
  services: null,
  isServiceImageChanged: false,
  selectedServiceIndex: null,
  isEditingServices: false,
  welfare: '',
  isEditingWelfare: false,
  isEditingCompanyInfo: false,
  workday: 0,
  features: '',
  field: '',
  addMemberError: '',
  addMemberLoading: false,
  isLoading: false,
})

export const mutations = {
  updateImageFileSizeValid(state, valid) {
    state.imageFileSizeValid = valid
  },
  setTopImageUrl(state, imageUrl) {
    state.topImageUrl = imageUrl
  },
  updateIsEditingTopImage(state, isEditing) {
    state.isEditingTopImage = isEditing
  },
  setCompanyId(state, companyId) {
    state.companyId = companyId
  },
  setCompanyName(state, companyName) {
    state.companyName = companyName
  },
  updateIsEditingCompanyName(state, isEditing) {
    state.isEditingCompanyName = isEditing
  },
  setCompanyImageUrl(state, companyImageUrl) {
    state.companyImageUrl = companyImageUrl
  },
  updateIsEditingCompanyImage(state, isEditing) {
    state.isEditingCompanyImage = isEditing
  },
  setEmail(state, email) {
    state.email = email
  },
  setMembers(state, members) {
    state.members = members
  },
  setLocation(state, location) {
    state.location = location
  },
  setFoundedDate(state, foundedDate) {
    state.foundedDate = foundedDate
  },
  setUrl(state, url) {
    state.url = url
  },
  setEmployeesCount(state, count) {
    state.employeesCount = count
  },
  setMission(state, mission) {
    state.mission = mission
  },
  updateIsEditingMission(state, isEditing) {
    state.isEditingMission = isEditing
  },
  setVision(state, vision) {
    state.vision = vision
  },
  updateIsEditingVision(state, isEditing) {
    state.isEditingVision = isEditing
  },
  setValue(state, value) {
    state.value = value
  },
  updateIsEditingValue(state, isEditing) {
    state.isEditingValue = isEditing
  },
  setCulture(state, culture) {
    state.culture = culture
  },
  updateIsEditingCulture(state, isEditing) {
    state.isEditingCulture = isEditing
  },
  setSystem(state, system) {
    state.system = system
  },
  updateIsEditingSystem(state, isEditing) {
    state.isEditingSystem = isEditing
  },
  setWhy(state, why) {
    state.why = why
  },
  updateIsEditingWhy(state, isEditing) {
    state.isEditingWhy = isEditing
  },
  setWhat(state, what) {
    state.what = what
  },
  updateIsEditingWhat(state, isEditing) {
    state.isEditingWhat = isEditing
  },
  setServices(state, services) {
    state.services = services
  },
  updateIsServiceImageChanged(state, isChanged) {
    state.isServiceImageChanged = isChanged
  },
  setSelectedServiceIndex(state, index) {
    state.selectedServiceIndex = index
  },
  updateIsEditingServices(state, isEditing) {
    state.isEditingServices = isEditing
  },
  setWelfare(state, welfare) {
    state.welfare = welfare
  },
  updateIsEditingWelfare(state, isEditing) {
    state.isEditingWelfare = isEditing
  },
  updateIsEditingCompanyInfo(state, isEditing) {
    state.isEditingCompanyInfo = isEditing
  },
  setWorkday(state, workday) {
    state.workday = workday
  },
  setFeatures(state, features) {
    state.features = features
  },
  setAddMemberError(state, error) {
    state.addMemberError = error
  },
  updateAddMemberLoading(state, loading) {
    state.addMemberLoading = loading
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  }
}

export const actions = {
  queryCompanyDetail({commit}, companyId) {
    return firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          let foundedDate = doc.data()['foundedDate']
          if (foundedDate) {
            let date = new Date( foundedDate.seconds * 1000 )
            foundedDate = date
          }

          commit('setTopImageUrl', doc.data()['topImageUrl'])
          commit('setCompanyId', doc.id)
          commit('setCompanyName', doc.data()['companyName'])
          commit('setCompanyImageUrl', doc.data()['companyImageUrl'])
          commit('setEmail', doc.data()['email'] ? doc.data()['email'] : '')
          commit('setMembers', doc.data()['members'])
          commit('setLocation', doc.data()['location'] ? doc.data()['location'] : '')
          commit('setFoundedDate', foundedDate)
          commit('setUrl', doc.data()['url'] ? doc.data()['url'] : '')
          commit('setEmployeesCount', doc.data()['employeesCount'])
          commit('setMission', doc.data()['mission'] ? doc.data()['mission'] : '')
          commit('setVision', doc.data()['vision'] ? doc.data()['vision'] : '')
          commit('setValue', doc.data()['value'] ? doc.data()['value'] : '')
          commit('setCulture', doc.data()['culture'] ? doc.data()['culture'] : '')
          commit('setSystem', doc.data()['system'] ? doc.data()['system'] : '')
          commit('setWhy', doc.data()['why'] ? doc.data()['why'] : '')
          commit('setWhat', doc.data()['what'] ? doc.data()['what'] : '')
          commit('setServices', doc.data()['services'])
          commit('setWelfare', doc.data()['welfare'] ? doc.data()['welfare'] : '')
          commit('setWorkday', doc.data()['workday'])

          commit('updateIsLoading', false)
        }
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  updateImageFileSizeValid({commit}, valid) {
    commit('updateImageFileSizeValid', valid)
  },
  updateIsEditingTopImage({commit}, isEditing) {
    commit('updateIsEditingTopImage', isEditing)
  },
  updateTopImage({commit}, {companyId, imageFile}) {
    // アップロード
    const uploadTask = storageRef.child(`companies/${companyId}/top.jpg`).put(imageFile)
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // dbにurl保存
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        firestore.collection('companies')
          .doc(companyId)
          .collection('detail')
          .doc(companyId)
          .update({
            topImageUrl: downloadURL
          })
          .then(() => {
            commit('updateIsEditingTopImage', false)
            commit('setTopImageUrl', downloadURL)
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      })
    })
  },
  updateIsEditingCompanyImage({commit}, isEditing) {
    commit('updateIsEditingCompanyImage', isEditing)
  },
  updateCompanyImage({commit}, {companyId, imageFile}) {
    const date = new Date()
    var timestamp = Math.floor( date.getTime() / 1000 )
    // アップロード
    const uploadTask = storageRef.child(`companies/${companyId}/logo/${timestamp}.jpg`).put(imageFile)
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // dbにurl保存
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        const batch = firestore.batch()
        const companyRef = firestore.collection('companies').doc(companyId)
        batch.update(companyRef, {
          imageUrl: downloadURL
        })
        const companyDetailRef = firestore.collection('companies')
          .doc(companyId)
          .collection('detail')
          .doc(companyId)

        batch.update(companyDetailRef, {
          companyImageUrl: downloadURL
        })
        batch.commit()
          .then(() => {
            commit('updateIsEditingCompanyImage', false)
            commit('setCompanyImageUrl', downloadURL)
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      })
    })
  },
  updateIsEditingCompanyName({commit}, isEditing) {
    commit('updateIsEditingCompanyName', isEditing)
  },
  updateCompanyName({commit}, {companyId, companyName}) {
    const batch = firestore.batch()
    const companyRef = firestore.collection('companies').doc(companyId)
    batch.update(companyRef, {
      companyName: companyName
    })
    const companyDetailRef = firestore.collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
    batch.update(companyDetailRef, {
      companyName: companyName
    })
    batch.commit()
      .then(() => {
        commit('setCompanyName', companyName)
        commit('updateIsEditingCompanyName', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  resetAddMemberError({commit}) {
    commit('setAddMemberError', '')
  },
  updateAddMemberLoading({commit}, loading) {
     commit('updateAddMemberLoading', loading)
  },
  addMember({commit}, {companyId, companyName, userName, email}) {
    firestore.collection('companies')
      .doc(companyId)
      .collection('invitedMembers')
      .add({
        companyName,
        userName,
        email: email,
        createdAt: new Date()
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingMission({commit}, isEditing) {
    commit('updateIsEditingMission', isEditing)
  },
  updateMission({commit}, {companyId, mission}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        mission: mission
      })
      .then(() => {
        commit('setMission', mission)
        commit('updateIsEditingMission', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingVision({commit}, isEditing) {
    commit('updateIsEditingVision', isEditing)
  },
  updateVision({commit}, {companyId, vision}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        vision: vision
      })
      .then(() => {
        commit('setVision', vision)
        commit('updateIsEditingVision', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingValue({commit}, isEditing) {
    commit('updateIsEditingValue', isEditing)
  },
  updateValue({commit}, {companyId, value}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        value: value
      })
      .then(() => {
        commit('setValue', value)
        commit('updateIsEditingValue', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingCulture({commit}, isEditing) {
    commit('updateIsEditingCulture', isEditing)
  },
  updateCulture({commit}, {companyId, culture}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        culture: culture
      })
      .then(() => {
        commit('setCulture', culture)
        commit('updateIsEditingCulture', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingSystem({commit}, isEditing) {
    commit('updateIsEditingSystem', isEditing)
  },
  updateSystem({commit}, {companyId, system}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        system: system
      })
      .then(() => {
        commit('setSystem', system)
        commit('updateIsEditingSystem', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingWhy({commit}, isEditing) {
    commit('updateIsEditingWhy', isEditing)
  },
  updateWhy({commit}, {companyId, why}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        why: why
      })
      .then(() => {
        commit('setWhy', why)
        commit('updateIsEditingWhy', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingWhat({commit}, isEditing) {
    commit('updateIsEditingWhat', isEditing)
  },
  updateWhat({commit}, {companyId, what}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        what: what
      })
      .then(() => {
        commit('setWhat', what)
        commit('updateIsEditingWhat', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsServiceImageChanged({commit}, isChanged) {
    commit('updateIsServiceImageChanged', isChanged)
  },
  setSelectedServiceIndex({commit}, index) {
    commit('setSelectedServiceIndex', index)
  },
  updateIsEditingServices({commit}, isEditing) {
    commit('updateIsEditingServices', isEditing)
  },
  updateServices({commit}, {
    companyId,
    companyName,
    companyImageUrl,
    isServiceImageChanged,
    selectedIndex,
    services,
    tempServices,
    imageFile,
    imageUrl,
    title,
    content,
    url
  }) {
    const batch = firestore.batch()

    // 画像が変更されているか
    if (isServiceImageChanged) {
      const date = new Date()
      var timestamp = Math.floor( date.getTime() / 1000 )

      if (selectedIndex != null) {
        const fileName = services[selectedIndex].timestamp
        storageRef.child(`companies/${companyId}/services/${fileName}.jpg`).delete()
      }

      // 画像アップロード
      const uploadTask = storageRef.child(`companies/${companyId}/services/${timestamp}.jpg`).put(imageFile)
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // dbに保存
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          // 新しいデータ
          let tempService = {
            imageUrl: downloadURL,
            title: title,
            content: content,
            url: url,
            timestamp: timestamp
          }
          // project 用のデータ
          let projectData = tempService
          projectData.companyId = companyId
          projectData.companyName = companyName
          projectData.createdAt = new Date()
          if (companyImageUrl) {
            projectData.companyImageUrl = companyImageUrl
          }

          if (selectedIndex != null) {
            let projectId = tempServices[selectedIndex].projectId
            // project 更新
            let projectRef = firestore.collection('projects').doc(projectId)
            batch.update(projectRef, projectData)

            // list に追加
            tempService.projectId = projectId
            tempServices.splice(selectedIndex, 1)
            tempServices.splice(selectedIndex, 0, tempService)
          } else {
            // project 追加
            let projectId = firestore.collection('projects').doc().id
            let projectRef = firestore.collection('projects').doc(projectId)
            batch.set(projectRef, projectData)

            // list に追加
            tempService.projectId = projectId
            if (tempServices == null) {
              tempServices = []
            }
            tempServices.push(tempService)
          }

          // company detail 更新
          let companyDetailRef = firestore.collection('companies').doc(companyId)
            .collection('detail').doc(companyId)
          batch.update(companyDetailRef, {
            services: tempServices,
          })

          batch.commit()
            .then(() => {
              commit('setServices', tempServices)
              commit('updateIsEditingServices', false)
            })
            .catch((error) => {
              console.error("Error", error)
            })
        })
      })
    } else {
      // 新しいデータ
      let tempService = {
        imageUrl: imageUrl,
        title: title,
        content: content,
        url: url
      }
      // project 用のデータ
      let projectData = tempService
      projectData.createdAt = new Date()

      if (selectedIndex != null) {
        let projectId = tempServices[selectedIndex].projectId
        // project 更新
        let projectRef = firestore.collection('projects').doc(projectId)
        batch.update(projectRef, projectData)

        // company services 更新
        tempService.timestamp = tempServices[selectedIndex].timestamp
        tempService.projectId = projectId
        tempServices.splice(selectedIndex, 1)
        tempServices.splice(selectedIndex, 0, tempService)
      }

      // company detail 更新
      let companyDetailRef = firestore.collection('companies').doc(companyId)
        .collection('detail').doc(companyId)
      batch.update(companyDetailRef, {
        services: tempServices,
      })

      batch.commit()
        .then(() => {
          commit('setServices', tempServices)
          commit('updateIsEditingServices', false)
        })
        .catch((error) => {
          console.error("Error", error)
        })
    }
  },
  deleteService({commit}, {companyId, selectedIndex, services, tempServices}) {
    // 画像削除
    if (selectedIndex != null) {
      const fileName = services[selectedIndex].timestamp
      storageRef.child(`companies/${companyId}/services/${fileName}.jpg`).delete()
    }
    tempServices.splice(selectedIndex, 1)
    firestore.collection('companies').doc(companyId)
      .collection('detail').doc(companyId)
      .update({
        services: tempServices,
      })
      .then(() => {
        commit('setServices', tempServices)
        commit('updateIsEditingServices', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingWelfare({commit}, isEditing) {
    commit('updateIsEditingWelfare', isEditing)
  },
  updateWelfare({commit}, {companyId, welfare}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        welfare: welfare
      })
      .then(() => {
        commit('setWelfare', welfare)
        commit('updateIsEditingWelfare', false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  },
  updateIsEditingCompanyInfo({commit}, isEditing) {
    commit('updateIsEditingCompanyInfo', isEditing)
  },
  updateCompanyInfo({commit}, {companyId, email, location, foundedDate, url, employeesCount}) {
    if (foundedDate) {
      var foundedDateArr = foundedDate.split('-')
      foundedDate = new Date(foundedDateArr[0], foundedDateArr[1] - 1, foundedDateArr[2])
    }
    if (email) {
      const batch = firestore.batch()
      const companyRef = firestore.collection('companies').doc(companyId)
      batch.update(companyRef, {
        email: email
      })
      const companyDetailRef = firestore.collection('companies')
        .doc(companyId)
        .collection('detail')
        .doc(companyId)
      batch.update(companyDetailRef, {
        foundedDate: foundedDate,
        location: location,
        employeesCount: employeesCount,
        email: email,
        url: url,
      })
      batch.commit()
        .then(() => {
          commit('setFoundedDate', foundedDate)
          commit('setLocation', location)
          commit('setEmployeesCount', employeesCount)
          commit('setEmail', email)
          commit('setUrl', url)
          commit('updateIsEditingCompanyInfo', false)
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    } else {
      firestore.collection('companies').doc(companyId)
        .collection('detail')
        .doc(companyId)
        .update({
          location: location,
          foundedDate: foundedDate,
          url: url,
          employeesCount: employeesCount
        })
        .then(() => {
          commit('setLocation', location)
          commit('setFoundedDate', foundedDate)
          commit('setUrl', url)
          commit('setEmployeesCount', employeesCount)
          commit('updateIsEditingCompanyInfo', false)
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    }
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('updateImageFileSizeValid', false)
    commit('setTopImageUrl', '')
    commit('updateIsEditingTopImage', false)
    commit('setCompanyId', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
    commit('updateIsEditingCompanyImage', false)
    commit('setEmail', '')
    commit('setMembers', null)
    commit('setLocation', '')
    commit('setFoundedDate', '')
    commit('setUrl', '')
    commit('setEmployeesCount', 0)
    commit('setMission', '')
    commit('updateIsEditingMission', false)
    commit('setVision', '')
    commit('updateIsEditingVision', false)
    commit('setValue', '')
    commit('updateIsEditingValue', false)
    commit('setCulture', '')
    commit('updateIsEditingCulture', false)
    commit('setSystem', '')
    commit('updateIsEditingSystem', false)
    commit('setWhy', '')
    commit('updateIsEditingWhy', false)
    commit('setWhat', '')
    commit('updateIsEditingWhat', false)
    commit('setServices', null)
    commit('updateIsServiceImageChanged', false)
    commit('setSelectedServiceIndex', null)
    commit('updateIsEditingServices', false)
    commit('setWelfare', '')
    commit('updateIsEditingWelfare', false)
    commit('updateIsEditingCompanyInfo', false)
    commit('setWorkday', 0)
    commit('setFeatures', '')
    commit('setAddMemberError', '')
    commit('updateAddMemberLoading', false)
    commit('updateIsLoading', false)
  },
}
