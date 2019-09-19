export const strict = false
import { firestore, functions } from '@/plugins/firebase'
import { event } from 'vue-analytics'

export const actions = {
  // 企業を追加
  addCompany({commit}, {router, companyName, userName, email, position, plan}) {
    const companyId = firestore.collection('companies').doc().id
    var member = {
      name: userName,
      email: email,
      isFirstMember: true,
    }
    if (position) {
      member.position = position
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
      isDeleted: false,
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
      invoiceEmail: email,
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
  // 企業のメンバーが０人の場合にメンバーを追加する（一度解約した場合）
  addFirstMember({commit}, {companyId, name, email, position}) {
    let member = {
      name: name,
      email: email,
      isFirstMember: true,
    }
    if (position) {
      member.position = position
    }
    const batch = firestore.batch()
    const companyRef = firestore.collection('companies').doc(companyId)
    batch.update(companyRef, {
      isDeleted: false,
    })

    const companyDetailRef = firestore.collection('companies')
      .doc(companyId)
      .collection('detail')
      .doc(companyId)
    batch.update(companyDetailRef, {
      isDeleted: false,
      members: [member],
    })

    const companyInfoRef = firestore.collection('companies')
      .doc(companyId)
      .collection('info')
      .doc(companyId)
    batch.update(companyInfoRef, {
      isDeleted: false,
      members: [member],
    })

    batch.commit()
      .then(() => {
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
