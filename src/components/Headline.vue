<template>
  <div class="cardStyle">
    <div class="cardHeader" v-if="showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>

    <span v-if="this.mode==this.HEADLINE_EDIT" class="headline_wrapper">
        <span class="head_label">Headline:</span>
        <input type="text" v-model="cardTitle"  size="80" width="100%" />
    </span>
    <div v-if="this.mode==this.HEADLINE_SHOW" >
    <span class="headline" v-bind:style='headlineStyle'>
       {{ this.cardContent.linkMenuTitle }}
      </span>

      <span class="flex-container" v-bind:style='subStyle'>
            <m-link-hz v-for="(link, index) in this.cardContent.availableLinks"
                       :key="index"
                       :description="link.description"
                       :target="link.layout_link_to"
                       :is_external="link.isExternal"
                       :link_url="link.link_url"
                       @linkSelected="linkSelected"
            />
      </span>
    </div>

  </div>
</template>

<script>
import CardBase from "@/components/CardBase";
import menuOpt from "../components/menuOptV2.vue";
import mLinkHz from "../components/mLinkHz.vue"
import axios from "axios";

export default {
name: "Headline",
  extends: CardBase,
  components :{menuOpt, mLinkHz},
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
    },
  },
  mounted(){
    if (typeof(this.elementStyles) === 'undefined'){
      this.subStyle = '';
    }else{
      this.subStyle = this.elementStyles.sub[0];
    }
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
    var cardStyleElements = this.cardStyle.split(';');
    var hd = '';
    for(var h=1; h < cardStyleElements.length;h++){
      if(cardStyleElements[h].startsWith('font-size')|cardStyleElements[h].startsWith('font-family')|cardStyleElements[h].startsWith('color')|cardStyleElements[h].startsWith('font-style')|cardStyleElements[h].startsWith('font-weight')){
        hd = hd+cardStyleElements[h]+';';
      }
    }
    this.headlineStyle = hd.slice(0,-1);
    var mOpts = this.getMenuOpts('entryMenu_headline');
    this.currentMenuOpts = mOpts.currentMenuOpts;

  },
  data(){
    return {
      mode:0,
      HEADLINE_SHOW:0,
      HEADLINE_EDIT:1,
      HEADLINE_LINKS_EDIT:2,
      cardTitle:'',
      headlineStyle:'',
      editStatus:false,
      subStyle: '',
      subStyleChange:0,
      showOptions: false,
      currentMenuOpts:[],
      subContentStyling:{
        sub:{}
      },

      subContentConfiguration:{
        sub:{}
      },
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
  methods:{
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
    menuOptSelected(msg){
      debugger;
      console.log(msg);
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      switch(msg){
        case 'Configure':{
          this.configureClicked('linkMenu');
          break;
        }
        case 'Resize':{
          this.moveClicked();
          break;
        }
        case 'EditLinks':{
          this.editClicked();
          break;
        }
        case 'DeleteCard':{
          debugger;
          var mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'exitEdit':{
          this.$router.push({
            name: 'displayLayout',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
          break;
        }
        case 'Cancel':{
          mOpts = this.getMenuOpts('entryMenu');
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
        case 'EditHead':{
          console.log('EditHead selected');
          debugger;
          mOpts = this.getMenuOpts('headline_edit_content');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.HEADLINE_EDIT;
          break;
        }
        case 'backToHeadlineEntry':{
          mOpts = this.getMenuOpts('entryMenu_headline');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.HEADLINE_SHOW;
          break;
        }
        case 'saveHeadline':{
          axios.post(apiPath+'api/shan/updateCardTitle?XDEBUG_SESSION_START=17516', {
            cardTitle: this.cardTitle,
            org_id: this.$store.getters.getOrgId,
            layout_id: this.$store.getters.getCurrentLayoutId,
            card_instance_id:this.cardId,
          }).then(response=>
          {
            console.log(response);
            if(response.data=='ok'){
              this.$router.push({
                name: 'displayLayout',
                params: { layoutId: this.$store.getters.getCurrentLayoutId }
              })
            }
          }).catch(function(error) {
            alert('returned with an error');
            console.log(error);
          });
          break;
        }
      }
    },
    linkSelected(msg){
      console.log('link selected', msg);
//      debugger;
      this.$emit('linkSelected', msg);
    },
    editClicked(){
      debugger;
      this.loadCardConfiguration(this.cardId);
      this.$emit('textEditor', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'Headline', this.cardContent]);
    },

  }
}
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
.headline {
  display: flex;
  justify-content: space-evenly;
  height: 100%;
  width:100%;
  align-items: baseline;
  margin-top: 6px;
}
.headline_wrapper {
  margin-left: 20%;
}
.headline-edit {
  display: flex;
  justify-content: space-evenly;
  height: 100%;
  width:100%;
  align-items: baseline;
  margin-top: 6px;
}
.head_label {
  color: #0a3aff;
  font-family: Geneva;
  font-size: small;
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
