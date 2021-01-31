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
            :cmd="cmd"
        ></new-layout>
        <PermList v-if="dialogType==this.DIALOG_PERMS"
                  @componentSettingsMounted="componentSettingsMounted"
                  @setTitle="setTitle"
                  :selectedMenuOption="currentSelectedMenuOption"
                  :cmd="cmd"
        ></PermList>
        <register-user v-if="dialogType==this.DIALOG_REGISTER" :cmd="cmd" @registrationSaved="registrationSaved" @setTitle="setTitle" @componentSettingsMounted="componentSettingsMounted" @userExists="userExists"></register-user>
        <user-exists v-if="dialogType==this.DIALOG_USER_EXISTS" ></user-exists>
        <organizations :cmd="cmd" v-if="dialogType==this.DIALOG_ORGANIZATIONS" :selectedMenuOption="currentSelectedMenuOption" @setTitle="setTitle" @componentSettingsMounted="componentSettingsMounted" @orgSelected="orgSelected" @clearCmd="clearCmd"></organizations>

      </div>
      <div class="dialogComponentFooter">
          <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
      </div>
    </div>

</template>

<script>
//    import greenComponentSettings from "../components/greenComponentSettings.vue";
    import menuOpt from "../components/menuOpt.vue";
    import newCardCreate from "../components/newCardCreate.vue";
//    import newLayout from "../components/newLayout.vue";
    import newLayout from "../components/createLayout.vue";
    import AreYouSure from "../components/AreYouSure.vue";
    import PermList from "../components/PermList.vue";
    import organizations from "../components/organizations.vue";
    import userExists from "../components/userExists.vue";
    import cardConfigurationSettings from "../components/cardConfigurationSettings.vue";


 //   import store from "@/store";
    import RegisterUser from "@/components/registerUser";
    export default {
        name: "Dialog",
        components :{RegisterUser, menuOpt, newCardCreate, newLayout, AreYouSure, PermList, organizations, userExists, cardConfigurationSettings},
        props:{
            dialogType:{
                type: Number,
                required: true
            },
            currentValues:{
              type: Object,
              required:true
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
          this.getTitle();
          if(this.cmd=='register'){
            this.currentMenuOpts = ['Cancel', 'Save Registration'];
            this.currentSelectedMenuOption = 'Cancel';
          }
          if(this.cmd=='textShow'){
            this.currentMenuOpts = ['Appearence', 'Save', 'Cancel'];
            this.currentSelectedMenuOption = 'Appearence';
          }
          if(this.cmd=='greenComponent'){
            this.currentMenuOpts = ['Appearence', 'Text', 'Save', 'Cancel' ];
            this.currentSelectedMenuOption = 'Appearence';

          }
        },
        watch:{
          dialogType: function(){
            console.log(this.selectedCardConfigurationValues);
//            debugger;

          },
          cmd: function(){
            console.log('Dialog cmd changed:',this.cmd);
          },
        },
        methods: {
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
            layoutData(msg){
 //             debugger;
              console.log('layoutData',msg);
              this.$emit('configSelected',['layoutSaved', msg[0]]);
            },
            menuOptSelected(msg){
              console.log(msg);
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
                case 'Done':{
                  this.currentSelectedMenuOption = msg;
                  this.$emit('configSelected',['cancel']);
                  break;
                }
                case 'Save':{
                  this.cmd='Save';
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
                default:{
                  this.currentSelectedMenuOption = msg;
                  this.cmd = msg;
                  break;
                }
              }
            },
            orgSelected(msg){
              console.log('orgSelected:', msg);
            },
            rusure(msg){
//              debugger;
              if(msg){
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;
                this.releaseFrozenEvent();
              }else{
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;
                this.freezeEvent('',[]);
              }
            },
            handleDragEnd(evt){
                this.lastMouseX = evt.screenX;
                this.lastMouseY = evt.screenY;
                this.$emit('moved', [evt.screenY , evt.screenX]);
            },
            componentSettingsMounted(msg){
              debugger;
              console.log("register=", this.$store.getters.getRegister);
              console.log(msg);
              this.currentMenuOpts = msg[0];
              this.currentSelectedMenuOption = msg[1];

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
                dialogDataChanged: false





            }
        }
    }
</script>

<style scoped>
    .dialogComponent {
        height:325px;
        width:650px;
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
      margin-left: auto;
      margin-right: auto;
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
