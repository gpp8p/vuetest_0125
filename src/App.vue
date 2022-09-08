<template>

        <span class="layoutScreen">
          <section class="navbar">
              <header-bar :message="message" :cmd="this.thisCmd" @register="register" @tabSelected="tabSelected" @login="login" @logError="logError" @viewStatusChangeFunction="viewStatusChange"></header-bar>
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
                           @login="login"
                           @clearCmd="clearCmd"
                           @deletedLayoutsShowing="deletedLayoutsShowing"
                           @undeleteSelected="undeleteSelected"
                           @gotoNewPage="gotoNewPage"
                           :key="componentKey"
                           :showingDeleted="showingDeleted"
                           :cmd="this.thisCmd"></router-view>
          </section>

        </span>


</template>

<script>
import Vue from 'vue';
import Oruga from '@oruga-ui/oruga';
import '@oruga-ui/oruga/dist/oruga.css';
import '@oruga-ui/oruga/dist/oruga-vars.css'
//  import '@mdi/font/css/materialdesignicons.css'
import headerBar from "./components/headerBar.vue";
import store from './store';
import axios from "axios";

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
    console.log('entry path is - ', this.$route.path);
    console.log('fullPath is - ', this.$route.fullPath);
    console.log('current href is -', window.location.href);
//    store.commit('setUrlBase', 'http://localhost:8080/');
//    store.commit('setApiBase', 'http://localhost:8000/');

    var thisHref = window.location.href;
    if(thisHref.includes('localhost')){
      store.commit('setUrlBase', 'http://localhost:8080/');
      store.commit('setApiBase', 'http://localhost:8000/');
    }else{
      store.commit('setUrlBase', 'http://sptests.org:8080/');
      store.commit('setApiBase', 'http://sptests.org:8000/');
    }

    var pathArray=this.$route.path.substring(1).split('/');
    if(pathArray.length==3 && pathArray[0]=='target'){
      console.log('this is a protected page link from static html');
      console.log(pathArray);
      store.commit('setDefaultOrg', pathArray[1]);
      store.commit("setOrgId", pathArray[1]);
      store.commit('setDirectLoginLink', pathArray[2]);
      this.thisCmd='directLogin';
      this.$router.push({
        name: 'directLogin',
        params: { layoutId: this.$store.getters.getCurrentLayoutId }
      })

    }else{
      console.log('this is a normal login');
      console.log('current layoutId',this.$store.getters.getCurrentLayoutId);
      if(pathArray[0].length>0){
        if(pathArray[0]=="dist"){
          pathArray=[""];
          store.commit('setDefaultOrg', 'root');
        }else{
          store.commit('setDefaultOrg', pathArray[0]);
        }
      }else{
        store.commit('setDefaultOrg', 'root');
      }
    }
    console.log('pathArray is:', pathArray);
//    debugger;


  },
  components: {headerBar},
  data(){
    return {
      openDialog: false,
      message: '',
      headerBarViewStatusChangeFunction:null,
      editViewStatusChangeFunction:null,
      displayViewStatusChangeFunction:null,
      thisCmd:'',
      componentKey:0,
      showingDeleted:false
    }
  },
  methods: {
    cardSaved(msg){
      console.log('App - card saved', msg);
      /*
              this.$router.push({
                name: 'edit',
                params: { layoutId: this.$store.getters.getCurrentLayoutId, layoutCmd: this.thisCmd }
              })
      */
        debugger;
      this.thisCmd = "cardSaved";
      this.componentKey+=1;
    },
    gotoNewPage(msg){
      debugger;
      console.log('gotoNewPage reached-', msg);
      this.tabSelected('Edit');
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
    deletedLayoutsShowing(){
      this.thisCmd='selectLayoutToUnDelete';
    },
    undeleteSelected(){
      this.message='';
      this.showingDeleted=false;
      this.thisCmd='mySpaces';
//      debugger;
      this.getOrgHome();
      console.log('undeleteSelected - ', this.thisCmd);
    },
    tabSelected(msg){
                     debugger;
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
        case 'Sites':{
          this.thisCmd='organizations';
//            this.displayViewStatusChangeFunction(['organizations',0]);
          break;
        }
        case 'Create A New Card':{
          debugger;
          this.thisCmd = 'newCardSetup';
//           this.headerBarViewStatusChangeFunction(['New Card', 0]);
//            this.editViewStatusChangeFunction(['New Card', 0]);
//            this.displayViewStatusChangeFunction();
//            this.$eventHub.$emit('editStatusChanged', ['newCard',0]);
//            this.thisCmd='';
          break;
        }
        case 'Exit':{
//            debugger;
//            this.$eventHub.$emit('editStatusChanged', ['cancelEdit',0]);
          this.showingDeleted = false;
          this.message='';
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
        case 'Publish':{
          var apiPath = this.$store.getters.getApiBase;
          axios.get(apiPath+'api/shan/publishOrg?XDEBUG_SESSION_START=15122"', {
            params:{
              orgId:this.$store.getters.getOrgId,
            }
          }).then(response=> {
            console.log('Publish',response);
            alert('site has been published');
          }).catch(e=>{
            console.log(e);
          });

          break;
        }
        case 'My Spaces':{
          this.thisCmd='mySpaces';
          this.$router.push({
            name: 'MySpaces',
            params: {}
          })
          break;
        }
        case 'Show Deleted':{
          console.log('Show Deleted selected');
          this.showingDeleted = true;
          this.message = 'Please Click on the Space You Wish to Undelete';
          this.$router.push({
            name: 'MySpaces',
            params: {}
          })
          break;
        }
        case 'Delete':{
          this.thisCmd='deleteLayout';
          break;
        }
        case 'Insert Existing Card':{
          this.thisCmd='insertCard';
          break;
        }
        case 'Change Page Setup':{
          this.thisCmd='changeLayoutSetup';
          break;
        }
        case 'Test':{
          debugger;
          apiPath = this.$store.getters.getApiBase;
          axios.get(apiPath+'api/shan/layoutTest?XDEBUG_SESSION_START=14668', {

          })
              .then(response => {
                console.log(response);
              })
              .catch(e => {
                console.log(e,'test failed');
              });

          break;
        }
      }
    },
    viewStatusChange(msg){
//        debugger;
      switch(msg[0]){
        case 'headerBar':{
          this.headerBarViewStatusChangeFunction=msg[1];
          break;
        }
        case 'editLayout':{
          this.editViewStatusChangeFunction=msg[1];
          this.thisCmd='editLayout';
          break;
        }
        case 'displayLayout':{
          this.thisCmd='linkToNewLayout';
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
        case 'display':{
          this.$router.push({
            name: 'displayLayout',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
        }
      }
    },
    layoutChanged(msg){
      this.thisCmd='layoutChanged'+':'+msg;
      console.log('App-layoutChanged - ', msg);
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

      store.commit('setCurrentLayoutId', msg);
      this.$router.push({
        name: 'displayLayout',
        params: {layoutId: msg}
      })
      this.$router.go();



    },
    getOrgHome(){
      var apiPath = this.$store.getters.getApiBase;
      axios.get(apiPath+'api/shan/getOrgHome?XDEBUG_SESSION_START=14668', {
//              axios.get('http://localhost:8000/api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
        params:{
          orgId:this.$store.getters.getOrgId
        }
      })
          .then(response => {
            console.log('getOrgHome-',response);

            store.commit('setOrgHome', response.data);
            store.commit('setCurrentLayoutId', response.data);
          })
          .catch(e => {
            this.errors.push(e);
            console.log('getOrgHome failed');
          });
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

  --ck-height: 350px;
  --ck-width:
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
