export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'

export const state = () => ({
  imageUrl: '',
  title: '',
  content: '',
  description: '',
  wage: '',
  requiredSkills: '',
  idealSkills: '',
  environment: '',
  workweek: null,
  period: null,
  workday: null,
  worktime: null,
  idealCandidate: '',
  occupation: '',
  features: '',
  industry: '',
  nearestStation: '',
  field: '',
  createdAt: '',
  timestamp: '',
  status: '',
  isLoading: false,
})

export const mutations = {
  setImageUrl(state, imageUrl) {
    state.imageUrl = imageUrl
  },
  setTitle(state, title) {
    state.title = title
  },
  setContent(state, content) {
    state.content = content
  },
  setDescription(state, description) {
    state.description = description
  },
  setWage(state, wage) {
    state.wage = wage
  },
  setRequiredSkills(state, requiredSkills) {
    state.requiredSkills = requiredSkills
  },
  setIdealSkills(state, idealSkills) {
    state.idealSkills = idealSkills
  },
  setEnvironment(state, environment) {
    state.environment = environment
  },
  setWorkweek(state, workweek) {
    state.workweek = workweek
  },
  setPeriod(state, period) {
    state.period = period
  },
  setWorkday(state, workday) {
    state.workday = workday
  },
  setWorktime(state, worktime) {
    state.worktime = worktime
  },
  setIdealCandidate(state, idealCandidate) {
    state.idealCandidate = idealCandidate
  },
  setOccupation(state, occupation) {
    state.occupation = occupation
  },
  setFeatures(state, features) {
    state.features = features
  },
  setIndustry(state, industry) {
    state.industry = industry
  },
  setNearestStation(state, nearestStation) {
    state.nearestStation = nearestStation
  },
  setCreatedAt(state, createdAt) {
    state.createdAt = createdAt
  },
  setTimestamp(state, timestamp) {
    state.timestamp = timestamp
  },
  setStatus(state, status) {
    state.status = status
  },
  updateIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

export const actions = {
  queryJob({commit}, params) {
    const jobId = params.id

    firestore.collection('jobs')
      .doc(jobId)
      .collection('detail')
      .doc(jobId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          commit('setImageUrl', doc.data()['imageUrl'])
          commit('setTitle', doc.data()['title'])
          commit('setContent', doc.data()['content'])
          commit('setDescription', doc.data()['description'])
          commit('setWage', doc.data()['wage'])
          commit('setRequiredSkills', doc.data()['requiredSkills'])
          commit('setIdealSkills', doc.data()['idealSkills'] ? doc.data()['idealSkills'] : '')
          commit('setEnvironment', doc.data()['environment'] ? doc.data()['environment'] : '')
          commit('setWorkweek', doc.data()['workweek'])
          commit('setPeriod', doc.data()['period'])
          commit('setWorkday', doc.data()['workday'])
          commit('setWorktime', doc.data()['worktime'])
          commit('setIdealCandidate', doc.data()['idealCandidate'] ? doc.data()['idealCandidate'] : '')
          commit('setOccupation', doc.data()['occupation'])
          commit('setFeatures', doc.data()['features'])
          commit('setIndustry', doc.data()['industry'])
          commit('setNearestStation', doc.data()['nearestStation'] ? doc.data()['nearestStation'] : '')
          commit('setStatus', doc.data()['status'])
          commit('setCreatedAt', doc.data()['createdAt'])
          commit('setTimestamp', doc.data()['timestamp'])
        }
        commit('updateIsLoading', false)
      })
      .catch((error) => {
        commit('updateIsLoading', false)
        console.log("Error getting document:", error)
      })
  },
  updateJob({commit, dispatch, state}, {
    params,
    router,
    companyId,
    imageFile,
    title,
    content,
    description,
    wage,
    requiredSkills,
    idealSkills,
    workweek,
    period,
    workday,
    worktime,
    idealCandidate,
    occupation,
    features,
    industry,
    nearestStation,
    environment,
    status
  }) {
    const jobId = params.id
    const updatedAt = new Date()
    let jobData = {
      title: title,
      content: content,
      wage: wage,
      workweek: workweek,
      period: period,
      workday: workday,
      worktime: worktime,
      occupation: occupation,
      features: features,
      industry: industry,
      nearestStation: nearestStation,
      environment: environment,
      status: status,
      createdAt: updatedAt
    }
    let jobDetailData = {
      title: title,
      content: content,
      description: description,
      wage: wage,
      requiredSkills: requiredSkills,
      idealSkills: idealSkills,
      workweek: workweek,
      period: period,
      workday: workday,
      worktime: worktime,
      idealCandidate: idealCandidate,
      occupation: occupation,
      features: features,
      industry: industry,
      nearestStation: nearestStation,
      environment: environment,
      status: status,
      createdAt: updatedAt
    }

    if (imageFile != null) {
      // storageから削除する前にresetしておく
      commit('setImageUrl', '')

      var timestamp
      timestamp = state.timestamp
      storageRef.child(`companies/${companyId}/jobs/${timestamp}.jpg`).delete()
      timestamp = Math.floor( updatedAt.getTime() / 1000 )

      // image アップロード
      const uploadTask = storageRef.child(`companies/${companyId}/jobs/${timestamp}.jpg`).put(imageFile)
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // dbにurl保存
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          jobData.imageUrl = downloadURL
          jobData.timestamp = updatedAt.getSeconds()
          jobDetailData.imageUrl = downloadURL
          jobDetailData.timestamp = updatedAt.getSeconds()

          const batch = firestore.batch()
          const jobRef = firestore.collection('jobs').doc(jobId)
          batch.update(jobRef, jobData)
          const jobDetailRef = firestore.collection('jobs').doc(jobId)
            .collection('detail').doc(jobId)
          batch.update(jobDetailRef, jobDetailData)
          batch.commit()
            .then(() => {
              router.push('/recruiter/jobs')
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })
        })
      })
    } else {
      const batch = firestore.batch()
      const jobRef = firestore.collection('jobs').doc(jobId)
      batch.update(jobRef, jobData)
      const jobDetailRef = firestore.collection('jobs').doc(jobId)
        .collection('detail').doc(jobId)
      batch.update(jobDetailRef, jobDetailData)
      batch.commit()
        .then(() => {
          router.push('/recruiter/jobs')
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    }
  },
  postJob({commit}, {
    router,
    companyId,
    imageFile,
    title,
    content,
    description,
    wage,
    requiredSkills,
    idealSkills,
    workweek,
    period,
    workday,
    worktime,
    idealCandidate,
    occupation,
    features,
    industry,
    nearestStation,
    environment,
    status
  }) {
    const createdAt = new Date()
    const timestamp = Math.floor( createdAt.getTime() / 1000 )
    // image アップロード
    const uploadTask = storageRef.child(`companies/${companyId}/jobs/${timestamp}.jpg`).put(imageFile)
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // dbにurl保存
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        const jobData = {
          companyId: companyId,
          imageUrl: downloadURL,
          title: title,
          content: content,
          wage: wage,
          workweek: workweek,
          period: period,
          workday: workday,
          worktime: worktime,
          occupation: occupation,
          features: features,
          industry: industry,
          nearestStation: nearestStation,
          createdAt: createdAt,
          timestamp: createdAt.getSeconds(),
          status: 'creating',
        }
        const jobDetailData = {
          companyId: companyId,
          imageUrl: downloadURL,
          title: title,
          content: content,
          description: description,
          wage: wage,
          requiredSkills: requiredSkills,
          idealSkills: idealSkills,
          workweek: workweek,
          period: period,
          workday: workday,
          worktime: worktime,
          idealCandidate: idealCandidate,
          occupation: occupation,
          features: features,
          industry: industry,
          nearestStation: nearestStation,
          environment: environment,
          createdAt: createdAt,
          timestamp: createdAt.getSeconds(),
          initialStatus: status,
          status: 'creating'
        }
        const batch = firestore.batch()
        const jobId = firestore.collection('jobs').doc().id
        const jobsRef = firestore.collection('jobs').doc(jobId)
        batch.set(jobsRef, jobData)
        const jobDetailRef = firestore.collection('jobs')
          .doc(jobId).collection('detail').doc(jobId)
        batch.set(jobDetailRef, jobDetailData)

        batch.commit()
          .then(() => {
            router.push('/recruiter/jobs')
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      })
    })
  },
  updateIsLoading({commit}, isLoading) {
    commit('updateIsLoading', isLoading)
  },
  resetState({commit}) {
    commit('setImageUrl', '')
    commit('setTitle', '')
    commit('setContent', '')
    commit('setDescription', '')
    commit('setWage', '')
    commit('setRequiredSkills', '')
    commit('setIdealSkills', '')
    commit('setEnvironment', null)
    commit('setWorkweek', null)
    commit('setPeriod', null)
    commit('setWorkday', null)
    commit('setWorktime', null)
    commit('setIdealCandidate', '')
    commit('setOccupation', '')
    commit('setFeatures', '')
    commit('setIndustry', '')
    commit('setNearestStation', '')
    commit('setStatus', '')
    commit('updateIsLoading', false)
  },
}
