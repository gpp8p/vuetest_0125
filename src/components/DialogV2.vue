<template>
    <div class="dialogComponent" ref="drg"  draggable="true"  @dragstart="handleDragStart"   @dragend="handleDragEnd" >
      <div class="dialogComponentHeader" v-if="dialogContext==this.DIALOG_TITLE">
        <span class="headingText">{{this.titleMsg}}</span>
      </div>
      <div class="dialogComponentHeader" v-if="dialogContext==this.DIALOG_RUSURE">
            <span class="sure">
              <are-you-sure :msg="sureMsg" @rusureClick="rusure"></are-you-sure>
            </span>
      </div>
        <br/>

      <div class="dialogComponentBody">

        <card-configuration-settings
            v-if = "dialogType==this.DIALOG_CONFIGURE_CARD"
            @componentSettingsMounted="componentSettingsMounted"
            @configSelected="configSelected"
            :selectedMenuOption="currentSelectedMenuOption"
            :selectedCardConfigurationValues="selectedCardConfigurationValues"
            :currentValues=currentValues
            :subElementValues=subElementValues
            :dialogKey="dialogKey"
            :cmd="cmd"
        ></card-configuration-settings>
        <new-card-create
            v-if = "dialogType==this.DIALOG_CREATE_CARD"
            ref="newCardDialog"
            :currentValues=currentValues
            :dialogKey="dialogKey"
            :selectedMenuOption="currentSelectedMenuOption"
            @componentSettingsMounted="componentSettingsMounted"
            @configSelected="configSelected"
            @cardSaved="cardSaved"
            :cmd="cmd"
        ></new-card-create>
        <new-layout
            ref="newl"
            v-if = "dialogType==this.DIALOG_NEW_LAYOUT"
            @componentSettingsMounted="componentSettingsMounted"
            @layoutData="layoutData"
            @error="showError"
            :cmd="cmd"
        ></new-layout>
        <PermList v-if="dialogType==this.DIALOG_PERMS"
                  @setMenu = "setMenu"
                  @setTitle="setTitle"
                  :selectedMenuOption="currentSelectedMenuOption"
                  :cmd="cmd"
        ></PermList>
        <register-user v-if="dialogType==this.DIALOG_REGISTER" :cmd="cmd" @registrationSaved="registrationSaved" @setTitle="setTitle" @componentSettingsMounted="componentSettingsMounted" @userExists="userExists"></register-user>
        <user-exists v-if="dialogType==this.DIALOG_USER_EXISTS" ></user-exists>
        <organizations :cmd="cmd" v-if="dialogType==this.DIALOG_ORGANIZATIONS" :selectedMenuOption="currentSelectedMenuOption" @setTitle="setTitle" @setMenu = "setMenu" @componentSettingsMounted="componentSettingsMounted" @orgSelected="orgSelected" @clearCmd="clearCmd"></organizations>
        <layout-list v-if="dialogType==this.DIALOG_LAYOUT_LIST" :cmd="cmd" @spaceSelected="spaceSelected"></layout-list>
      </div>
      <div class="dialogComponentFooter">
          <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
      </div>
    </div>

</template>

<script>
//    import greenComponentSettings from "../components/greenComponentSettings.vue";
    import menuOpt from "../components/menuOptV2.vue";
    import newCardCreate from "../components/newCardCreate.vue";
//    import newLayout from "../components/newLayout.vue";
    import newLayout from "../components/createLayout.vue";
    import AreYouSure from "../components/AreYouSure.vue";
    import PermList from "../components/PermList.vue";
    import organizations from "../components/organizations.vue";
    import userExists from "../components/userExists.vue";
    import cardConfigurationSettings from "../components/cardConfigurationSettings.vue";
    import layoutList from "../components/layoutList.vue";


 //   import store from "@/store";
    import RegisterUser from "@/components/registerUser";
    export default {
        name: "Dialog",
        components :{RegisterUser, menuOpt, newCardCreate, newLayout, AreYouSure, PermList, organizations, userExists, cardConfigurationSettings, layoutList},
        props:{
            dialogType:{
                type: Number,
                required: true
            },
            currentValues:{
              type: Object,
              required:true
            },
          subElementValues:{
              type: Object,
              required: false
          },
          dialogKey:{
            type: Number,
            required:true
          },
          cmd:{
            type: String,
            required: true
          },
          selectedCardConfigurationValues:{
              type: Object,
              required: true
          }
        },
        mounted(){
//          debugger;
          console.log('Dialog2 mounted');
          var mOpts = this.getMenuOpts(this.cmd);
          switch(this.cmd){
            case 'createNewLayout':{
              this.setTitle('Set Up New Space');
              break;
            }
          }
          console.log('mOpts -', mOpts);
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
        },
        watch:{
          dialogType: function(){
            console.log('dialogType changed -',this.dialogType);

//            debugger;

            }

          },
          cmd: function(){
            debugger;
            console.log('Dialog cmd changed:',this.cmd);
/*
            var cmdElements = this.cmd.split(':');
            switch(cmdElements[0]){
              case 'setMenu':{
                var mOpts = this.getMenuOpts(cmdElements[1]);
                console.log('mOpts -', mOpts);
                this.currentMenuOpts = mOpts.currentMenuOpts;
                this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                this.clearCmd();
                break;
              }
            }
 */

        },
        methods: {
            showError(msg){
              debugger;
              this.setTitle(msg);
            },
            cardSaved(msg){
              this.$emit('cardSaved', msg);
            },
            cancelClicked(){
                this.$emit('configSelected',['cancel']);
            },
            registrationSaved(){
              this.$emit('configSelected',['cancel']);
            },
            saveClicked(){
                //        debugger;
                this.$emit('configSelected', ['save']);
            },
            configSelected(msg){
                this.dialogDataChanged = true;
                this.$emit('configSelected', msg);
            },
            handleDragStart(evt){
//                debugger;
                this.$emit('dragStart',[evt.screenX, evt.screenY])
            },
            spaceSelected(msg){
              this.$emit('configSelected', ['layoutSelected',msg])
            },
            layoutData(msg){
 //             debugger;
              console.log('layoutData',msg);
              this.clearCmd();
              this.$emit('configSelected',['layoutSaved', msg[0]]);
            },
            menuOptSelected(msg){
              console.log('menuOptSelected in Dialog2-',msg);
              this.cmd='';
 //             debugger;
              switch(msg){
                case 'Cancel':{
                  if(this.dialogDataChanged){
                    this.freezeEvent('configSelected',['cancel']);
                    this.sureMsg = 'Unsaved changes - are you sure you want to cancel ?';
                    this.dialogContext=this.DIALOG_RUSURE
                  }else{
                    this.currentSelectedMenuOption = msg;
                    this.$emit('configSelected',['cancel']);
                  }
//                  store.commit('setRegister', false);
                  break;
                }
                case 'Cancel Linking':{
                  this.$emit('configSelected',['Cancel Linking'])
                  break;
                }

                case 'New Space':{
                  var mOpts = this.getMenuOpts('createNewLayout');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.dialogType=this.DIALOG_NEW_LAYOUT;
                  break;
                }
                case 'saveSpace':{
                  this.cmd='saveSpace';
                  break;
                }

                case 'Done':{
                  this.currentSelectedMenuOption = msg;
                  this.$emit('configSelected',['cancel']);
                  break;
                }
                case 'Save':{
                  this.cmd='save';
                  break;
                }
                case 'SaveConfiguration':{
                  this.cmd='save';
                  this.$emit('configSelected', ['save']);
                  break;
                }
                case 'SaveOrganization':{
                  this.cmd = 'newOrg';
                  break;
                }
/*
                case 'Save':{
                  this.currentSelectedMenuOption = msg;
                  this.$emit('configSelected',['save']);
                  break;
                }

                case 'Save Layout':{
                  this.currentSelectedMenuOption = msg;
                  this.cmd = msg;
                  this.$refs.newl.getEnteredData();
                  break;
                }
*/
                case 'Create New Card':{
//                  debugger;
                  this.currentSelectedMenuOption = msg;
                  var newCardTitle = this.$refs.newCardDialog.getCardTitle();
                  var newCardType = this.$refs.newCardDialog.getCardType()
                  this.$emit('configSelected', ['Create New Card', newCardTitle, newCardType]);
                  break;
                }
                case 'Save Registration':{
                  this.$emit('configSelected', ['Save Registration']);
                  break;
                }
                case 'Save OrgRegistration':{
                  this.$emit('configSelected', ['Save OrgRegistration']);
                  break;
                }
                case 'SubText':{
                  console.log('Dialog subElementValues - ', this.subElementValues);
/*
                  var retrievedSubElements = this.subElementValues.sub;
                  debugger;
                  for(var s = 0;s<retrievedSubElements.length;s++){
                    var thisSubElementValue = retrievedSubElements[s];
                    var thisSubElementComponents = thisSubElementValue[1].split(':');
                    var componentVal = thisSubElementComponents[1].slice(0, -1);
                    this.subValue[thisSubElementComponents[0]]=componentVal;
                  }
                  console.log('subValue - ', this.subValue);
*/
                  this.currentSelectedMenuOption = 'SubText';
                  break;
                }
                default:{
                  this.currentSelectedMenuOption = msg;
                  this.cmd = msg;
                  break;
                }
              }
            },
            getMenuOpts(menuContext){
//              debugger;
              console.log('Dialog2 getMenuOpts menuContext:', menuContext);
              switch(menuContext){
                case 'register':{
                  return {
                    currentMenuOpts: [
                      ['Cancel','Cancel'],
                      ['Save','Save OrgRegistration']
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }
                case 'newCard':{
                  return {
                    currentMenuOpts: [
                      ['Cancel','Cancel'],
                      ['Create New Card','Create New Card']
                    ],
                    currentSelectedMenuOption: 'Create New Card'
                  }
                }
                case 'textShow':{
                  return {
                    currentMenuOpts: [
                      ['Appearence','Appearence'],
                      ['Save','SaveConfiguration'],
                      ['Cancel', 'Cancel']
                    ],
                    currentSelectedMenuOption: 'Appearence'
                  }
                }
                case 'greenComponent':{
                  return {
                    currentMenuOpts:[
                      ['Appearence','Appearence'],
                      ['Text', 'Text'] ,
                      ['Save','SaveConfiguration'],
                      ['Cancel', 'Cancel']
                    ],
                    currentSelectedMenuOption: 'Appearence'
                  }
                }
                case 'linkMenu':{
                  return {
                    currentMenuOpts:[
                      ['Appearence','Appearence'],
                      ['Headline Text', 'Text'] ,
                      ['Link Text', 'SubText'],
                      ['Save','SaveConfiguration'],
                      ['Cancel', 'Cancel']
                    ],
                    currentSelectedMenuOption: 'Appearence'
                  }
                }
                case 'layoutListLink':{
                  return {
                    currentMenuOpts: [
                      ['Cancel', 'Cancel Linking'],
                      ['New', 'New Space']
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }
                case 'createNewLayout':{
                  return {
                    currentMenuOpts: [
                      ['Cancel', 'Cancel'],
                      ['Save', 'saveSpace']
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }
                case 'topMenu':{
                  return {
                    currentMenuOpts: [
                        ['Add Group', 'Add Group'],
                        ['Remove Group', 'Remove Group'],
                        ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'topMenuB':{
                  return {
                    currentMenuOpts: [
                      ['Add Group', 'Add Group'],
                      ['Clear Remove', 'Clear Remove'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'adminGroupMenu':{
                  return {
                    currentMenuOpts:[
                        ['Add Member', 'Add Member'],
                        ['Back', 'Back'],
                        ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'adminAddMemberMenu':{
                  return {
                    currentMenuOpts:[
                      ['Add Member To Group', 'Add Member To Group'],
                      ['Back', 'Back'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'adminRemoveMemberMenu':{
                  return {
                    currentMenuOpts:[
                      ['Remove Member From Group', 'Remove Member From Group'],
                      ['Back', 'Back'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'groupMenu':{
                  return {
                    currentMenuOpts:[
                      ['Back', 'Back'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'addNewOrg':{
                  return {
                    currentMenuOpts:[
                      ['Done', 'Done'],
                      ['Add New Organization','Add New Organization']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'saveNewOrg':{
                  return {
                    currentMenuOpts:[
                      ['Back', 'OrgTopBack'],
                      ['Done', 'Done'],
                      ['Save', 'SaveOrganization']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgMembersSuperAdmin':{
                  return {
                    currentMenuOpts:[
                      ['Add Member','Add Member'],
                      ['Remove', 'Remove'],
                      ['Back', 'OrgTopBack'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgMembersAdmin':{
                  return {
                    currentMenuOpts:[
                      ['Add Member','Add Member'],
                      ['Back', 'Back'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgMemberNoAdmin':{
                  return {
                    currentMenuOpts:[
                      ['Back', 'Back'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgNewUser':{
                  return {
                    currentMenuOpts:[
                      ['Save Registration','Save Registration'],
                      ['Back', 'Return to New Organization'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'existingOrgUser':{
                  return {
                    currentMenuOpts:[
                      ['Back', 'Return to New Organization'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
              }
            },
            orgSelected(msg){
              console.log('orgSelected:', msg);
            },
            rusure(msg){
              debugger;
              if(msg){
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;
                this.freezeEvent('',[]);
                this.$emit('configSelected',['cancel']);
              }else{
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;
                this.releaseFrozenEvent();
              }
            },
            handleDragEnd(evt){
                this.lastMouseX = evt.screenX;
                this.lastMouseY = evt.screenY;
                this.$emit('moved', [evt.screenY , evt.screenX]);
            },
            setMenu(msg){
              console.log('setMenu - ', msg);
              var mOpts = this.getMenuOpts(msg);
              console.log('mOpts -', mOpts);
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
              this.clearCmd();
            },
            componentSettingsMounted(msg){
//              debugger;
              console.log("register=", this.$store.getters.getRegister);
              console.log('Dialog2 componentSettingsMounted - ',msg);
//              this.currentMenuOpts = msg[0];
//              this.currentSelectedMenuOption = msg[1];

/*
              if(this.$store.getters.getRegister){
                this.dialogType = this.DIALOG_REGISTER;
                this.currentMenuOpts = ['Register', 'Cancel'];
                this.currentSelectedMenuOption = 'Cancel';
              }else{
                this.currentMenuOpts = msg[0];
                this.currentSelectedMenuOption = msg[1];
              }

 */
            },
            freezeEvent(eventType, eventArgs){
                this.frozenEvent.eventType = eventType;
                this.frozenEvent.eventArgs = eventArgs;
            },
            releaseFrozenEvent(){
              this.$emit(this.frozenEvent.eventType, this.frozenEvent.eventArgs);
            },
            getTitle(){
              switch(this.dialogType){
                case this.DIALOG_NEW_LAYOUT:{
                  this.titleMsg = "New Layout";
                  break;
                }
                case this.DIALOG_CREATE_CARD:{
                  this.titleMsg = "New Card";
                  break;
                }
                case this.DIALOG_CONFIGURE_GREEN_CARD:{
                  this.titleMsg = "Headline Card";
                  break;
                }
                case this.DIALOG_PERMS:{
//                  this.titleMsg = "Who Can Access This Space";
                  break;
                }
                case this.DIALOG_REGISTER:{
                  this.titleMsg = "Register New User";
                }
              }
            },
            userExists(msg){
              this.currentMenuOpts = ['Done'];
              this.currentSelectedMenuOption = 'Done';
              this.dialogType=this.DIALOG_USER_EXISTS;
              console.log(msg);


            },
            setTitle(msg){
              this.titleMsg = msg;
            },
            clearCmd(){
              this.cmd='';
              this.dialogCmd='';
              this.$emit('clearCmd');
            }
        },


        data(){
            return {
                styleObject: {
                    top: '-600px',
                    left: '400px'
                },
                lastMouseX:0,
                lastMouseY:0,
                currentMenuOpts:[],
                currentSelectedMenuOption:'',

                DIALOG_CONFIGURE_GREEN_CARD:1,
                DIALOG_CONFIGURE_TEXT_CARD:2,
                DIALOG_CREATE_CARD:3,
                DIALOG_NEW_LAYOUT:4,
                DIALOG_PERMS:5,
                DIALOG_REGISTER:6,
                DIALOG_ORGANIZATIONS:7,
                DIALOG_ORGANIZATION_MEMBERS:8,
                DIALOG_USER_EXISTS:9,
                DIALOG_CONFIGURE_CARD:10,
                DIALOG_LAYOUT_LIST:11,
                titleMsg:'Headline Card',

                sureMsg:'',

                DIALOG_TITLE:0,
                DIALOG_RUSURE:1,
                dialogContext:0,

                frozenEvent:{
                  eventType:'',
                  eventArgs:[]
                },
                dialogDataChanged: false,
                subValue: {}





            }
        }
    }
</script>

<style scoped>
    .dialogComponent {
        height:325px;
        width:750px;
        position: relative;
        background-color: #ab97ff;
        border: 2px solid blue;
        border-radius: 8px;
        box-shadow: 10px 10px 5px grey;
        z-index: 10;
    }
    .dialogComponentHeader {
        height:10%;
        background-color: #fff722;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-align: center;
        color: blue;
        font-family: Geneva;
        font-size: 12px;
        font-style: normal;
        font-weight: bold;
        padding-top: 5px;
    }
    .headingText{
        margin-top: 5px;
    }
    .dialogComponentBody {
        height: 72%;
        width: 90%;
        margin-left: 10px;
        margin-right: 10px;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100%


    }
    .dialogComponentFooter {
      height: 10%;
      width:100%;
      text-align: center
    }
    .linkStyle{
        font-family: Arial;
        font-size: medium;
        color: #0a3aff;
        margin-left: 10%;
        margin-right: 10%;
    }
    .field{
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
    }
    .sure {
      margin-top: 5px;
    }
</style>
