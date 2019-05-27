export const strict = false
import { firestore, functions } from '@/plugins/firebase'

export const actions = {
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
