<template>
  <div >
    <div class="cardStyle" v-if="this.editStatus==false">
      <div class="cardHeader" v-if="displayStatus==false">
        <span class="textLeft">
          <a href="#" v-on:click="configureClicked" >Configure</a>
        </span>
        <span class="textRight">
          <a href="#"  v-on:click="editClicked" >Edit</a>
        </span>
      </div>
      {{ this.cardContent.linkMenuTitle }}
      <div v-bind:style='subStyle'>
        <span v-if="this.cardContent.orient=='vertical'">
          <div v-for="(link, index) in this.cardContent.availableLinks"
               :key="index">
            {{link.description}}
          </div>
        </span>
      </div>
    </div>
    <div class="cardStyle" v-if="this.editStatus==true">
      <div class="cardHeader" v-if="displayStatus==false">
        <span class="textLeft">
          <a href="#" v-on:click="configureClicked" >Configure</a>
        </span>
        <span class="textRight">
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
import menuOpt from "../components/menuOpt.vue";
export default {
  name: "linkMenu",
  components: {menuOpt},
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
    }
  },
  mounted(){
      this.subStyle = this.elementStyles.sub[0];
  },
  watch:{
    cmd: function() {
      console.log('linkMenu cmd changed-', this.cmd);
    },
    cardContent: function(){
      debugger;
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

    }
  },
  data() {
    return {
      cardMessage: this.getCardProps(),
      cardHasBeenSetup: false,
      cstyle: this.cardStyle,
      cardTitle:this.getCardProps(),
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
    editClicked(){
      debugger;
      this.loadCardConfiguration(this.cardId);
      this.$emit('textEditor', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'linkMenu']);
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

          this.editStatus=false;
          break;
        }
        case 'Save':{
          this.$emit('configSelected', ['title', this.cardTitle]);
          this.$emit('configSelected',['saveCardContent', this.cardTitle]);
          this.editStatus=false;
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
  height: 10%;
  background-color: #fff722;
  color: blue;
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
  text-align: center;
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

</style>
