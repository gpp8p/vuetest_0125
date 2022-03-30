<template>
<div class="dialogComponent">
  <span class="dialogComponentHeader">
    <span class="headingText">{{this.titleMsg}}</span>
  </span>

  <span class="linkMasterWrapper">
    <span class="labelPlusInput">
      <span>
        Title:
      </span>
      <span class="titleField">
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

      <create-layout v-if="mode==this.CREATE_LAYOUT" :cmd="currentCmd" @err="createError" @layoutData="layoutData"></create-layout>


    </span>
  </span>
  <span>
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
//import CardBase from "@/components/CardBase";
export default {
  name: "linkMaster3",
  components :{ menuOpt, linkMenuList, linkMenuAdd, createLayout},
//  extends: CardBase,
  mounted(){
    this.titleMsg='Building a Menu';
    var mOpts = this.getMenuOpts('setupMenuLink');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
    this.currentCardData= JSON.parse(this.cardData);
    this.currentCardData.orient = this.orient;
    this.mode=this.SHOW_LINKS;
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
      CREATE_LAYOUT:2,
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
              ['Add', 'AddLink'],
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
              ['Do Not Remove','clearLinkList']
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
              ['Back', 'rtnToMenuHome'],
            ],
            currentMenuSelection: 'Cancel'
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
            this.currentCardData.availableLinks.splice(this.selectedLink, 1);
            this.titleMsg='Building a Menu';
            mOpts = this.getMenuOpts('setupMenuLink');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          }
          break;
        }
        case 'CreateLayout':{
          mOpts = this.getMenuOpts('creatingLayout');

          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode=this.CREATE_LAYOUT;
          break;
        }
        case 'addCurrent':{
          this.addCurrentLayout();
          break;
        }
        case 'rtnToMenuHome':{
          mOpts = this.getMenuOpts('setupMenuLink');

          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          this.mode=this.SHOW_LINKS;
          break;
        }
        case 'saveAndAdd':{
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
    layoutData(msg){
      console.log('layout saved:',msg);
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

      this.selectedLayout=newElement;
      var str1 = "Add ";
      this.titleMsg = str1.concat(newElement.description, ' to the menu ?');
      var mOpts = this.getMenuOpts('addLinkToMenu');

      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

      this.mode=this.SHOW_LINKS;

    },
    layoutSelected(msg){
      console.log('selected layout:', msg.description);
      this.selectedLayout = {};
      if(this.linkOptionSelected=='internal'){
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
      }else{
        this.selectedLayout.isExternal=1;
      }
      var str1 = "Add ";
      this.titleMsg = str1.concat(msg.description, ' to the menu ?');
      var mOpts = this.getMenuOpts('addLinkToMenu');

      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

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
      console.log(msg);
      console.log(msg.id);
      console.log(this.selectedLayout.description);
      this.selectedLink = this.findSelectedIndex(msg.id);
      var currentlySelectedKeys = Object.keys(this.selectedLayout);
      if(currentlySelectedKeys.length>0){
        var str1 = "Insert ";
        this.titleMsg = str1.concat(this.selectedLayout.description, ' in the menu ?');
        var mOpts = this.getMenuOpts('insertLinkInMenu');

        this.currentMenuOpts = mOpts.currentMenuOpts;
        this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      }else{
        mOpts = this.getMenuOpts('setupMenuLink1');
        this.currentMenuOpts = mOpts.currentMenuOpts;
        this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
        str1 = "Remove ";
        this.titleMsg = str1.concat(msg.description, 'from the menu ?');

      }
    },
    linkMasterSave(){
      var cardTitle='';
      if(typeof(this.currentCardData.linkMenuTitle)=='undefined'){
        cardTitle = ''
      }else{
        cardTitle = this.currentCardData.linkMenuTitle
      }
      var allCardLinks = JSON.stringify(this.currentCardData.availableLinks);
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

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
//          alert('returned ok');
          this.$emit('configurationHasBeenSaved');
        }
      }).catch(function(error) {
        alert('returned with an error');
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
    findSelectedIndex(id){
      for(var i=0;i<this.currentCardData.availableLinks.length;i++){
        var thisMenuLink = this.currentCardData.availableLinks[i];
        if(thisMenuLink.id == id){
          return i;
        }
      }
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
  background-color: #81e7cb;
  border: 2px solid blue;
  border-radius: 8px;
  box-shadow: 10px 10px 5px grey;
}
.dialogComponentHeader {
  height:25px;
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


.linkMasterWrapper {
  display:grid;
  grid-template-rows: 10% 90%;
  height:100%;
  width:100%;
  position: relative;
  background-color: #81e7cb;
}
.labelPlusInput {
  margin-left:10px;
  width:100%;
  display:grid;
  grid-template-columns: 10% 50% 40%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.orient {
  display: grid;
  grid-template-columns: 40% 60%;
}
.titleField {

}
</style>
