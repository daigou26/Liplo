export const strict = false
import { firestore, storageRef, auth } from '@/plugins/firebase'

export const state = () => ({
  topImageUrl: '',
  isEditingTopImage: false,
  companyId: '',
  companyName: '',
  isEditingCompanyName: false,
  companyImageUrl: '',
  isEditingCompanyImage: false,
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
  newGrad: null,
  newGradResignee: null,
  averageYearsOfService: null,
  averageAge: null,
  training: null,
  selfDevSupport: null,
  mentor: null,
  careerSupport: null,
  testSystem: null,
  overtimeWork: null,
  paidHolidays: null,
  childcareLeave: null,
  femaleExecutives: null,
  isEditingEmploymentInfo: false,
  addMemberError: '',
  addMemberLoading: false,
  isLoading: false,
})

export const mutations = {
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
  setNewGrad(state, newGrad) {
    state.newGrad = newGrad
  },
  setNewGradResignee(state, newGradResignee) {
    state.newGradResignee = newGradResignee
  },
  setAverageYearsOfService(state, averageYearsOfService) {
    state.averageYearsOfService = averageYearsOfService
  },
  setAverageAge(state, averageAge) {
    state.averageAge = averageAge
  },
  setTraining(state, training) {
    state.training = training
  },
  setSelfDevSupport(state, selfDevSupport) {
    state.selfDevSupport = selfDevSupport
  },
  setMentor(state, mentor) {
    state.mentor = mentor
  },
  setCareerSupport(state, careerSupport) {
    state.careerSupport = careerSupport
  },
  setTestSystem(state, testSystem) {
    state.testSystem = testSystem
  },
  setOvertimeWork(state, overtimeWork) {
    state.overtimeWork = overtimeWork
  },
  setPaidHolidays(state, paidHolidays) {
    state.paidHolidays = paidHolidays
  },
  setChildcareLeave(state, childcareLeave) {
    state.childcareLeave = childcareLeave
  },
  setFemaleExecutives(state, femaleExecutives) {
    state.femaleExecutives = femaleExecutives
  },
  updateIsEditingEmploymentInfo(state, isEditing) {
    state.isEditingEmploymentInfo = isEditing
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

          // 雇用情報
          if (doc.data()['employmentInfo']) {
            commit('setNewGrad', doc.data()['employmentInfo'].newGrad)
            commit('setNewGradResignee', doc.data()['employmentInfo'].newGradResignee)
            commit('setAverageYearsOfService', doc.data()['employmentInfo'].averageYearsOfService)
            commit('setAverageAge', doc.data()['employmentInfo'].averageAge)
            commit('setTraining', doc.data()['employmentInfo'].training)
            commit('setSelfDevSupport', doc.data()['employmentInfo'].selfDevSupport)
            commit('setMentor', doc.data()['employmentInfo'].mentor)
            commit('setCareerSupport', doc.data()['employmentInfo'].careerSupport)
            commit('setTestSystem', doc.data()['employmentInfo'].testSystem)
            commit('setOvertimeWork', doc.data()['employmentInfo'].overtimeWork)
            commit('setPaidHolidays', doc.data()['employmentInfo'].paidHolidays)
            commit('setChildcareLeave', doc.data()['employmentInfo'].childcareLeave)
            commit('setFemaleExecutives', doc.data()['employmentInfo'].femaleExecutives)
          }

          commit('updateIsLoading', false)
        }
      })
      .catch(function(error) {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
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
            console.error("Error updating document: ", error)
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

        const companyInfoRef = firestore.collection('companies')
          .doc(companyId)
          .collection('info')
          .doc(companyId)
        batch.update(companyInfoRef, {
          companyImageUrl: downloadURL
        })

        batch.commit()
          .then(() => {
            commit('updateIsEditingCompanyImage', false)
            commit('setCompanyImageUrl', downloadURL)
          })
          .catch((error) => {
            console.error("Error", error)
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

    const companyInfoRef = firestore.collection('companies')
      .doc(companyId)
      .collection('info')
      .doc(companyId)
    batch.update(companyInfoRef, {
      companyName: companyName
    })

    batch.commit()
      .then(() => {
        commit('setCompanyName', companyName)
        commit('updateIsEditingCompanyName', false)
      })
      .catch((error) => {
        console.error("Error", error)
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
        console.error("Error updating document: ", error)
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
        console.error("Error updating document: ", error)
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
        console.error("Error updating document: ", error)
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
        console.error("Error updating document: ", error)
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
        console.error("Error updating document: ", error)
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
        console.error("Error updating document: ", error)
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
        console.error("Error updating document: ", error)
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
            timestamp: timestamp
          }
          if (url) {
            tempService.url = url
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
      // project 用のデータ
      let projectData = {
        imageUrl: imageUrl,
        title: title,
        content: content,
        url: url,
        createdAt: new Date()
      }

      if (selectedIndex != null) {
        let projectId = tempServices[selectedIndex].projectId
        // project 更新
        let projectRef = firestore.collection('projects').doc(projectId)
        batch.update(projectRef, projectData)

        // company services 更新
        tempServices[selectedIndex].title = title
        tempServices[selectedIndex].content = content
        if (url) {
          tempServices[selectedIndex].url = url
        } else {
          delete tempServices[selectedIndex].url
        }
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
    // project 削除
    firestore.collection('projects').doc(services[selectedIndex].projectId)
      .delete()
      .catch((error) => {
        console.error("Error removing document: ", error)
      })

    // company 更新
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
        console.error("Error updating document: ", error)
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
        console.error("Error updating document: ", error)
      })
  },
  updateIsEditingCompanyInfo({commit}, isEditing) {
    commit('updateIsEditingCompanyInfo', isEditing)
  },
  updateCompanyInfo({commit}, {companyId, location, foundedDate, url, employeesCount}) {
    if (foundedDate) {
      var foundedDateArr = foundedDate.split('-')
      foundedDate = new Date(foundedDateArr[0], foundedDateArr[1] - 1, foundedDateArr[2])
    }

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
        console.error("Error updating document: ", error)
      })
  },
  updateIsEditingEmploymentInfo({commit}, isEditing) {
    commit('updateIsEditingEmploymentInfo', isEditing)
  },
  updateEmploymentInfo({commit}, {companyId, employmentInfo}) {
    firestore.collection('companies').doc(companyId)
      .collection('detail')
      .doc(companyId)
      .update({
        employmentInfo: employmentInfo
      })
      .then(() => {
        commit('setNewGrad', employmentInfo.newGrad)
        commit('setNewGradResignee', employmentInfo.newGradResignee)
        commit('setAverageYearsOfService', employmentInfo.averageYearsOfService)
        commit('setAverageAge', employmentInfo.averageAge)
        commit('setTraining', employmentInfo.training)
        commit('setSelfDevSupport', employmentInfo.selfDevSupport)
        commit('setMentor', employmentInfo.mentor)
        commit('setCareerSupport', employmentInfo.careerSupport)
        commit('setTestSystem', employmentInfo.testSystem)
        commit('setOvertimeWork', employmentInfo.overtimeWork)
        commit('setPaidHolidays', employmentInfo.paidHolidays)
        commit('setChildcareLeave', employmentInfo.childcareLeave)
        commit('setFemaleExecutives', employmentInfo.femaleExecutives)
        commit('updateIsEditingEmploymentInfo', false)
      })
      .catch((error) => {
        console.error("Error updating document: ", error)
      })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setTopImageUrl', '')
    commit('updateIsEditingTopImage', false)
    commit('setCompanyId', '')
    commit('setCompanyName', '')
    commit('setCompanyImageUrl', '')
    commit('updateIsEditingCompanyImage', false)
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
    commit('setNewGrad', null)
    commit('setNewGradResignee', null)
    commit('setAverageYearsOfService', null)
    commit('setAverageAge', null)
    commit('setTraining', null)
    commit('setSelfDevSupport', null)
    commit('setMentor', null)
    commit('setCareerSupport', null)
    commit('setTestSystem', null)
    commit('setOvertimeWork', null)
    commit('setPaidHolidays', null)
    commit('setChildcareLeave', null)
    commit('setFemaleExecutives', null)
    commit('updateIsEditingEmploymentInfo', false)
    commit('setAddMemberError', '')
    commit('updateAddMemberLoading', false)
    commit('updateIsLoading', false)
  },
}
