import Vue from 'vue'
import VueRouter from 'vue-router'
//import Bar from '../components/Bar.vue'
//import gridLayout from "../components/gridLayout";
//import Dtable from "../components/dtable.vue";
import displayLayout from "../components/displayLayout.vue"
import editLayout from "../components/editLayout.vue";
import errorPage from "../components/errorPage.vue"
import MySpaces from "@/components/MySpaces";
import directLogin from "../components/directLogin.vue"


Vue.use(VueRouter)

const routes = [

  {
    path: '/MySpaces',
    name: 'MySpaces',
    component: MySpaces
  },
  {
    path: '/displayLayout/edit/:layoutId',
    name: 'edit',
    component: editLayout

  },
  {
    path: '/displayLayout/:layoutId',
    name: 'displayLayout',
    component: displayLayout
  },
  {
    path: '/directLogin/:layoutId',
    name: 'directLogin',
    component: directLogin
  },
/*
  {
    path: '/displayLayout',
    name: 'newLayout',
    component: displayLayout
  },
 */
  {
    path:'/logError/:errorMessage',
    name:'errorPage',
    component: errorPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
console.log('router loaded');
export default router
