export default function ({ store, route, redirect }) {
  if (route.path === '/') {
    store.dispatch('jobs/setToolbarExtension')
  } else {
    store.dispatch('jobs/resetToolbarExtension')
  }
}
