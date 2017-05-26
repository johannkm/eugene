import Vue from 'vue'
import App from './App.vue'
import MainPage from './pages/MainPage.vue'
import SeedsPage from './pages/SeedsPage.vue'
import Router from 'vue-router'
import store from './store/store';


Vue.use(Router)

const routes = [
  { name: 'main', path: '/', component: MainPage },
  { name: 'seeds', path: '/seeds', component: SeedsPage }
]

const router = new Router({
  routes
})

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
