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
:root {
  --oruga-table-color: blue;
  --oruga-table-background-color: #dbddd0;
  --oruga-color-primary: green;
  --oruga-color-danger: red;
  --oruga-table-row-active-background-color:green;
  --oruga-table-hoverable-background-color:red;
  --oruga-table-row-active-color:red;
  --oruga-button-height:18px;
}

.layoutScreen {
  position: fixed;
}
section {

  padding: 0 0%;
  display: table;
  margin: 0;


}
.content {
  margin-left: 2%;
  margin-top: 2px;
  background-color: #dbddd0;
  height:87vh;
  width:97vw;
  border-radius: 4px;
  border-width: 2px;
  border-style: solid;
  border-color: #0a3aff;
  padding-top: 8px;
  padding-left: 5px;
}
.navbar {
  margin-left: 2%;
  background-color: #ffcd90;
  height:7vh;
  width:97vw;
  border-radius: 4px;
  border-width: 2px;
  border-style: solid;
  border-color: #0a3aff;
  text-align: left;
  padding-top: 8px;
  padding-left: 5px;
}
#infoi {
  width: 100%;
  height: 100%;
  position: absolute;
}
#infoi {
  z-index: 10;
}

</style>
