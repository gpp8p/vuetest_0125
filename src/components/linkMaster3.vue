<template>
<div class="dialogComponent">
  <span class="dialogComponentHeader">
    <span class="headingText">{{this.titleMsg}}</span>
  </span>

  <span class="linkMasterWrapper">
    <span class="labelPlusInput" >
      <span>
        Title:
      </span>
      <span class="titleField" v-if="this.mode===this.ADD_LINK">
        <input v-model="currentCardData.linkMenuTitle" size="55"/>
      </span>
      <span class="orient">
      </span>
    </span>
    <span>
      <span v-if="this.mode===this.SHOW_LINKS">
        <link-menu-list :cmd="this.currentCmd" @clearCmd="clearCmd" :currentCardData="this.currentCardData" @linkSelected="linkSelected" ></link-menu-list>
      </span>
      <span v-if="this.mode===this.ADD_LINK">
        <link-menu-add
            :cmd="this.currentCmd"
            @internalLinkOption="internalLinkOption"
            @externalLinkOption="externalLinkOption"
            @layoutSelected="layoutSelected"
            @newExtLink="newExtLink" >
        </link-menu-add>
      </span>
      <span v-if="this.mode===this.EDIT_LINK">
        <link-menu-add
            :cmd="this.currentCmd"
            @internalLinkOption="internalLinkOption"
            @externalLinkOption="externalLinkOption"
            @layoutSelected="editSelectedLink"
            @newExtLink="newExtLink" >
        </link-menu-add>
      </span>
      <span v-if="mode==this.CREATE_LAYOUT">
        <create-layout  :cmd="currentCmd" :cmdObjectVersion = "cmdVersion" @err="createError" @layoutData="layoutData" @editLayoutData="editLayoutData" ></create-layout>
      </span>
      <span v-if="mode==this.SUBSTITUTE_CREATED_LAYOUT">
        <create-layout  :cmd="currentCmd" :cmdObjectVersion = "cmdVersion" @err="createError" @layoutData="substituteLayoutData" @editLayoutData="editLayoutData"></create-layout>
      </span>
      <span v-if="mode==this.DIALOG_SELECT_TEMPLATE">
        <select-template :cmd = "cmd"  @templateSelected="templateSelected" ></select-template>
      </span>
      <span v-if="mode==this.DIALOG_COPY_CLONE">
              <clone-template
                              :cmd = "this.currentCmd"
                              :cmdVersion = "cmdVersion"
                              :copyIt="copyIt"
                              @setTitle="setTitle"
                              @clearCmd="clearCmd"
                              @cloneSuccessful="cloneSuccessful"
                              @cloneSuccessfulReturnToEdit="cloneSuccessfulReturnToEdit"
                              @addCloneSuccessful="addCloneSuccessful"
                              :sourceTemplate = "this.selectedTemplateDescription"
                              :sourceTemplateId = "this.selectedTemplateId"
              ></clone-template>
      </span>
      <span v-if="mode==this.EDIT_LINK_LABEL">
        <change-link-label
            :cmd = "this.currentCmd"
            :cmdVersion = "cmdVersion"
            :linkLabel =  "selectedLinkDescription"
            @newDescription = "replaceDescription"
        ></change-link-label>
      </span>
  </span>
    <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
  </span>
</div>

</template>

<script>
import menuOpt from "../components/menuOptV2.vue";
import linkMenuList from "../components/linkMenuList.vue";
import linkMenuAdd from "../components/linkMenuAdd.vue";
import createLayout from "../components/createLayout.vue";
import axios from "axios";
import selectTemplate from "../components/selectTemplate.vue";
import cloneTemplate from "./cloneTemplate.vue";
import changeLinkLabel from "./changeLinkLabel.vue";
import store from "@/store";
//import store from "@/store";
//import store from "@/store";

//import CardBase from "@/components/CardBase";
export default {
  name: "linkMaster3",
  components :{ menuOpt, linkMenuList, linkMenuAdd, createLayout, selectTemplate, cloneTemplate, changeLinkLabel},
//  extends: CardBase,
  mounted(){
//    debugger;
    if(this.cmd=='newLayout'){
      this.titleMsg='Creating a new page';
      var mOpts = this.getMenuOpts('addNewPage');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      this.currentCardData= JSON.parse(this.cardData);
      this.currentCardData.orient = this.orient;
      this.mode=this.CREATE_LAYOUT;
    }else{
      this.titleMsg='Building a Menu';
      mOpts = this.getMenuOpts('setupMenuLink');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      this.currentCardData= JSON.parse(this.cardData);
      this.currentCardData.orient = this.orient;
      this.mode=this.SHOW_LINKS;
    }
  },
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
    },
    orient:{
      type: String,
      required: true
    }
  },
  data(){
    return {
      linkMenuTitle:'',
      linkContent:{},
      currentCardData:{},
      linkData:[],
      selectedLink:'',
      columns: [
        {
          field: 'id',
          label: 'ID',
          numeric: true,
          visible: false
        },
        {
          field: 'description',
          label: 'Link To'
        },
        {
          field: 'isExternal',
          label: 'External ?',
          numeric: true,
        },
        {
          field:  'link_url',
          label:  'Target'
        },
        {
          field: 'layout_link_to',
          label: '',
          numeric: true,
          visible: false
        }

      ],
      mode:0,
      SHOW_LINKS:0,
      ADD_LINK:1,
      EDIT_LINK:21,
      EDIT_LINK_LABEL:22,
      CREATE_LAYOUT:2,
      SUBSTITUTE_CREATED_LAYOUT:23,
      DIALOG_COPY_CLONE:14,
      DIALOG_SELECT_TEMPLATE:15,
      DIALOG_COPY_THIS_PAGE:16,
//      DIALOG_SELECT_TEMPLATE_REPLACE:24,
      copyIt:false,
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      perPage: 8,
      nxtPage: 'Next Page',
      selected:'',
//      orient:'',
      titleMsg:'',
      selectedLayout:{},
      linkOptionSelected:'',
//      urlBase: 'http://localhost:8080/displayLayout/',
      urlBase: this.$store.getters.getUrlBase+'displayLayout/',
      currentMenuOpts:[],
      currentSelectedMenuOption:'',
      currentCmd:'',
      cmdVersion:0,
      selectedTemplateDescription:'',
      selectedTemplateId:0,
      replacementLink:{},
      selectedLinkDescription:'',
      cloneTemplateMode:'A'



    }
  },
  methods:{
    getMenuOpts(menuContext){
//              debugger;
      console.log('Dialog2 getMenuOpts menuContext:', menuContext);
      switch(menuContext){
        case 'setupMenuLink': {
          return {
            currentMenuOpts: [
              ['Add A Link', 'AddLink'],
              ['Exit', 'Cancel'],
              ['Add Current Layout', 'addCurrent'],
              ['Create New Layout', 'CreateLayout'],
              ['Save', 'linkMasterSave']
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'setupMenuLink1': {
          return {
            currentMenuOpts: [
              ['Remove','removeLink'],
              ['Change Link', 'changeLink'],
              ['Change Link Label', 'changeLinkLabel'],
              ['Back','clearLinkList'],
              ['Exit', 'Cancel'],
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'addNewPage': {
          return {
            currentMenuOpts: [
              ['Copy Template', 'cloneTemplate'],
              ['Copy This Page', 'copyThisPageAdd'],
              ['Exit', 'Cancel'],
              ['Save', 'AddPageSave']
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'editingLinkLabel': {
          return {
            currentMenuOpts: [
              ['Exit', 'Cancel'],
              ['Change Label','changeLabel'],
              ['Back', 'rtnToMenuHome'],
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'selectExistingLayout': {
          return {
            currentMenuOpts: [
              ['Add To the Menu', 'addExtToMenu'],
              ['Clear','clearExtMenuOpts'],
              ['Back', 'rtnToMenuHome'],
              ['Exit', 'Cancel'],
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case'addLinkToMenu':{
          return {
            currentMenuOpts: [
              ['Add at the begining', 'addBegining'],
              ['Add at the end', 'addEnd'],
              ['Save','linkMasterSave'],
              ['Exit', 'Cancel'],
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case'insertLinkInMenu':{
          return {
            currentMenuOpts: [
              ['Before', 'insertBefore'],
              ['After', 'insertAfter'],
              ['Back', 'backToAdd'],
              ['Remove','removeLink'],
              ['Save','linkMasterSave'],
              ['Exit', 'Cancel'],
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'linkMasterSetup': {
          return {
            currentMenuOpts: [
              ['Exit', 'Cancel'],
              ['Save', 'linkMasterSave']
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'menuLinkSelected':{
          return {
            currentMenuOpts: [
              ['Delete Link', 'DeleteLink'],
              ['Cancel','Cancel'],
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case'creatingLayout':{
          return {
            currentMenuOpts:[
              ['Cancel','Cancel'],
              ['Save and Add', 'saveAndAdd'],
              ['Copy Template', 'cloneTemplate'],
              ['Copy This Page', 'copyThisPage'],
              ['Back', 'rtnToMenuHome'],
            ],
            currentMenuSelection: 'Cancel'
          }
        }
        case'copyingPage':{
          return {
            currentMenuOpts:[
              ['Cancel','Cancel'],
              ['Copy This Page', 'doCopyThisPage']
            ],
            currentMenuSelection: 'Cancel'
          }
        }
        case'copyingPageAdd':{
          return {
            currentMenuOpts:[
              ['Cancel','Cancel'],
              ['Copy It', 'doAddThisPageCopy']
            ],
            currentMenuSelection: 'Cancel'
          }
        }
        case 'doCloneTemplate':{
          return {
            currentMenuOpts: [
              ['Back', 'backToTemplateSelect'],
              ['Copy', 'doCopyTemplate'],
              ['Cancel', 'Cancel'],
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

        case 'linkSubstitution_a':{
          return {
            currentMenuOpts: [
              ['Cancel', 'Cancel'],
              ['Copy Template', 'cloneTemplate_ls'],
              ['Copy This Page', 'copyThisPage_ls'],
              ['Create New Page', 'CreateLayout_a'],
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'linkSubstitution_b':{
          return {
            currentMenuOpts: [
              ['Cancel', 'Cancel'],
              ['Replace with this link', 'linkReplace']
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'linkSubstitution_create':{
          return {
            currentMenuOpts: [
              ['Cancel', 'Cancel'],
              ['Replace with New Page', 'replaceNp']
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
      }
    },
    internalLinkOption(){
      this.titleMsg = 'Click on existing layout or set up a new one';
      var mOpts = this.getMenuOpts('selectExistingLayout');

      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.linkOptionSelected='internal';
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
    },
    externalLinkOption(){
      this.titleMsg = 'Fill in url for external link';
      var mOpts = this.getMenuOpts('selectExistingLayout');

      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.linkOptionSelected='external';
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
    },
    clearCmd(){
      this.currentCmd='';
    },
    menuOptSelected(msg) {
      console.log(msg);
      this.currentCmd = '';
//      debugger;
      switch(msg){
        case 'Cancel':{
          this.mode=0;
          this.currentSelectedMenuOption = msg;
          this.$emit('configSelected',['cancel']);
          break;
        }
        case 'AddLink':{
          this.selectedLayout={};
          this.mode=this.ADD_LINK;
          break;
        }
        case 'backToAdd':{
          var str1 = "Add ";
          this.titleMsg = str1.concat(msg.description, ' to the menu ?');
          var mOpts = this.getMenuOpts('addLinkToMenu');

          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          break;
        }
        case 'addBegining':{
          debugger;
          this.currentCardData.availableLinks.unshift(this.selectedLayout);
          mOpts = this.getMenuOpts('setupMenuLink');

          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.titleMsg='Building a Menu';
          this.selectedLayout={};
          break;
        }
        case 'addEnd':{
//          debugger;
          this.currentCardData.availableLinks.push(this.selectedLayout);
          mOpts = this.getMenuOpts('setupMenuLink');

          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.selectedLayout={};
          this.titleMsg='Building a Menu';
          break;
        }
        case 'insertAfter':{
          this.currentCardData.availableLinks.splice(this.selectedLink+1,0,this.selectedLayout);
          this.selectedLayout={};
          this.currentCmd='clear';
          break;
        }
        case 'insertBefore':{
          this.currentCardData.availableLinks.splice(this.selectedLink,0,this.selectedLayout);
          this.selectedLayout={};
          this.currentCmd='clear';
          break;
        }
        case 'removeLink':{
          debugger;
          if (this.selectedLink > -1) {
            var selectedIndex = this.findSelectedIndex(this.selectedLink);
            this.currentCardData.availableLinks.splice(selectedIndex, 1);
            this.titleMsg='Building a Menu';
            mOpts = this.getMenuOpts('setupMenuLink');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          }
          break;
        }
        case 'changeLink':{
          this.titleMsg='Please select a page to substitute for this link';
          mOpts = this.getMenuOpts('linkSubstitution_a');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode=this.EDIT_LINK;
          break;
        }
        case 'replaceNp':{
          this.currentCmd = 'saveNewPage';
          this.cmdVersion++;
          break;
        }
        case 'changeLinkLabel':{
          this.titleMsg='Change label that appears for this link';
          mOpts = this.getMenuOpts('editingLinkLabel');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode = this.EDIT_LINK_LABEL;
          break;
        }
        case 'changeLabel':{
          this.currentCmd = 'replaceDescription';
          this.cmdVersion++;
          break;
        }
        case 'linkReplace':{
          debugger;
          console.log('linkReplace');
          var newElement ={};
          newElement.description = this.replacementLink.description;
          newElement.id = this.replacementLink.id;
          newElement.isExternal = this.replacementLink.isExternal;
          newElement.height=this.replacementLink.height;
          newElement.width=this.replacementLink.width;
          newElement.menu_label=this.replacementLink.menu_label;
          newElement.layout_link_to = this.replacementLink.layout_link_to;
          var url1 = this.urlBase;
          var url2 = url1.concat(this.replacementLink.layout_link_to);
          newElement.link_url=url2;
          var indexToReplace = this.findSelectedIndex(this.selectedLink);
          debugger;
          this.currentCardData.availableLinks[indexToReplace] = newElement;
          mOpts = this.getMenuOpts('setupMenuLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode = this.SHOW_LINKS;


          break;
        }
        case 'CreateLayout':{
          mOpts = this.getMenuOpts('creatingLayout');

          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode=this.CREATE_LAYOUT;
          break;
        }
        case 'CreateLayout_a':{
          mOpts = this.getMenuOpts('linkSubstitution_create');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode = this.SUBSTITUTE_CREATED_LAYOUT;
          break;
        }
        case 'cloneTemplate':{
          debugger;
          mOpts = this.getMenuOpts('selectTemplate');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.setTitle('Click on template to use');
//                  this.dialogCmd='selectTemplate';
          this.cloneTemplateMode = 'A';
          this.mode=this.DIALOG_SELECT_TEMPLATE;
          break;
        }
        case 'cloneTemplate_ls':{
          mOpts = this.getMenuOpts('selectTemplate');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.setTitle('Click on template to use');
//                  this.dialogCmd='selectTemplate';
          this.cloneTemplateMode = 'R';
          this.mode=this.DIALOG_SELECT_TEMPLATE;
          break;
        }
        case 'copyThisPage':{
//          debugger;
          mOpts = this.getMenuOpts('copyingPage');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.copyIt=true;
          this.selectedTemplateId = this.$store.getters.getCurrentLayoutId;
          this.selectedTemplateDescription = "Current Page";
          this.mode=this.DIALOG_COPY_CLONE;
          break;
        }
        case 'copyThisPageAdd':{
          mOpts = this.getMenuOpts('copyingPageAdd');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.copyIt=true;
          this.selectedTemplateId = this.$store.getters.getCurrentLayoutId;
          this.selectedTemplateDescription = "Current Page";
          this.mode=this.DIALOG_COPY_CLONE;
          break;
        }
        case 'doCopyTemplate':{
          console.log('doCloneTemplate matched');
          this.copyIt=false;
          this.currentCmd = 'doCloneTemplate';
          this.cmdVersion++;
          break;
        }
        case 'doCopyThisPage':{
          console.log('doCopyPage matched');
//          this.mode=0;
          this.currentCmd = 'doCloneTemplate';
          this.cmdVersion++;
          break;
        }
        case 'doAddThisPageCopy':{
          console.log('in doAddThisPageCopy');
          this.currentCmd = 'doAddThisPageCopy';
          this.cmdVersion++;
          break;
        }
        case 'addCurrent':{
          this.addCurrentLayout();
          break;
        }
        case 'rtnToMenuHome':{
          this.titleMsg='Building a Menu';
          mOpts = this.getMenuOpts('setupMenuLink');

          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode=this.SHOW_LINKS;
          break;
        }
        case 'saveAndAdd':{
          console.log('saveAndAdd');
//          debugger;

          this.currentCmd = 'Save';
          break;
        }
        case'addExtToMenu':{
          this.currentCmd = 'addExtToMenu';
          break;
        }
        case 'linkMasterSave':{
          if(typeof(this.currentCardData.orient)=='undefined'){
            alert('You must select an orientation !');
          }else{
            this.linkMasterSave();
          }

          break;
        }
        case 'AddPageSave':{
          this.currentCmd = 'AddPageSave';
          this.cmdVersion++;
          break;
        }
        case 'clearLinkList':{
          this.titleMsg='Building a Menu';
          mOpts = this.getMenuOpts('setupMenuLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.currentCmd = 'clear';
          break
        }
      }
    },
    replaceDescription(msg){
      var replacementMade = false;
      for(var l = 0; l<this.currentCardData.availableLinks.length; l++){
        if(this.currentCardData.availableLinks[l].id==this.selectedLink){
          this.currentCardData.availableLinks[l].description = msg;
          this.titleMsg='Building a Menu';
          var mOpts = this.getMenuOpts('setupMenuLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          replacementMade = true;
          this.mode=this.SHOW_LINKS;
        }
      }
      if(!replacementMade){
        alert('error while rerplacing menu label');
      }
    },
    addNewLinkToList(){
      console.log('in addNewLinkToList - ', this.selectedLayout);
      this.currentCardData.availableLinks.push(this.selectedLayout);
/*
      store.commit('setCurrentLayoutId', this.selectedLayout);
      this.$router.push({
        name: 'edit',
        params: { layoutId: this.$store.getters.getCurrentLayoutId }
      })
*/


      var mOpts = this.getMenuOpts('setupMenuLink');

      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      this.selectedLayout={};
      this.titleMsg='Building a Menu';


    },
    setNewLayoutData(msg){
      var newElement ={};
      newElement.description = msg[2];
      newElement.id = -1;
      newElement.isExternal = 0;
      newElement.height=msg[3];
      newElement.width=msg[4];
      newElement.menu_label=msg[1];
      newElement.layout_link_to = msg[0];
      var url1 = this.urlBase;
      var url2 = url1.concat(msg[0]);
      newElement.link_url=url2;
      return newElement;
    },
    layoutData(msg){
      console.log('layout saved:',msg);
      this.selectedLayout=this.setNewLayoutData(msg);
      this.addNewLinkToList();
      var str1 = "Add ";
      this.titleMsg = str1.concat(this.selectedLayout.description, ' to the menu ?');
      var mOpts = this.getMenuOpts('addLinkToMenu');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

      this.mode=this.SHOW_LINKS;

    },
    editLayoutData(msg){
      this.selectedLayout=this.setNewLayoutData(msg);
      this.currentCardData.availableLinks.push(this.selectedLayout);
      this.currentCardData.orient = 'vertical';
      this.cloneTemplateMode=='P';
      this.linkMasterSave();
    },
    substituteLayoutData(msg){
      console.log('substituteLayoutData',msg);
      this.replacementLink=this.setNewLayoutData(msg);
      var newElement ={};
      newElement.description = this.replacementLink.description;
      newElement.id = this.replacementLink.id;
      newElement.isExternal = this.replacementLink.isExternal;
      newElement.height=this.replacementLink.height;
      newElement.width=this.replacementLink.width;
      newElement.menu_label=this.replacementLink.menu_label;
      newElement.layout_link_to = this.replacementLink.layout_link_to;
      var url1 = this.urlBase;
      var url2 = url1.concat(this.replacementLink.layout_link_to);
      newElement.link_url=url2;

      var indexToReplace = this.findSelectedIndex(this.selectedLink);
      debugger;
      this.currentCardData.availableLinks[indexToReplace] = newElement;
      var mOpts = this.getMenuOpts('setupMenuLink');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

      this.mode=this.SHOW_LINKS;

    },
    layoutSelected(msg){
      console.log('selected layout:', msg);
      this.selectedLayout = {};
      this.selectedLayout.isExternal=0;
      var url1 = this.urlBase;
      var url2 = url1.concat(msg.layout_link_to);
      this.selectedLayout.link_url=url2;
      this.selectedLayout.id=-1;
      this.selectedLayout.description = msg.description;
      this.selectedLayout.layout_link_to = msg.layout_link_to;
      this.selectedLayout.width = msg.width;
      this.selectedLayout.height= msg.height;
      this.selectedLayout.menu_label = msg.menu_label;

      this.addNewLinkToList();

      this.mode=this.SHOW_LINKS;


    },
    newExtLink(msg){
      this.selectedLayout.link_url=msg.description;
      this.selectedLayout.id=0;
      this.selectedLayout.description = msg.menu_label;
      this.selectedLayout.layout_link_to = 0;
      this.selectedLayout.isExternal=1;
      this.selectedLayout.width = 0;
      this.selectedLayout.height= 0;
      this.selectedLayout.menu_label = msg.menu_label;
      var str1 = "Add ";
      this.titleMsg = str1.concat(msg.description, ' to the menu ?');
      var mOpts = this.getMenuOpts('addLinkToMenu');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

      this.mode=this.SHOW_LINKS;

    },
    linkSelected(msg){
      console.log('at link selected',msg);
      console.log(msg.id);
      console.log(this.selectedLayout.description);
      this.selectedLink = this.findSelectedIndex(msg.id);
      this.selectedLinkDescription = msg.description;
      var currentlySelectedKeys = Object.keys(this.selectedLayout);
      if(currentlySelectedKeys.length>0){
        var str1 = "Insert ";
        this.titleMsg = str1.concat(this.selectedLayout.description, ' in the menu ?');
        var mOpts = this.getMenuOpts('insertLinkInMenu');

        this.currentMenuOpts = mOpts.currentMenuOpts;
        this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      }else{
        this.selectedLink = msg.id;
        mOpts = this.getMenuOpts('setupMenuLink1');
        this.currentMenuOpts = mOpts.currentMenuOpts;
        this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
        str1 = "Remove or Replace ";
        this.titleMsg = str1.concat(msg.description, '?');

      }
    },
    editSelectedLink(msg){
      console.log('at editSelectedLink',msg);
      this.replacementLink = msg;
      this.replacementLink.id = msg.selectedLinkId;
      this.titleMsg='Substitute this link ?';
      var mOpts = this.getMenuOpts('linkSubstitution_b');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
    },
    linkMasterSave(){
//      debugger;
      var cardTitle='';
      if(typeof(this.currentCardData.linkMenuTitle)=='undefined'){
        cardTitle = ''
      }else{
        cardTitle = this.currentCardData.linkMenuTitle
      }
      var allCardLinks = JSON.stringify(this.currentCardData.availableLinks);
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      console.log('currentCardData - ', this.currentCardData);
      console.log('orient-', this.currentCardData.orient);
      console.log('cardTitle-',cardTitle );
      console.log('allLinks-', allCardLinks);
      console.log('org_id-', this.$store.getters.getOrgId);
      console.log('layout_id-', this.$store.getters.getCurrentLayoutId);
      console.log('card_instance_id-',this.cardId);
//      debugger;
      axios.post(apiPath+'api/shan/updateCardLinks?XDEBUG_SESSION_START=17516', {
//      axios.post('http://localhost:8000/api/shan/updateCardLinks?XDEBUG_SESSION_START=17516', {
        orient: this.currentCardData.orient,
        cardTitle: cardTitle,
        allLinks:allCardLinks,
        org_id: this.$store.getters.getOrgId,
        layout_id: this.$store.getters.getCurrentLayoutId,
        card_instance_id:this.cardId,
        is_external:0,
        type:'U'
      }).then(response=>
      {
        console.log(response);
        if(response.data=='ok'){
          if(this.cloneTemplateMode=='P'){
            debugger;
            var newRoute = '/displayLayout/edit/'+this.$store.getters.getCurrentLayoutId;
            this.$router.push({ path: newRoute, layoutId:this.$store.getters.getCurrentLayoutId});
            this.$router.go();
          }else{
            this.$emit('configurationHasBeenSaved');
          }
//          debugger;
//          alert('returned ok');
        }
      }).catch(function(error) {
 //       debugger;
        alert('returned with an error'+error);
        console.log(error);
      });

    },
    addCurrentLayout(){
      console.log('addCurrentLayout chosen');
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

      axios.post(apiPath+'api/shan/addCurrentLayout?XDEBUG_SESSION_START=17516', {
//      axios.post('http://localhost:8000/api/shan/addCurrentLayout?XDEBUG_SESSION_START=17516', {
        org_id: this.$store.getters.getOrgId,
        layout_id: this.$store.getters.getCurrentLayoutId,
        card_instance_id:this.cardId,
      }).then(response=>
      {
        console.log(response);
        if(response.data=='ok'){
//          alert('returned ok');
          this.$emit('configurationHasBeenSaved');
        }else if(response.data=='already linked'){
          alert('That layout already linked to by this menu');
        }
      }).catch(function(error) {
        alert('returned with an error');
        console.log(error);
      });
    },
    setTitle(msg){
      this.titleMsg = msg;
    },
    findSelectedIndex(id){
      for(var i=0;i<this.currentCardData.availableLinks.length;i++){
//        debugger;
//        var thisMenuLink = this.currentCardData.availableLinks[i];
        if(this.currentCardData.availableLinks[i].id == id){
          return i;
        }
      }
    },
    templateSelected(msg){
      debugger;
      console.log('templateSelected = ', msg);
      this.selectedTemplateDescription = msg.description;
      this.selectedTemplateId = msg.id;
      var mOpts = this.getMenuOpts('doCloneTemplate');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      this.setTitle('Enter description and label for new layout');
      this.mode = this.DIALOG_COPY_CLONE;
    },
    addCloneSuccessful(msg){
      this.cloneTemplateMode='P';
//      debugger;
      store.commit('setCurrentLayoutId', msg);
      console.log('current layout id in store:', this.$store.getters.getCurrentLayoutId)
      this.cloneSuccessfulReturnToEdit(msg);
    },
    cloneSuccessfulReturnToEdit(msg){
      console.log('clone successful',msg);
      var apiPath = this.$store.getters.getApiBase;
      axios.get(apiPath+'api/shan/layoutInfo?XDEBUG_SESSION_START=15122"', {
        params:{
          layoutId:msg,
        }
      }).then(response=> {
        console.log(response);
//        debugger;
        var url1 = this.urlBase;
        var url2 = url1.concat(msg);
        this.selectedLayout.id=msg;
        this.$store.commit('setCurrentLayoutId', this.selectedLayout.id);
        this.selectedLayout.description = response.data.description;
        this.selectedLayout.layout_link_to = msg;
        this.selectedLayout.link_url = url2
        this.selectedLayout.width = response.data.width;
        this.selectedLayout.height= response.data.height;
        this.selectedLayout.menu_label = response.data.menu_label;
        this.selectedLayout.isExternal = 0;
        this.selectedLayout.type = 'U';
        if(this.cloneTemplateMode=='A') {
          this.addNewLinkToList();
          this.cloneTemplateMode = '';
        }else if(this.cloneTemplateMode=='P'){
          console.log('cloneTemplateMode is P');
          this.addNewLinkToList();
          this.currentCardData.orient = 'vertical';
          this.linkMasterSave();
//          this.$store.commit('setCurrentLayoutId', this.selectedLayout.id);
//          alert('new page created - select edit to add content');
//          var newRoute = '/displayLayout/edit/'+msg;
//          this.$router.push({ path: newRoute});
//          this.$router.go();
/*
          this.$router.push({
            name: 'edit',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
*/
//          this.$emit('gotoNewPage', this.$store.getters.getCurrentLayoutId );
        }else{
          var selectedIndex = this.findSelectedIndex(this.selectedLink);
          console.log('replace with template copy',selectedIndex);
          this.currentCardData.availableLinks[selectedIndex]=this.selectedLayout;
          var mOpts = this.getMenuOpts('setupMenuLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
        }

        this.mode=this.SHOW_LINKS;
      }).catch(e=>{
        console.log(e);
      });

    }


  }

}
</script>

<style scoped>
.dialogComponent {
  height:530px;
  width:1025px;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  position: relative;
  background-color: #ab97ff;
  border: 2px solid blue;
  border-radius: 8px;
  box-shadow: 10px 10px 5px grey;
}
.dialogComponentHeader {
  height:25px;
  background-color: #ab97ff;
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
  color: yellow;
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
  color: #ab97ff;
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


.linkMasterWrapper {
  display:grid;
  grid-template-rows: 10% 90%;
  height:100%;
  width:100%;
  position: relative;
  background-color: #ab97ff;
}
.labelPlusInput {
  margin-left:10px;
  width:100%;
  display:grid;
  grid-template-columns: 10% 50% 40%;
  font-family: Arial;
  font-size: medium;
  color: #ab97ff;
}
.orient {
  display: grid;
  grid-template-columns: 40% 60%;
}
.titleField {

}
</style>
