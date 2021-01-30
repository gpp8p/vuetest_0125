import Vue from 'vue'
import VueRouter from 'vue-router'
import testRequest from '../views/testRequest';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'testRequest',
    component: testRequest
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
