import Vue from 'vue'
import App from './App.vue'
import ParentPage from './pages/ParentPage.vue'
import SeedsPage from './pages/SeedsPage.vue'
import Router from 'vue-router'
import store from './store/store';


Vue.use(Router)

const routes = [
  { name: 'Parent', path: '/', component: ParentPage },
  { name: 'Seeds', path: '/seeds', component: SeedsPage }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name
  next()
})

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
