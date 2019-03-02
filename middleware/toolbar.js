export default function ({ store, route, redirect }) {
  if (route.path === '/') {
    store.dispatch('main/setToolbarExtension')
  } else {
    store.dispatch('main/resetToolbarExtension')
  }
}
