<template>

        <span class="layoutScreen">
          <section class="navbar">
              <header-bar :message="message" :cmd="thisCmd" @register="register" @tabSelected="tabSelected" @login="login" @logError="logError" @viewStatusChangeFunction="viewStatusChange"></header-bar>
          </section>
          <section class="content">
              <router-view @layoutMessage="showLayoutMessage"
                           @tabSelected="tabSelected"
                           @configSelected="viewStatusChange"
                           @layoutSelected="layoutSelected"
                           @layoutChanged="layoutChanged"
                           @linkSelected="layoutSelected"
                           @viewStatusChangeFunction="viewStatusChange"
                           @cardSaved="cardSaved"
                           :key="$route.fullPath"
                           :cmd="thisCmd"></router-view>
          </section>

        </span>


</template>

<script>
  import Vue from 'vue';
  import Oruga from '@oruga-ui/oruga';
  import '@oruga-ui/oruga/dist/oruga.css';
  import '@oruga-ui/oruga/dist/oruga-vars.css'
  import '@mdi/font/css/materialdesignicons.css'
  import headerBar from "./components/headerBar.vue";
  import store from './store';

  Vue.use(Oruga);


  //    import CContainer from "../components/containerExample.vue";
  //    import menuComponent from "../components/menu.vue";
  //    import configComponent from "../components/configComponent";
  //    import Dtable from "../components/dtable.vue"
  //    import gridLayout from "./gridLayout";
  export default {
    name: 'App',
    store,
    created(){
      var pathArray=this.$route.path.substring(1).split('/');
      console.log('pathArray is:', pathArray);
//    debugger;
      if(pathArray[0].length>0){
        store.commit('setDefaultOrg', pathArray[0]);
      }else{
        store.commit('setDefaultOrg', 'root');
      }

    },
    components: {headerBar},
    data(){
      return {
        openDialog: false,
        message: '',
        headerBarViewStatusChangeFunction:null,
        editViewStatusChangeFunction:null,
        displayViewStatusChangeFunction:null,
        thisCmd:''
      }
    },
    methods: {
      cardSaved(msg){
        console.log('App - card saved', msg);
        this.thisCmd="cardSaved";
        this.$router.push({
          name: 'displayLayout',
          params: { layoutId: this.$store.getters.getCurrentLayoutId }
        })

      },
      register(){
        debugger;
        this.thisCmd='register';
        console.log('register event reached app');
/*
        this.$eventHub.$emit('editStatusChanged', ['cancelEdit',0]);
        this.$router.push({
          name: 'displayLayout',
          params: { layoutId: this.$store.getters.getCurrentLayoutId }
        })

 */
      },
      tabSelected(msg){
 //               debugger;
        switch(msg){
          case 'Edit':{
//            this.$eventHub.$emit('editStatusChanged', ['openEdit',0]);
            this.$router.push({
              name: 'edit',
              params: { layoutId: this.$store.getters.getCurrentLayoutId }
            })


//            this.openDialog=false;
//            this.$router.push('edit');
            break;
          }
          case 'Access':{
//            this.displayViewStatusChangeFunction(['access',0]);
            this.thisCmd='access';
            break;
          }
          case 'Create':{
//            debugger;
//            this.displayViewStatusChangeFunction(['newLayout',0]);
//            this.$eventHub.$emit('editStatusChanged', ['newLayout',0]);
            this.thisCmd='createNewLayout';
            break;
          }
          case 'Organizations':{
            this.thisCmd='organizations';
//            this.displayViewStatusChangeFunction(['organizations',0]);
            break;
          }
          case 'New Card':{
            this.headerBarViewStatusChangeFunction(['New Card', 0]);
            this.editViewStatusChangeFunction(['New Card', 0]);
            this.displayViewStatusChangeFunction();
            this.$eventHub.$emit('editStatusChanged', ['newCard',0]);
            break;
          }
          case 'Cancel Edit':{
//            debugger;
//            this.$eventHub.$emit('editStatusChanged', ['cancelEdit',0]);
            this.$router.push({
              name: 'displayLayout',
              params: { layoutId: this.$store.getters.getCurrentLayoutId }
            })
            break;
          }
          case 'cancel':{
//            debugger;
            this.headerBarViewStatusChangeFunction(['Cancel New Card', 0]);
            this.$eventHub.$emit('editStatusChanged', ['openEdit',0]);
            this.thisCmd='cancelDialog';
            break;
          }
          case 'My Spaces':{
            this.$router.push({
              name: 'MySpaces',
              params: {}
            })
            break;
          }
        }
      },
      viewStatusChange(msg){
        debugger;
        switch(msg[0]){
          case 'headerBar':{
            this.headerBarViewStatusChangeFunction=msg[1];
            break;
          }
          case 'editLayout':{
            this.editViewStatusChangeFunction=msg[1];
            break;
          }
          case 'displayLayout':{
            this.displayViewStatusChangeFunction=msg[1];
            break;
          }
          case 'layoutSaved':{
//            debugger;
            store.commit('setCurrentLayoutId', msg[1]);

            console.log('app recieved layoutSaved', msg);
            this.$eventHub.$emit('editStatusChanged', ['openEdit',0]);
            this.$router.push({
              name: 'edit',
              params: { layoutId: this.$store.getters.getCurrentLayoutId }
            })


            break;
          }
          case 'save':{
            this.thisCmd='save';
            break;
          }
          case 'Save Registration':{
            this.thisCmd = 'newUserOnlyRegistration';
            break;
          }
          case 'Save OrgRegistration':{
            this.thisCmd = 'saveRegistration';
            break;
          }
          case 'cancel':{
            debugger;
            this.thisCmd='';
            break;
          }
          case 'clearCmd':{
            console.log(this.thisCmd, ' has been cleared');
            this.thisCmd='';
            break;
          }
        }
      },
      layoutChanged(msg){
        this.thisCmd='layoutChanged';
        console.log('layoutChanged - ', msg);
      },
      showLayoutMessage(msg){
        console.log(msg);
        this.message=msg[1];
      },
      login(msg){
        console.log('login event recieved at App',msg[0]);
        this.$router.push({
          name: 'displayLayout',
          params: { layoutId: msg[0] }
        });
//                debugger;
      },
      logError(msg){
        console.log(msg);
        this.$router.push({
          name: 'errorPage',
          params: { errorMessage: msg }
        });

      },
      layoutSelected(msg){
        console.log('layoutSelected',msg);
        this.$router.push({
          name: 'displayLayout',
          params: {layoutId: msg}
        })
      },
      testEmit(msg){
        console.log('router view caught:', msg);
      }
    }
  }
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
