import Vue from 'vue'
import VueRouter from 'vue-router'
//import Bar from '../components/Bar.vue'
//import gridLayout from "../components/gridLayout";
//import Dtable from "../components/dtable.vue";
import displayLayout from "../components/displayLayout.vue"
import editLayout from "../components/editLayout.vue";
import errorPage from "../components/errorPage.vue"
import MySpaces from "@/components/MySpaces";

Vue.use(VueRouter)

  const routes = [


    {
      path: '/test',
      name: 'test',
      component: errorPage

    },
    {
      path: '/displayLayout/test',
      name: 'test',
      component: errorPage

    },
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
       path: '/table',
      name: 'table',
      component: errorPage
    },
    {
      path: '/displayLayout/:layoutId',
      name: 'displayLayout',
      component: displayLayout
    },
    {
      path:'/logError/:errorMessage',
      name:'errorPage',
      component: errorPage
    },
    {
      path: '/Bar',
      name: 'bar',
      component: errorPage
    },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
