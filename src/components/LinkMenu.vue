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

      <div v-bind:style='subStyle'>
        <span v-if="this.cardContent.orient=='vertical'" >
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
        <span v-if="this.cardContent.orient=='horozontal'" class="flex-container">
            <m-link-hz v-for="(link, index) in this.cardContent.availableLinks"
                    :key="index"
                    :description="link.description"
                    :target="link.layout_link_to"
                    :is_external="link.is_external"
                    @linkSelected="linkSelected"
            />
        </span>
      </div>
    </div>
    <div class="cardStyle" v-if="this.editStatus==true">
      <div class="cardHeader" v-if="displayStatus==false">
        <span>
          <a href="#" v-on:click="configureClicked" >Configure</a>
        </span>
        <span>
          <a href="#"  v-on:click="editClicked" >Edit</a>
        </span>
      </div>
      <span>
        <textarea type="textarea" v-model="cardTitle" width="100%"></textarea>
        <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
      </span>


    </div>
  </div>
</template>

<script>
/* eslint-disable no-console,no-debugger */
import CardBase from "../components/CardBase.vue";
import menuOpt from "../components/menuOptV2.vue";
import mLink from "../components/mLink.vue";
import mLinkHz from "../components/mLinkHz.vue"
import axios from "axios";
export default {
  name: "linkMenu",
  components: {menuOpt, mLink, mLinkHz},
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
      debugger;
      if (typeof(this.elementStyles) === 'undefined'){
        this.subStyle = '';
      }else{
        this.subStyle = this.elementStyles.sub[0];
      }


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
      var mOpts = this.getMenuOpts('entryMenu');
      this.currentMenuOpts = mOpts.currentMenuOpts;




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
//      debugger;
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
        case 'deleteChoice':{
          return {
            currentMenuOpts :[
              ['Remove from Layout', 'RmvLay'],
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
//      debugger;
      this.loadCardConfiguration(this.cardId);
      this.$emit('textEditor', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'linkMenu', this.cardContent]);
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
        case 'DeleteCard':{
          var mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay':{
          console.log('remove from layout selected');
          axios.get('http://localhost:8000/api/shan/rmvlay?XDEBUG_SESSION_START=14668', {
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
          axios.get('http://localhost:8000/api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
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
//      console.log('link selected', msg);
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


.flex-container {
  display: flex;
  justify-content: space-evenly;
  height: 100%;
  width:100%;
  align-items: baseline;
  margin-top: 6px;

}

</style>
