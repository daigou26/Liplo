export const strict = false
import { firestore, storageRef } from '@/plugins/firebase'

export const state = () => ({
  imageUrl: '',
  firstName: '',
  lastName: '',
  selfIntro: '',
  whatWantToDo: '',
  portfolio: null,
  skills: null,
  links: null,
  email: '',
  university: '',
  faculty: '',
  department: '',
  birthTimestamp: '',
  desiredOccupations: null,
  interestingFields: null,
})

export const mutations = {
  setImageUrl(state, imageUrl) {
    state.imageUrl = imageUrl
  },
  setFirstName(state, firstName) {
    state.firstName = firstName
  },
  setLastName(state, lastName) {
    state.lastName = lastName
  },
  setSelfIntro(state, selfIntro) {
    state.selfIntro = selfIntro
  },
  setWhatWantToDo(state, whatWantToDo) {
    state.whatWantToDo = whatWantToDo
  },
  setPortfolio(state, portfolio) {
    state.portfolio = portfolio
  },
  setSkills(state, skills) {
    state.skills = skills
  },
  setLinks(state, links) {
    state.links = links
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
  setDesiredOccupatins(state, occupations) {
    state.desiredOccupations = occupations
  },
  setInterstingFields(state, fields) {
    state.interestingFields = fields
  },
}

export const actions = {
  queryUser({commit, state}, uid) {
    firestore.collection('users')
      .doc(uid)
      .collection('profile')
      .doc(uid)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          commit('setImageUrl', doc.data()['imageUrl'])
          commit('setFirstName', doc.data()['firstName'])
          commit('setLastName', doc.data()['lastName'])
          commit('setSelfIntro', doc.data()['selfIntro'])
          commit('setWhatWantToDo', doc.data()['whatWantToDo'])
          commit('setPortfolio', doc.data()['portfolio'])
          commit('setSkills', doc.data()['skills'])
          commit('setLinks', doc.data()['links'])
          commit('setEmail', doc.data()['email'])
          commit('setUniversity', doc.data()['university'])
          commit('setFaculty', doc.data()['faculty'])
          commit('setDepartment', doc.data()['department'])
          commit('setBirthTimestamp', doc.data()['birthTimestamp'])
          commit('setDesiredOccupatins', doc.data()['desiredOccupations'])
          commit('setInterstingFields', doc.data()['interestingFields'])
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error)
      })
  },
  resetState({commit}) {
    commit('setImageUrl', '')
    commit('setFirstName', '')
    commit('setLastName', '')
    commit('setSelfIntro', '')
    commit('setWhatWantToDo', '')
    commit('setPortfolio', null)
    commit('setSkills', null)
    commit('setLinks', null)
    commit('setEmail', '')
    commit('setUniversity', '')
    commit('setFaculty', '')
    commit('setDepartment', '')
    commit('setBirthTimestamp', '')
    commit('setDesiredOccupatins', null)
    commit('setInterstingFields', null)
  },
}
