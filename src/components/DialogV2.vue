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
            @layoutDataChanged="layoutDataChanged"
            @layoutEditSaved="layoutEditSaved"
            @setEditLayoutMenu="setEditLayoutMenu"
            @error="showError"
            @childCmd="setChildCmd"
            :cmd="cmd"
            :cmdObjectVersion="cmdObjectVersion"
            :currentValues="currentValues"
        ></new-layout>
        <PermList v-if="dialogType==this.DIALOG_PERMS"
                  @setMenu = "setMenu"
                  @setTitle="setTitle"
                  :selectedMenuOption="currentSelectedMenuOption"
                  :cmd="cmd"
        ></PermList>
        <register-user v-if="dialogType==this.DIALOG_REGISTER" :cmd="cmd" :cmdVersion="registerCmdVersion" @registrationSaved="registrationSaved" @setTitle="setTitle" @componentSettingsMounted="componentSettingsMounted" @userExists="userExists" @clearCmd="clearCmd"></register-user>
        <user-exists v-if="dialogType==this.DIALOG_USER_EXISTS" ></user-exists>
        <organizations :cmd="cmd" v-if="dialogType==this.DIALOG_ORGANIZATIONS"
                       :cmdVersion="registerCmdVersion"
                       :selectedMenuOption="currentSelectedMenuOption"
                       @setTitle="setTitle" @setMenu = "setMenu"
                       @componentSettingsMounted="componentSettingsMounted"
                       @orgSelected="orgSelected"
                       @clearCmd="clearCmd"
                       @registrationSaved="registrationSaved"
            ></organizations>
        <layout-list v-if="dialogType==this.DIALOG_LAYOUT_LIST" :cmd="cmd" @spaceSelected="spaceSelected"></layout-list>
        <insert-card-select :cmd = "cmd" v-if="dialogType==this.DIALOG_INSERT_CARD" @cardSaved="cardSaved"></insert-card-select>
        <select-template :cmd = "cmd" v-if="dialogType==this.DIALOG_SELECT_TEMPLATE" @templateSelected="templateSelected" ></select-template>
        <clone-template :cmd = "dialogCmd"
                        :cmdVersion = "dialogCmdVersion"
                        @setTitle="setTitle"
                        @clearCmd="clearCmd"
                        @cloneSuccessful="cloneSuccessful"
                        @cloneSuccessfulReturnToEdit="cloneSuccessfulReturnToEdit"
                        v-if="dialogType==this.DIALOG_CLONE_TEMPLATE"
                        :copyIt="copyIt"
                        :sourceTemplate = "this.selectedTemplateDescription"
                        :sourceTemplateId = "this.selectedTemplateId"
        ></clone-template>
        <register-restrict v-if="dialogType==this.DIALOG_REGISTER_RESTRICT" :org="this.selectedOrgId" @allowedRegistrantSaved="allowedRegistrantSaved" @childCmd="setChildCmd" @allowedMemberSelected="allowedMemberSelected" ></register-restrict>
        <image-card-editor v-if="dialogType==this.IMAGE_CARD_EDIT"
               :cmd="cmd"
               @textEdit="textEdit"
               :cmdObjectVersion="cmdObjectVersion"
               :cmdObject= "cmdObject"
                @configSelected="configSelected"

        ></image-card-editor>
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
    import insertCardSelect from "../components/insertCardSelect.vue";
    import selectTemplate from "../components/selectTemplate.vue";
    import cloneTemplate from "./cloneTemplate.vue";
    import registerRestrict from "./registerRestrict.vue";
    import imageCardEditor from "./imageCardEditor";


 //   import store from "@/store";
    import RegisterUser from "@/components/registerUser";
    export default {
      name: "Dialog",
      components: {
        RegisterUser,
        menuOpt,
        newCardCreate,
        newLayout,
        AreYouSure,
        PermList,
        organizations,
        userExists,
        cardConfigurationSettings,
        layoutList,
        insertCardSelect,
        selectTemplate,
        cloneTemplate,
        registerRestrict,
        imageCardEditor
      },
      props: {
        dialogType: {
          type: Number,
          required: true
        },
        currentValues: {
          type: Object,
          required: true
        },
        subElementValues: {
          type: Object,
          required: false
        },
        dialogKey: {
          type: Number,
          required: true
        },
        cmd: {
          type: String,
          required: true
        },
        cmdObject: {
          type: Object,
          required: false
        },
        cmdObjectVersion: {
          type: Number,
          required: false
        },
        selectedCardConfigurationValues: {
          type: Object,
          required: true
        }
      },
      mounted() {
        debugger;
        console.log('Dialog2 mounted');
        var mOpts = this.getMenuOpts(this.cmd);
        switch (this.cmd) {
          case 'createNewLayout': {
            console.log('createNewLayout invoked via cmd - ', this.cmd);
            this.setTitle('Set Up New Space');
            this.clearCmd();
            break;
          }
          case 'imageCard': {
            this.dialogType = this.DIALOG_CONFIGURE_CARD;
            this.setTitle('Set Up Card');
            this.currentSelectedMenuOption = 'Appearence';
            mOpts = this.getMenuOpts('imageCardConfig');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.clearCmd();
            break;
          }
          case'imageCardEditEntry': {
            this.setTitle('Edit Card Content');
            this.currentSelectedMenuOption = 'Cancel';
            mOpts = this.getMenuOpts('imageCardContentEdit');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.clearCmd();
            break;
          }
        }
        console.log('mOpts -', mOpts);
        this.currentMenuOpts = mOpts.currentMenuOpts;
        this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      },
      watch: {
        dialogType: function () {
          console.log('dialogType changed -', this.dialogType);

//            debugger;

        },

//      },

      cmd: function () {
        debugger;
        console.log('Dialog cmd changed:', this.cmd);
        switch (this.cmd) {
          case 'insertCard': {
            var mOpts = this.getMenuOpts('insertCard');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
            break;
          }

        }

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
    },
      computed: {
        currentCmd: function() {
          return this.cmd;
        }
      },
        methods: {
            showError(msg){
              debugger;
              this.setTitle(msg);
            },
            textEdit(msg){
              debugger;
              this.$emit('editClick', msg);
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
            layoutDataChanged(msg){
              console.log('layout data changed', msg);
            },
            layoutEditSaved(msg){
              console.log('layoutEditSaved', msg);
              this.clearCmd();
              this.$emit('configSelected', ['layoutEditSaved']);
            },
            setEditLayoutMenu(msg){
              console.log('setEditLayoutMenu', msg);
              var mOpts = this.getMenuOpts('editExistingLayout');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

            },
            menuOptSelected(msg){
              console.log('menuOptSelected in Dialog2-',msg);
              this.cmd='';
              debugger;
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
                  debugger;
                  var mOpts = this.getMenuOpts('createNewLayout');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.dialogType=this.DIALOG_NEW_LAYOUT;
                  break;
                }
                case 'saveSpace':{
                  this.cmd='saveSpace';
                  this.cmdObjectVersion++;
                  break;
                }
                case 'cloneTemplate':{
                  mOpts = this.getMenuOpts('selectTemplate');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.setTitle('Click on template to use');
//                  this.dialogCmd='selectTemplate';
                  this.dialogType=this.DIALOG_SELECT_TEMPLATE;
                  break;
                }
                case 'copyLayout':{
  //                debugger;
                  console.log('copyLayoutSelected');
//                  console.log(this.$store.getters.getCurrentLayoutDescription);
//                  console.log(this.$store.getters.getCurrentLayoutLabel);
                  this.selectedTemplateDescription = this.$store.getters.getCurrentLayoutDescription;
                  this.selectedTemplateId = this.$store.getters.getCurrentLayoutId;
                  mOpts = this.getMenuOpts('cloneTemplate');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.setTitle('Enter description and label for new page');
                  this.copyIt=true;
                  this.dialogType = this.DIALOG_CLONE_TEMPLATE;

                  break;
                }
                case 'doCloneTemplate':{
                  console.log('doCloneTemplate matched');
                  this.dialogCmd = 'doCloneTemplate';
                  this.dialogCmdVersion++;
                  break;
                }
                case 'doCopyLayout':{
                  console.log('doCopyLayout selected');
                  this.dialogCmd = 'doCopyLayout';
                  this.dialogCmdVersion++;

                  break;
                }
                case 'updateLayout':{
                  this.cmd='updateLayout';
//                  this.dialogCmdVersion++;
                  this.cmdObjectVersion++;
                  break
                }

                case 'Done':{
                  this.currentSelectedMenuOption = msg;
                  this.$emit('configSelected',['cancel']);
                  break;
                }
                case 'Save':{
                  this.cmd='save';
                  this.dialogCmdVersion++;
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
                  var newCardType = this.$refs.newCardDialog.getCardType();
                  var newCardRestriction = this.$refs.newCardDialog.getCardRestriction();
                  this.$emit('configSelected', ['Create New Card', newCardTitle, newCardType, newCardRestriction]);
                  break;
                }
                case 'Save Registration':{
//                  this.$emit('configSelected', ['Save Registration']);
                  this.$emit('configSelected', ['Save OrgRegistration']);
                  this.cmd='saveRegistration';
                  this.registerCmdVersion++;
                  break;
                }
                case 'Save OrgRegistration':{
                  this.$emit('configSelected', ['Save OrgRegistration']);
                  this.cmd='saveRegistration';
                  this.registerCmdVersion++;
                  break;
                }
                case 'saveRegistration':{
                  this.$emit('configSelected', ['Save OrgRegistration']);
                  this.cmd='saveRegistration';
                  this.registerCmdVersion++;
                  break;
                }
                case 'regBackToTop':{
                  mOpts = this.getMenuOpts('restrictListShow');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.childCmd('regBackToTop');
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
                case 'updatePassword':{
                  this.cmd = 'updatePassword';
                  break;
                }
                case 'changePassword':{
                  this.cmd = 'changePassword';
                  break;
                }
                case 'permitedList':{
                  this.setTitle('Currently allowed to register for this organization');
                  mOpts = this.getMenuOpts('restrictListShow');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

                  this.dialogType= this.DIALOG_REGISTER_RESTRICT;
                  break;
                }
                case 'addRestrict':{
                  this.setTitle('Currently allowed to register for this site:');
                  mOpts = this.getMenuOpts('restrictListAdd');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.childCmd('newAllowedRegistrant');
                  break;
                }
                case 'saveAddRestrict':{
                  this.setTitle('Add a new email to the list');
                  mOpts = this.getMenuOpts('restrictListShow');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.childCmd('saveAddRestrict');
                  this.componentKey += 1;
                  break;
                }
                case 'editAllowedMember':{
                  this.setTitle('Edit this allowed registrant');
                  mOpts = this.getMenuOpts('editAllowedMember');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.childCmd('editAllowedMember');

                  break;
                }
                case 'updateAllowedMember':{
                  this.childCmd('updateAllowedMember');
                  break;
                }
                case 'deleteAllowedMember':{
                  this.childCmd('deleteAllowedMember');
                  break;
                }
                case 'SaveImageCardContent':{
                  debugger;
                  this.cmd='saveImageEdit';
                  this.cmdObjectVersion=+1;
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
                case 'insertCard':{
                  return {
                    currentMenuOpts: [
                      ['Cancel','Cancel'],
                    ],
                    currentSelectedMenuOption: 'Cancel'
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
                case 'pdf':{
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
                case 'loginLink':{
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
                case 'archive':{
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
                case 'agenda':{
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
                case 'minutes':{
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
                case 'document':{
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
                      ['Copy Template', 'cloneTemplate'],
                      ['Copy This Page', 'copyLayout'],
                      ['Save', 'saveSpace']
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }
                case 'selectTemplate':{
                  return {
                    currentMenuOpts: [
                      ['Cancel', 'Cancel'],
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }
                case 'cloneTemplate':{
                  return {
                    currentMenuOpts: [
                      ['Back', 'backToTemplateSelect'],
                      ['Copy', 'doCloneTemplate'],
                      ['Cancel', 'Cancel'],
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }
                case 'copyLayout':{
                  return {
                    currentMenuOpts: [
                      ['Back', 'backToTemplateSelect'],
                      ['Copy', 'doCopyLayout'],
                      ['Cancel', 'Cancel'],
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }
                case 'editExistingLayout':{
                  return {
                    currentMenuOpts: [
                      ['Cancel', 'Cancel'],
                      ['Save', 'updateLayout']
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
                        ['Back', 'Back2PermTop'],
                        ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'adminAddMemberMenu':{
                  return {
                    currentMenuOpts:[
                      ['Add Member To Group', 'AddMemberGroup'],
                      ['Back', 'Back2PermTop'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'adminRemoveMemberMenu':{
                  return {
                    currentMenuOpts:[
                      ['Remove Member From Group', 'Remove Member From Group'],
                      ['Back', 'Back2PermTop'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'groupMenu':{
                  return {
                    currentMenuOpts:[
                      ['Back', 'Back2PermTop'],
                      ['Done', 'Done']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'addNewOrg':{
                  return {
                    currentMenuOpts:[
                      ['Done', 'Done'],
                      ['Add New Site','Add New Site']
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
                      ['Remove', 'Remove'],
                      ['Password','updatePassword'],
                      ['Back', 'OrgTopBack'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgMembersMenu':{
                  return {
                    currentMenuOpts:[
                      ['Add User','Add Member'],
                      ['New User', 'NewUser'],
                      ['Back', 'OrgTopBack'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgMembersRestrict':{
                  return {
                    currentMenuOpts:[
                      ['Add Member','Add Member'],
                      ['New User', 'NewUser'],
                      ['Back', 'OrgTopBack'],
                      ['Permited List', 'permitedList'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'restrictListShow':{
                  return {
                    currentMenuOpts:[
                      ['Add Email','addRestrict'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'restrictListAdd':{
                  return {
                    currentMenuOpts:[
                      ['Save and Add','saveAddRestrict'],
                      ['Back', 'regBackToTop'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'allowedMemberSelected':{
                  return {
                    currentMenuOpts:[
                      ['Edit', 'editAllowedMember'],
                      ['Delete', 'deleteAllowedMember'],
                      ['Back', 'regBackToTop'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'editAllowedMember':{
                  return {
                    currentMenuOpts:[
                      ['Save Changes', 'updateAllowedMember'],
                      ['Back', 'regBackToTop'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgMembersAdmin':{
                  return {
                    currentMenuOpts:[
                      ['Add Member','Add Member'],
                      ['New User', 'NewUser'],
                      ['Back', 'Back'],
                      ['Done', 'Done'],
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'orgMembersAdminRestrict':{
                  return {
                    currentMenuOpts:[
                      ['Add Member','Add Member'],
                      ['New User', 'NewUser'],
                      ['Permited List', 'permitedList'],
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
                case 'orgMemberNew':{
                  return {
                    currentMenuOpts:[
                      ['Save Registration','saveRegistration'],
                      ['Back', 'orgMemberBack'],
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
                case 'userPassword':{
                  return {
                    currentMenuOpts:[
                      ['Back', 'orgMemberBack'],
                      ['Done', 'Done'],
                      ['Update Password','changePassword']
                    ],
                    currentSelectedMenuOption: 'Done'
                  }
                }
                case 'imageCardContentEdit':{
                  return {
                    currentMenuOpts:[
                      ['Save','SaveImageCardContent'],
                      ['Cancel', 'Cancel']

                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
                }

                case 'imageCardConfig':{
                  return {
                    currentMenuOpts:[
                      ['Appearence','Appearence'],
                      ['Headline Text', 'Text'] ,
                      ['Sub Text', 'SubText'],
                      ['Save','SaveConfiguration'],
                      ['Image', 'imageStyle'],
                      ['Cancel', 'Cancel']

                    ],
                    currentSelectedMenuOption: 'Appearence'
                  }
                }

              }
            },
            orgSelected(msg){
              console.log('orgSelected:', msg);
              this.selectedOrgId = msg;

            },
            cloneSuccessful(msg){
              console.log("in Dialog2 clone successful",msg);
              this.$emit('cloneSuccessful', msg);
            },
            cloneSuccessfulReturnToEdit(msg){
              console.log('cloneSuccessfulReturnToEdit', msg);
              this.$emit('configSelected',['layoutSelected', msg]);
            },
            templateSelected(msg){
              console.log('templateSelected = ', msg);
              this.selectedTemplateDescription = msg.description;
              this.selectedTemplateId = msg.id;
              var mOpts = this.getMenuOpts('cloneTemplate');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
              this.setTitle('Enter description and label for new page');
              this.dialogType = this.DIALOG_CLONE_TEMPLATE;
            },
            rusure(msg){
              debugger;
              if(msg){
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;

                this.releaseFrozenEvent();
     //           this.$emit('configSelected',['cancel']);
              }else{
//                this.freezeEvent('',[]);
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;

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
            allowedRegistrantSaved(){
              var mOpts = this.getMenuOpts('restrictListShow');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
              this.cmd='loadNewAllowedReg';
              this.registerCmdVersion++;
            },
            allowedMemberSelected(){
              var mOpts = this.getMenuOpts('allowedMemberSelected');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

            },
            clearCmd(){
              this.cmd='';
              this.dialogCmd='';
              this.registerCmdVersion++;
              this.$emit('clearCmd');
            },
            setChildCmd(msg){
              this.childCmd = msg;
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
                DIALOG_INSERT_CARD:12,
                DIALOG_SELECT_TEMPLATE:13,
                DIALOG_CLONE_TEMPLATE:14,
                DIALOG_REGISTER_RESTRICT:15,
                IMAGE_CARD_EDIT:25,
                titleMsg:'',

                sureMsg:'',

                DIALOG_TITLE:0,
                DIALOG_RUSURE:1,
                dialogContext:0,

                frozenEvent:{
                  eventType:'',
                  eventArgs:[]
                },
                dialogDataChanged: false,
                subValue: {},

                selectedTemplateDescription:'',
                selectedTemplateId:0,
                dialogCmd:'',
                dialogCmdVersion:0,

                copyIt:false,
                registerCmdVersion:0,
                registerCmd:'',
                childCmd: null,
                selectedOrgId:null,
                componentKey:0





            }
        }
    }
</script>

<style scoped>
    .dialogComponent {
        height:400px;
        width:750px;
        position: relative;
        background-color: #ab97ff;
        border: 2px solid blue;
        border-radius: 8px;
        box-shadow: 10px 10px 5px grey;
        z-index: auto;
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
