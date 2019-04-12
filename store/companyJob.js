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
  environment: null,
  workweek: null,
  period: null,
  workday: null,
  idealCandidate: '',
  occupation: '',
  features: '',
  field: '',
  createdAt: '',
  updatedAt: '',
  status: '',
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
  setIdealCandidate(state, idealCandidate) {
    state.idealCandidate = idealCandidate
  },
  setOccupation(state, occupation) {
    state.occupation = occupation
  },
  setFeatures(state, features) {
    state.features = features
  },
  setCreatedAt(state, createdAt) {
    state.createdAt = createdAt
  },
  setUpdatedAt(state, updatedAt) {
    state.updatedAt = updatedAt
  },
  setStatus(state, status) {
    state.status = status
  },
}

export const actions = {
  queryJob({commit}, params) {
    const jobId = params.id

    firestore.collection('jobs')
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
          commit('setIdealSkills', doc.data()['idealSkills'])
          commit('setEnvironment', doc.data()['environment'])
          commit('setWorkweek', doc.data()['workweek'])
          commit('setPeriod', doc.data()['period'])
          commit('setWorkday', doc.data()['workday'])
          commit('setIdealCandidate', doc.data()['idealCandidate'])
          commit('setOccupation', doc.data()['occupation'])
          commit('setFeatures', doc.data()['features'])
          commit('setStatus', doc.data()['status'])
          commit('setCreatedAt', doc.data()['createdAt'])
          commit('setUpdatedAt', doc.data()['updatedAt'])
        }
      })
      .catch((error) => {
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
    idealCandidate,
    occupation,
    features,
    environment,
    status
  }) {
    const jobId = params.id
    const updatedAt = new Date()
    const jobData = {
      title: title,
      content: content,
      description: description,
      wage: wage,
      requiredSkills: requiredSkills,
      idealSkills: idealSkills,
      workweek: workweek,
      period: period,
      workday: workday,
      idealCandidate: idealCandidate,
      occupation: occupation,
      features: features,
      environment: environment,
      status: status,
      updatedAt: updatedAt
    }

    if (imageFile != null) {
      // storageから削除する前にresetしておく
      commit('setImageUrl', '')

      var timestamp
      if (state.updatedAt != null) {
        timestamp = state.updatedAt.seconds
      } else {
        timestamp = state.createdAt.seconds
      }
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
          const batch = firestore.batch()
          const jobRef = firestore.collection('jobs').doc(jobId)
          batch.update(jobRef, jobData)
          const jobDetailRef = firestore.collection('jobs').doc(jobId)
            .collection('detail').doc(jobId)
          batch.update(jobDetailRef, jobData)
          batch.commit()
            .then(() => {
              dispatch('resetState')
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
      batch.update(jobDetailRef, jobData)
      batch.commit()
        .then(() => {
          dispatch('resetState')
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
    idealCandidate,
    occupation,
    features,
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
          occupation: occupation,
          features: features,
          createdAt: createdAt,
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
          idealCandidate: idealCandidate,
          occupation: occupation,
          features: features,
          environment: environment,
          createdAt: createdAt,
          initialStatus: status
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
    commit('setIdealCandidate', '')
    commit('setOccupation', '')
    commit('setFeatures', '')
    commit('setStatus', '')
  },
}
