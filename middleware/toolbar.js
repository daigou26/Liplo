export default function ({ store, route, redirect }) {
  if (route.path === '/') {
    store.dispatch('jobs/setToolbarExtension')
  } else {
    store.dispatch('jobs/resetToolbarExtension')
  }

  if (route.path === '/users') {
    store.dispatch('users/setToolbarExtension')
  } else {
    store.dispatch('users/resetToolbarExtension')
  }
}
