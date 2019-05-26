export default function ({ store, route, redirect }) {
  // ユーザーが認証されていないとき
  if (store.state.uid == null) {
    if (route.path !== '/' &&
      route.path !== '/signup' &&
      route.path !== '/company_registration' &&
      route.path !== '/contact' &&
      route.path !== '/feedback' &&
      route.name !== 'jobs-id' &&
      route.name !== 'companies-id'
    ) {
      return redirect('/')
    }
  }
}
