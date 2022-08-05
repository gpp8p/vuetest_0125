<template>
  <div >
    <div class="cardStyle" v-if="this.editStatus==false">
      <div class="cardHeader" v-if="displayStatus==false">
        <div class="cardHeader" v-if="showOptions==true">
          <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
        </div>
      </div>
      <span class="flex-container">
       {{ this.cardContent.linkMenuTitle }}
      </span>

      <div v-bind:style='subStyle' v-if="this.mode==this.LINK_MENU_LINK_MODE" >
        <span >
          <search-box class="searchBox" :existingQuery="this.currentQuery" :inputSize="searchBoxSize" :displayMode="this.searchMode" @search="submitSearchQuery" @clearSearch="clearSearch" @searchTypeSelected = "searchTypeSelected" @advancedSearchSelected="advancedSearchSelected" ></search-box>
        </span>
        <span v-if="this.cardContent.orient=='vertical'">
          <span v-if="this.advancedQuery==false">
            <ul>
              <m-link v-for="(link, index) in this.cardContent.availableLinks"
                      :key="index"
                      :description="link.description"
                      :target="link.layout_link_to"
                      :is_external="link.isExternal"
                      :link_url="link.link_url"
                      @linkSelected="linkSelected"
              />
            </ul>
          </span>
          <span v-if="this.advancedQuery==true">
            <span class="verticalLabelCss">
                <span  class="vLabelCss">Key Words:</span>
                <span>
                    <o-input v-model='keyWordSearch' type = "textarea"></o-input>
                </span>
            </span>
            <span class="verticalLabelCss">
              <span  class="vLabelCss">Type:</span>
              <select v-model="optSelected" ref="sel" class="selectStyle" @change="optionSelected()">
                <option value="" disabled selected class="optionStyle">Select</option>
                <option v-for="(opt, index) in this.documentTypeOptions" :key="index" v-bind:value="opt" :selected="opt==optSelected" class="optionStyle">{{ opt }}</option>
              </select>
            </span>
            <span class="verticalLabelCss">
              <span  class="vLabelCss">Date From:</span>
              <span>
                <input type="date" v-model='fromDate' required pattern="\d{4}-\d{2}-\d{2}" />
              </span>
            </span>
            <span class="verticalLabelCss">
              <span  class="vLabelCss">Date To:</span>
              <span>
                <input type="date" v-model='toDate' required pattern="\d{4}-\d{2}-\d{2}" />
              </span>
            </span>
          </span>
        </span>
      </div>
      <div v-bind:style='subStyle' v-if="this.mode==this.LINK_MENU_SEARCH_MODE">
        <span >
            <search-box class="searchBox"  :inputSize="searchBoxSize" :existingQuery="this.currentQuery" :displayMode="this.searchMode" @search="submitSearchQuery" @searchTypeSelected = "searchTypeSelected" ></search-box>
        </span>
        <ul>
          <search-result-link v-for="(result, index) in this.linksToShow"
                              :key="index"
                              :description="result.description"
                              :target="result.id"
                              @linkSelected="linkSelected"
          />
        </ul>
          <pager @nextClicked="nextClicked" @previousClicked="previousClicked" v-if="this.showPager"></pager>
        <br/>

      </div>


    </div>


  </div>
</template>

<script>
/* eslint-disable no-console,no-debugger */
import CardBase from "../components/CardBase.vue";
import menuOpt from "../components/menuOptV2.vue";
import mLink from "../components/mLink.vue";
import searchResultLink from "../components/searchResultLink.vue"
import SearchBox from "@/components/searchBox";
import pager from "../components/pager.vue";
import axios from "axios";
export default {
  name: "NavigationMenu",
  components: {menuOpt, mLink, SearchBox, searchResultLink, pager},
  extends: CardBase,
  props: {
    cardStyle: {
      type: String,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
    cardKey: {
      type: String,
      required: true
    },
    cardPosition: {
      type: Array,
      required: true
    },
    cardProperties: {
      type: String,
      required: false
    },
    displayStatus: {
      type: Boolean,
      required: true
    },
    cmd: {
      type: String,
      required: false
    },
    elementStyles:{
      type: Object,
      required:false
    },
    cardContent:{
      type: Object,
      required: true
    },
    cmdObject:{
      type: Object,
      required: false
    },
    cmdObjectVersion:{
      type: Number,
      required: false
    }
  },
  mounted(){
//      debugger;
      if (typeof(this.elementStyles) === 'undefined'){
        this.subStyle = '';
      }else{
        this.subStyle = this.elementStyles.sub[0];
      }
      debugger;
      var existingQuery = '';
      this.loadOptions();
      console.log('activeQuery - ', sessionStorage.getItem('searchActive'), sessionStorage.getItem('searchQuery'));
      if(sessionStorage.getItem('searchActive')=='true'){
        existingQuery =sessionStorage.getItem('searchQuery');
        console.log('existingQuery - ', existingQuery);
      }
      this.currentQuery = existingQuery;




      console.log('cardContent=',this.cardContent);
      if(typeof(this.cardContent.linkMenuTitle)=='undefined'){
        this.cardTitle='';
      }else{
        this.cardTitle = this.cardContent.linkMenuTitle;
      }
      if(this.displayStatus==true){
        this.showOptions=false;
      }else{
        this.showOptions=true;
      }
      var mOpts = this.getMenuOpts('entryMenuAdd');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      debugger;
      var availableSubcontentStyles = this.subStyle.split(';');
      for(var s=0;s<availableSubcontentStyles.length;s++){
        var thisElement = availableSubcontentStyles[s];
//        console.log(thisElement);
        var parts = thisElement.split(":");
        if(parts[0]=='displayLimit'){
            this.displayLimit = parts[1];
//          console.log(parts[0],'-', parts[1]);
        }
      }
      if(typeof(this.cardContent.orient)=='undefined'){
        this.cardContent.orient = 'vertical';
      }
      if(typeof(this.cardContent.availableLinks)=='undefined'){
        this.cardContent.availableLinks = [];
      }




  },
  watch:{
    cmd: function() {
      console.log('linkMenu cmd changed-', this.cmd);
      switch(this.cmd){
        case 'restore':{
          this.restoreCardConfiguration();
          break;
        }
      }
    },
    cardContent: function(){
      console.log('linkMenu cardContent changed-', this.cardContent);
//      debugger;
    },
    subStyleChange(){
      debugger;
      console.log('LinkMenu - watch on subStyleChange triggered. this.subContentStyling.sub:', this.subContentStyling.sub);
      var subStyleKeys = Object.keys(this.subContentStyling.sub);
      var combinedSubstyles = "";
      for(var s=0;s<subStyleKeys.length;s++){
        var thisSubstyleKey = subStyleKeys[s];
        combinedSubstyles = combinedSubstyles+this.subContentStyling.sub[thisSubstyleKey];
      }
      this.subStyle = combinedSubstyles;

    },
    cmdObjectVersion: function(){
      switch(this.cmdObject.action){
        case 'addMLink':{
          console.log('mlink cmdObjectVersion trigger a watch - addLink action')
          break;
        }
      }
    }
  },
  data() {
    return {
      cardMessage: this.getCardProps(),
      cardHasBeenSetup: false,
      cstyle: this.cardStyle,
      cardTitle:'',
      styling: {},
      subContentStyling:{
        sub:{}
      },

      subContentConfiguration:{
        sub:{}
      },

      mode:0,
      LINK_MENU_LINK_MODE:0,
      LINK_MENU_SEARCH_MODE:1,
      searchBoxSize:18,
      searchResults:[],
      searchMode: 'links',

      cardSubConfig:{},
      content: {},
      configurationCurrentValues:{},
      dialog: false,
      testProp: false,
      tdialogMsg:'',
      editStatus:false,
      subStyle: '',
      subStyleChange:0,
      showOptions: false,
      currentMenuOpts: ['Save', 'Cancel'],

      currentQuery:'',
      advancedQuery:false,
      documentTypeOptions:[],
      fileTypeOptions:[],
      accessTypeOptions:[],
      keyWordSearch:'',
      optSelected:'',
      fromDate:'',
      toDate:'',
      displayLimit:0,
      linksToShow:[],
      startingLinkToShow:0,
      showPager:false,

      /*
            configurationCurrentValues:{
              "backgroundTypeColor":'checked',
              "backgroundColor":"#FFFFFF",
              "fontSize":"12pt",
              "fontWeight":"bold",
              "border":"checked",
              "borderColor":"#cc0521",
              "borderSize":"medium",
              "shadow":"checked",
              "shadowSize":"10px",
              "shadowSizeSetAt":"10px",
              "shadowColor":"#BBBBBB",
              "textInput":"Have a nice Day!",
              "fontFamily":"Helvetica",
              "fontStyle":"oblique",
              "textAlign":"left",
              "color":"#0537aa"
            },
      */
    }



  },


  methods: {
    showMsg(){
      debugger;
      this.tdialogMsg='message recieved';
    },
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
    nextClicked(){
      debugger;
      if((this.startingLinkToShow+parseInt(this.displayLimit)) > this.searchResults.length){
        this.startingLinkToShow =  this.searchResults.length-this.startingLinkToShow;
      }else{
        this.startingLinkToShow=this.startingLinkToShow+parseInt(this.displayLimit);
      }
      console.log('nxt - startingLinkToShow', this.startingLinkToShow);
      this.copyLinksToShow(parseInt(this.startingLinkToShow)) ;
    },

    previousClicked(){
      if((this.searchResults.length-parseInt(this.displayLimit))<0){
        this.startingLinkToShow=0;
      }else{
        this.startingLinkToShow=this.startingLinkToShow-parseInt(this.displayLimit);
      }
      console.log('prv - startingLinkToShow', this.startingLinkToShow);
      this.copyLinksToShow(this.startingLinkToShow) ;
    },
    copyLinksToShow(startingPlace){
      debugger;
      if(this.searchResults.length>parseInt(this.displayLimit)){
        this.linksToShow=[];
        if(startingPlace+parseInt(this.displayLimit)>this.searchResults.length){
          newTop = this.searchResults.length;
        }else{
          var newTop = startingPlace+parseInt(this.displayLimit);
        }
        console.log('newTop', newTop);
        for(var l = startingPlace;l<newTop;l++){
          console.log('l is',l);
          this.linksToShow.push(this.searchResults[l]);
          console.log('copying-',this.searchResults[l] );
        }
      }else{
        this.linksToShow = this.searchResults;
      }

    },
    getMenuOpts(menuContext){
      switch(menuContext){
        case'entryMenu':{
          return {
            currentMenuOpts:[
              ['Configure','Configure'],
              ['Resize/Move', 'Resize'],
              ['Del','DeleteCard'],
              ['Edit', 'Edit']
            ],
            currentMenuSelection: 'Configure'
          }
        }
        case'entryMenuAdd':{
          return {
            currentMenuOpts:[
              ['Configure','Configure'],
              ['Resize/Move', 'Resize'],
              ['Del','DeleteCard'],
              ['Edit', 'Edit'],
              ['New','NewLayout']
            ],
            currentMenuSelection: 'Configure'
          }
        }
        case 'deleteChoice':{
          return {
            currentMenuOpts :[
              ['Remove from Page', 'RmvLay'],
              ['Delete Card', 'DelCardFromDb'],
              ['Cancel', 'Cancel']
            ],
            currentMenuSelection: 'Cancel'
          }
        }
      }
    },

/*
    configureClicked() {
//      debugger;
      this.styling={};
      this.loadCardConfiguration(this.cardId);
      this.dialog=true;
      this.testProp=true;
      this.tdialogMsg='message recieved'
//      debugger;

      this.$emit("cardClick", [
        "cardClicked",
        this.cardKey,
        "linkMenu",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues,
      ]);



    },
*/
    editClicked(){
      debugger;
      this.loadCardConfiguration(this.cardId);
      this.$emit('textEditor', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'linkMenu', this.cardContent]);
    },
    newLayoutClicked(){
      this.loadCardConfiguration(this.cardId);
      this.$emit('newLayout', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'linkMenu', this.cardContent]);

    },
/*
    editClicked(){
      this.editStatus = true;
      this.$emit("editClick", [
        "cardClicked",
        this.cardKey,
        "linkMenu",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues,
      ]);
    },

 */
    menuOptSelected(msg){
      debugger;
      console.log(msg);
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      switch(msg){
        case 'Cancel':{
          mOpts = this.getMenuOpts('entryMenu');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'Save':{
          this.$emit('configSelected', ['title', this.cardTitle]);
          this.$emit('configSelected',['saveCardContent', this.cardTitle]);
          this.editStatus=false;
          break;
        }
        case 'Configure':{
          this.configureClicked('linkMenu');
          break;
        }
        case 'Resize':{
          this.moveClicked();
          break;
        }
        case 'Edit':{
          this.editClicked();
          break;
        }
        case 'NewLayout':{
          this.newLayoutClicked();
          break;
        }
        case 'DeleteCard':{
          var mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay':{
          console.log('remove from layout selected');
          axios.get(apiPath+'api/shan/rmvlay?XDEBUG_SESSION_START=14668', {
 //         axios.get('http://localhost:8000/api/shan/rmvlay?XDEBUG_SESSION_START=14668', {
            params:{
              layoutId: this.$store.getters.getCurrentLayoutId,
              cardId: this.cardId,
              orgId:this.$store.getters.getOrgId
            }
          })
              .then(response => {
                console.log(response);
                this.$emit('configurationHasBeenSaved');
              })
              .catch(e => {
                this.errors.push(e);
                console.log('remove card from layout failed');
              });

          break;
        }
        case 'DelCardFromDb':{
          console.log('remove from db selected');
          axios.get(apiPath+'api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
    //      axios.get('http://localhost:8000/api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
            params:{
              layoutId: this.$store.getters.getCurrentLayoutId,
              cardId: this.cardId,
              orgId:this.$store.getters.getOrgId
            }
          })
              .then(response => {
                console.log(response);
                this.$emit('configurationHasBeenSaved');
              })
              .catch(e => {
                this.errors.push(e);
                console.log('remove card from layout failed');
              });

          break;
        }


      }
    },
    dialogMenuSelected(msg){
      switch(msg[0]) {
        case 'Cancel':
          this.openDialog = false;
          break;
      }
    },
    linkSelected(msg){
      console.log('link selected', msg);
//      debugger;
      this.$emit('linkSelected', msg);
    },
    refId: function() {
      return "card" + this.cardId;
    },
    getCardProps() {
//      debugger;
      if ((typeof this.cardProperties === "undefined") | (this.cardProperties == "")) {
        return "";
      }else {
        var colonDelimiterLocatedAt= this.cardProperties.indexOf(":");
        var thisProp = this.cardProperties.substr(colonDelimiterLocatedAt+1);
        return thisProp;
      }
    },
    clearSearch(){
      sessionStorage.setItem('searchQuery', '');
      sessionStorage.setItem('searchActive', false);
      this.existingQuery = '';
      this.currentQuery = '';
    },
    submitSearchQuery(msg) {
      sessionStorage.setItem('searchQuery', msg);
      sessionStorage.setItem('searchActive', true);
      var advancedQueryObjectJson = '';
      if(this.advancedQuery){
        var thisAdvancedQueryObject = {};
            thisAdvancedQueryObject.keyWordSearch= this.keyWordSearch;
            thisAdvancedQueryObject.optSelected=this.optSelected;
            thisAdvancedQueryObject.fromDate = this.fromDate.replaceAll('-', '');
            thisAdvancedQueryObject.toDate = this.toDate.replaceAll('-', '');
            advancedQueryObjectJson=JSON.stringify(thisAdvancedQueryObject);
      }
      this.existingQuery = msg;
      this.currentQuery = msg;
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      axios.get(apiPath+'api/shan/solrSimpleQuery?XDEBUG_SESSION_START=14668', {
//      axios.get('http://localhost:8000/api/shan/solrSimpleQuery?XDEBUG_SESSION_START=14668', {
        params: {
          orgId: this.$store.getters.getOrgId,
          query: msg,
          advancedQuery: advancedQueryObjectJson
        }
      })
          .then(response => {
            console.log('search response',response);
            this.mode = this.LINK_MENU_SEARCH_MODE;
            this.searchMode = 'search';
            this.searchResults = response.data;
            console.log(this.searchResults);
            this.copyLinksToShow(this.startingLinkToShow) ;
            if(response.data.length>this.displayLimit){
//            if(this.cardContent.availableLinks.length>this.displayLimit){
              this.showPager=true;
            }else{
              this.showPager=false;
            }
          })
          .catch(e => {
            console.log(e, 'search query failed');
          });
    },

    searchTypeSelected(msg){
      console.log('searchTypeSelected', msg);
      debugger;
      this.searchMode = msg;
      switch(msg){
          case 'links':{
            this.mode = this.LINK_MENU_LINK_MODE;
            break;
          }
          case 'search':{
            this.mode = this.LINK_MENU_SEARCH_MODE;
            break;
          }
      }
    },
    advancedSearchSelected(msg){
      if(msg=='advancedSearch'){
        this.advancedQuery= true;
      }else{
        this.advancedQuery = false;
      }

    }
  }
};
</script>

<style scoped>
.cardStyle {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.cardHeader {
  display: flex;
  justify-content: space-evenly;
  width:100%;
  align-items: baseline;
  color: blue;
  height: 10%;
  background-color: #fff722;
  font-family: Geneva;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
.cardBody {
  height: 90%;
  margin:10px;
}
.textLeft {
  margin-left: 5px;
}

.textRight {
  margin-left: 70%;
}

.textCenter {
  margin-left: auto;
  margin-right: auto;
}

textarea {
  width: 100%;
  height: 70%;
  border: 3px solid #cccccc;
  padding: 5px;
  font-family: Tahoma, sans-serif;
}
.sub1 {
  font-family: Helvetica;
  font-size: small;
}
.verticalLabelCss {
  display:grid;
  grid-template-rows: 30% 60%;
  padding:5px;
}
.vLabelCss {
  color: blue;
  font-size: 12px;
  margin-right: 5px;
  font-weight: normal;

}


.flex-container {
  display: flex;
  justify-content: space-evenly;
  height: 100%;
  width:100%;
  align-items: baseline;
  margin-top: 6px;

}

.searchBox{
  padding: 10px;
}
.selectStyle {
  background: #DBAA6E;
  color:blue;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 3px;
  width: 60%;
}



</style>
