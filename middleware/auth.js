export default function ({ store, route, redirect }) {
  // ユーザーが認証されていないとき
  if (store.state.uid == null) {
    if (route.path !== '/' &&
      route.name !== 'inquiry_for_recruiter' &&
      route.name !== 'how_to_use' &&
      route.name !== 'privacy_policy' &&
      route.name !== 'terms' &&
      route.name !== 'contact' &&
      route.name !== 'feedback' &&
      route.name !== 'jobs-id' &&
      route.name !== 'companies-id' &&
      route.name !== 'companies-id-jobs' &&
      route.name != null
    ) {
      return redirect('/')
    }
  }
}
