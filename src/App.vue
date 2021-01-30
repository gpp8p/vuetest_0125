<template>
  <div id="app">
          <span class="layoutScreen">
          <section class="navbar">
              <header-bar :message="message" :cmd="thisCmd" @register="register" @tabSelected="tabSelected" @login="login" @logError="logError" @viewStatusChangeFunction="viewStatusChange"></header-bar>
          </section>
          <section class="content">
            <h2>Content Section will go here!</h2>
          </section>

        </span>


  </div>
</template>
<script>
import Vue from 'vue';
import Oruga from '@oruga-ui/oruga';
import '@oruga-ui/oruga/dist/oruga.css';
import '@oruga-ui/oruga/dist/oruga-vars.css'
//import '@mdi/font/css/materialdesignicons.css'
import headerBar from "./components/headerBar.vue";
import store from './store';

export default {
  name: 'App',
  store,
  components: {headerBar}

}


Vue.use(Oruga);


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
