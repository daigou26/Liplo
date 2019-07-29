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
    const batch = firestore.batch()
    const companyRef = firestore.collection('companies').doc(companyId)
    batch.set(companyRef, {
      companyName: companyName,
      isDeleted: false,
      points: 100,
      createdAt: new Date(),
    })

    const companyDetailRef = firestore.collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
    batch.set(companyDetailRef, {
      companyName: companyName,
      members: [member],
      points: 100,
      feedback: {
        all: 0,
        writtenCount: 0
      },
    })

    const companyInfoRef = firestore.collection('companies')
      .doc(companyId)
      .collection('info')
      .doc(companyId)
    batch.set(companyInfoRef, {
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
      }
    })

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
      .collection('info')
      .doc(companyId)
      .update({
        plan: plan
      })
      .then(() => {
        dispatch('companyInfo/updatePlan', plan, { root: true })
      })
      .catch((error) => {
        console.log("Error updating document:", error)
      })
  },
}
