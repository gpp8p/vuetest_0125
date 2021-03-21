<template>
    <div class="dialogComponent" ref="drg"    >
      <div class="dialogComponentHeader" v-if="dialogContext==this.DIALOG_TITLE">
        <span class="headingText">{{this.titleMsg}}</span>
      </div>
      <div class="dialogComponentHeader" v-if="dialogContext==this.DIALOG_RUSURE" >
            <span class="sure">
              <are-you-sure :msg="sureMsg" @rusureClick="rusure"></are-you-sure>
            </span>
      </div>
        <br/>

      <div class="dialogComponentBody">
        <link-master v-if="mode==this.LINK_MENU_EDIT" :cardId = "this.cardId"></link-master>
        <editor-ck v-if="mode==this.DIALOG_EDIT" :cardData="cardData" :cmd="cmd" @saveContent="cardSaved" @editorReady="editorReady" @currentContent="currentContent"></editor-ck>
        <layout-list v-if="mode==this.DIALOG_LAYOUT_LIST" :cmd="cmd" @spaceSelected="spaceSelected"></layout-list>
        <create-layout v-if="mode==this.DIALOG_NEW_LAYOUT" :cmd="cmd" @layoutData="layoutData"></create-layout>
        <add-link v-if="mode==this.DIALOG_ADD_LINK"></add-link>
       </div>
      <div class="dialogComponentFooter">
          <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
      </div>
    </div>

</template>

<script>
//    import greenComponentSettings from "../components/greenComponentSettings.vue";
    import menuOpt from "../components/menuOptV2.vue";

//    import newLayout from "../components/newLayout.vue";

    import AreYouSure from "../components/AreYouSure.vue";
    import editorCk from '../components/editorCk.vue'
    import layoutList from "../components/layoutList.vue";
    import createLayout from "../components/createLayout.vue";
    import linkMaster from "../components/linkMaster.vue";
    import addLink from "../components/addLink.vue"






 //   import store from "@/store";

    export default {
        name: "rtEditorDialog",
        components :{ menuOpt,   AreYouSure, editorCk, layoutList, createLayout, linkMaster, addLink },
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
          },
          cardData:{
            type: String,
            required: true
          },
          cardToEditType:{
              type: String,
              required: true
          },
          cardId:{
              type: Number,
              required: false
          }
        },
        mounted(){

//          this.currentMenuOpts = ['Cancel', 'Link to Another Space',  'Save'];
//          this.currentSelectedMenuOption = 'Cancel';
          switch(this.cardToEditType){
            case 'textShow':{
              this.titleMsg='Edit This Card';
              var mOpts = this.getMenuOpts('richTextOpen');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
              this.mode=this.DIALOG_EDIT;
              break;
            }
            case 'linkMenu':{
              this.titleMsg='Construct Menu of Links';
              mOpts = this.getMenuOpts('setupMenuLink');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
              this.mode=this.LINK_MENU_EDIT;
              break;
            }
          }


        },
        watch:{
          dialogType: function(){
            console.log(this.selectedCardConfigurationValues);
//            debugger;

          },
          cmd: function(){
            debugger;
            console.log('Dialog cmd changed:',this.cmd);
            var cmdElements = this.cmd.split(':');
            switch(cmdElements[0]){
              case 'layoutSelected':{
                this.spaceSelected(cmdElements[1]);
                this.clearCmd();
                break;
              }
            }
          },
        },
        methods: {
            cardSaved(msg){
              console.log('rtEditorDialog.cardSaved - ',msg);
              this.$emit('saveCardData', msg);
            },
            cancelClicked(){
                this.$emit('configSelected',['cancel']);
            },
            editorReady(msg){
              this.editorInUse=msg;
            },
            currentContent(msg){
              debugger;
              this.currentEditorContent = msg[0];
              this.currentSelectedRange = msg[1];
              this.currentSelection = msg[2];

              this.mode=this.DIALOG_LAYOUT_LIST;
              this.currentMenuOpts = ['Cancel', 'Create Linked Space',  'Back'];
            },
            saveClicked(){
                //        debugger;
                this.$emit('configSelected', ['save']);
            },
            configSelected(msg){
                this.dialogDataChanged = true;
                this.$emit('configSelected', msg);
            },
            spaceSelected(selectedSpace){
                debugger;
                console.log(selectedSpace);
                this.layoutLink=selectedSpace;
                this.cardData = this.currentEditorContent;
                this.mode=this.DIALOG_EDIT;
                this.titleMsg='Select portion of text for the link';
//                this.currentMenuOpts = ['Cancel', 'Insert the Link',  'Back'];

            },
            handleDragStart(evt){
//                debugger;
                this.$emit('dragStart',[evt.screenX, evt.screenY])
            },
            layoutData(msg){
              debugger;
              console.log('layoutData',msg);
              this.layoutLink=msg[0];
              this.mode=this.DIALOG_EDIT;
              this.titleMsg='Select portion of text for the link';
//              this.currentMenuOpts = ['Cancel', 'Insert the Link',  'Back'];
              var mOpts = this.getMenuOpts('insertLink');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;


//              this.$emit('configSelected',['layoutSaved', msg[0]]);
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
                case 'Save':{
                  this.cmd='Save';
                  break;
                }
                case 'Back':{
                  this.titleMsg='Edit This Card';
//                  this.currentMenuOpts = ['Cancel', 'Link to Another Space',  'Save'];
//                  this.currentSelectedMenuOption = 'Cancel';
                  var mOpts = this.getMenuOpts('richTextOpen');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

                  this.mode=this.DIALOG_EDIT;
                  break;
                }
                case 'Create Linked Space':{
                  this.mode=this.DIALOG_NEW_LAYOUT;
                  this.currentMenuOpts = ['Cancel', 'Save This Space',  'Back'];
                  break;
                }
                case 'Save This Space':{
                  this.cmd='saveSpace';
                  break;
                }
                case 'Link to Another Space':{
//                  this.cmd='cacheCurrentContent';
                  this.$emit('configSelected',['link']);
                  break;
                }
                case 'Insert the Link':{
                  debugger;
                  var textHasBeenSelected = false;
                  const selection = this.editorInUse.model.document.selection;
                  const range = selection.getFirstRange();
//                  const range = this.currentSelectedRange;

                  for (const item of range.getItems()) {
                    console.log(item.data) //return the selected text
                    textHasBeenSelected = true;
                  }
                  if(!textHasBeenSelected){
                    this.titleMsg='Please select some text!';
                  }else{
                    this.forwardToUrl = "http://localhost:8080/displayLayout/"+this.layoutLink;
                    this.editorInUse.execute( 'link', this.forwardToUrl );
  //                  this.currentMenuOpts = ['Cancel', 'Link to Another Space',  'Save'];
                    mOpts = this.getMenuOpts('richTextOpen');
                    this.currentMenuOpts = mOpts.currentMenuOpts;
                    this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

                    this.titleMsg = 'Edit This Card';
                  }
                  break;
                }
                case 'AddLink':{
                  this.titleMsg = 'Add a New Link';
                  mOpts = this.getMenuOpts('addLinkSelected');
                  this.currentMenuOpts = mOpts.currentMenuOpts;
                  this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
                  this.mode=this.DIALOG_ADD_LINK;
                  break;
                }
              }
            },
          getMenuOpts(menuContext){
//              debugger;
            console.log('Dialog2 getMenuOpts menuContext:', menuContext);
            switch(menuContext){
              case 'setupMenuLink': {
                return {
                  currentMenuOpts: [
                    ['Add', 'AddLink'],
                    ['Cancel', 'Cancel'],
                    ['Save', 'Save LinkMenu']
                  ],
                  currentSelectedMenuOption: 'Cancel'
                }
              }
              case 'menuLinkSelected':{
                  return {
                    currentMenuOpts: [
                      ['Add', 'AddLink'],
                      ['Delete', 'DeleteLink'],
                      ['Cancel','Cancel'],
                      ['Save','SaveLinkMenu']
                    ],
                    currentSelectedMenuOption: 'Cancel'
                  }
              }
              case 'addLinkSelected':{
                return {
                  currentMenuOpts: [
                    ['New Space', 'NewSpace'],
                    ['Cancel','Cancel'],
                    ['Save','SaveLinkMenu']
                  ],
                  currentSelectedMenuOption: 'Cancel'
                }
              }
              case 'richTextOpen':{
                return {
                  currentMenuOpts:[
                    ['Cancel','Cancel'],
                    ['Link','Link to Another Space'],
                    ['Save', 'Save']
                  ],
                  currentSelectedMenuOption: 'Cancel'
                }
              }
              case'insertLink':{
                return {
                  currentMenuOpts:[
                    ['Cancel','Cancel'],
                    ['Insert Link', 'Insert the Link'],
                    ['Back', 'Back']
                  ],
                  currentMenuSelection: 'Cancel'
                }
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
            userExists(msg){
              this.currentMenuOpts = ['Done'];
              this.currentSelectedMenuOption = 'Done';
              this.dialogType=this.DIALOG_USER_EXISTS;
              console.log(msg);


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
                    left: '600px'
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
                DIALOG_EDIT:12,
                DIALOG_ADD_LINK:15,
                LINK_MENU_EDIT:13,
                mode:0,

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

                editorInUse:{},
                layoutLink:0,
                currentEditorContent:'',
                currentSelectedRange:{},
                currentSelection:{}





            }
        }
    }
</script>

<style scoped>
    .dialogComponent {
        height:530px;
        width:1025px;
        position: relative;
        background-color: #81e7cb;
        border: 2px solid blue;
        border-radius: 8px;
        box-shadow: 10px 10px 5px grey;
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
        height: 78%;
        width: 90%;
        margin-left: 10px;
        margin-right: 10px;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100%


    }
    .dialogComponentFooter {
      height: 5%;
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
