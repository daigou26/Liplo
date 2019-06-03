export const strict = false
import { firestore, functions } from '@/plugins/firebase'
import { event } from 'vue-analytics'

export const actions = {
  // 企業を追加
  addCompany({commit}, {router, companyName, companyEmail, userName, email, position, plan}) {
    const companyId = firestore.collection('companies').doc().id
    const member = {
      name: userName,
      position: position,
      email: email,
      isInitialMember: true,
    }
    const companyData = {
      plan: plan,
      companyName: companyName,
      email: companyEmail,
      invoiceEmail: companyEmail,
      members: [member],
      isDeleted: false,
      hiringPassCount: 0,
      points: 100,
      feedback: {
        all: 0,
        writtenCount: 0
      },
      createdAt: new Date(),
    }
    const batch = firestore.batch()
    const companyRef = firestore.collection('companies').doc(companyId)
    batch.set(companyRef, companyData)

    const companyDetailRef = firestore.collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
    batch.set(companyDetailRef, companyData)

    batch.commit()
      .then(() => {
        router.push('/admin/companies')
        // analytics
        event('company', 'signup')
      })
      .catch((error) => {
        console.error("Error", error)
      })
  },
  // 企業のプランを変更する
  updatePlan({commit, dispatch}, {companyId, plan}) {
    firestore.collection('companies')
      .doc(companyId)
      .update({
        plan: plan
      })
      .then(() => {
        dispatch('company/updatePlan', plan, { root: true })
      })
      .catch((error) => {
        console.log("Error updating document:", error)
      })
  },
}
