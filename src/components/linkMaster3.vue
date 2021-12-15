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
        <span>Orientation:</span>
        <span>
          <o-radio v-model="currentCardData.orient" name="orientation" native-value="vertical">Vertical</o-radio>
          <o-radio v-model="currentCardData.orient" name="orientation" native-value="horozontal">Horozontal</o-radio>
        </span>
      </span>
    </span>
    <span>
      <span v-if="this.mode===this.SHOW_LINKS">
        <link-menu-list :currentCardData="this.currentCardData" @linkSelected="linkSelected" ></link-menu-list>
      </span>
      <span v-if="this.mode===this.ADD_LINK">
        <link-menu-add
            @internalLinkOption="internalLinkOption"
            @externalLinkOption="externalLinkOption"
            @layoutSelected="layoutSelected" >
        </link-menu-add>
      </span>
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
export default {
  name: "linkMaster2",
  components :{ menuOpt, linkMenuList, linkMenuAdd},
  mounted(){
    this.titleMsg='Building a Menu';
    var mOpts = this.getMenuOpts('setupMenuLink');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
    this.currentCardData= JSON.parse(this.cardData);
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
    }
  },
  data(){
    return {
      linkMenuTitle:'',
      linkContent:{},
      currentCardData:{},
      linkData:[],
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
      orient:'',
      titleMsg:'',
      selectedLayout:{},
      linkOptionSelected:'',
      urlBase: 'http://localhost:8080/displayLayout/',
      currentMenuOpts:[],
      currentSelectedMenuOption:''

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
              ['Save', 'linkMasterSave']
            ],
            currentSelectedMenuOption: 'Cancel'
          }
        }
        case 'selectExistingLayout': {
          return {
            currentMenuOpts: [
              ['Create New Layout', 'CreateLayout'],
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
              ['Save', 'Save This Space'],
              ['Back', 'Back']
            ],
            currentMenuSelection: 'Cancel'
          }
        }
        case'creatingLayout1':{
          return {
            currentMenuOpts:[
              ['Cancel','Cancel'],
              ['Save', 'Save This Space'],
              ['Back', 'Backtosetup']
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
    menuOptSelected(msg) {
      console.log(msg);
      this.cmd = '';
//      debugger;
      switch(msg){
        case 'Cancel':{
          this.currentSelectedMenuOption = msg;
          this.$emit('configSelected',['cancel']);
          break;
        }
        case 'AddLink':{
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
        case 'addEnd':{
          debugger;
          this.currentCardData.availableLinks.push(this.selectedLayout);
          this.selectedLayout={};
          mOpts = this.getMenuOpts('setupMenuLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          break;
        }
      }
    },
    layoutSelected(msg){
      console.log('selected layout:', msg.description);
      this.selectedLayout = msg;
      if(this.linkOptionSelected=='internal'){
        this.selectedLayout.isExternal=0;
        var url1 = this.urlBase;
        var url2 = url1.concat(this.selectedLayout.id);
        this.selectedLayout.link_url=url2;
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
    linkSelected(msg){
      console.log(msg);
      console.log(this.selectedLayout.description);
      var currentlySelectedKeys = Object.keys(this.selectedLayout);
      if(currentlySelectedKeys.length>0){
        var str1 = "Insert ";
        this.titleMsg = str1.concat(this.selectedLayout.description, ' in the menu ?');
        var mOpts = this.getMenuOpts('insertLinkInMenu');
        this.currentMenuOpts = mOpts.currentMenuOpts;
        this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
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
