<template>
  <div>

    <div class="cardStyle" v-if="this.editStatus==false">

        <div class="cardHeader" v-if="showOptions==true">
          <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
        </div>
      {{ this.cardTitle }}
    </div>
    <span v-if="this.editStatus==true">
        <div class="cardHeader" v-if="showOptions==true">
          <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
        </div>
      <textarea type="textarea" v-model="cardTitle" width="100%"></textarea>
    </span>


    </div>

</template>

<script>
/* eslint-disable no-console,no-debugger */
import CardBase from "../components/CardBase.vue";
import menuOpt from "../components/menuOptV2.vue";
//import axios from "axios";
export default {
  name: "greenComponent",
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
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('entryMenu_greenComponent');
    this.currentMenuOpts = mOpts.currentMenuOpts;
  },
  watch:{
    cmd: function() {
      console.log('green component cmd changed-', this.cmd);
    },
    cmdObjectVersion: function() {
      console.log('cmdObvjectVersion has changed');
    }

  },
  data() {
    return {
      cardMessage: this.getCardProps(),
      cardHasBeenSetup: false,
      cstyle: this.cardStyle,
      cardTitle:this.getCardProps(),
      styling: {},
      content: {},
      configurationCurrentValues:{},
      dialog: false,
      testProp: false,
      tdialogMsg:'',
      editStatus:false,
      currentMenuOpts: ['Save', 'Cancel'],
      tCmd: this.cmdObject,
      showOptions:false,
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
      cardConfiguration: [
        {
          "label": "Card Appearance",
          "configurationElements": [

            {
              "type": "radio",
              "element": "backgroundTypeColor",
              "fieldName": "backgroundType",
              "prompt": "Background Type ?",
              "valueFrom":"backgroundTypeColor",
              "radioOptions": ['Color'],
              "onClick": [{ "type": "color", "element": "backgroundColor", "valueFrom":"backgroundColor", "prompt": "Background Color" }]
            },
            {
              "type": "radio",
              "element": "backgroundTypeImage",
              "fieldName": "backgroundType",
              "prompt": "Background Type ?",
              "valueFrom":"backgroundTypeImage",
              "radioOptions": ['Image'],
              "onClick": [{ "type": "file", "element": "backgroundImage", "prompt": "Upload -" }]
            },
            {
              "type": "checkbox", "element": "border", "valueFrom":"borderInclude", "prompt": "Include Border?",
              "onClick": [{
                "type": "select",
                "selectOptions": ['thin', 'medium', 'thick'],
                "valueFrom":"borderSize",
                "element": "borderSize",
                "prompt": "Size?"
              },
                { "type": "color", "valueFrom":"borderColor", "element": "borderColor", "prompt": "Color ?" }]
            },
            {
              "type": "checkbox", "element": "shadow", "valueFrom":"shadow", "prompt": "Shadow ?"
            },
            { "type": "checkbox", "element": "roundIncluded", "valueFrom":"roundIncluded", "prompt": "Round Corners ?" }
          ]
        },
        {
          "label": "Headline",
          "configurationElements": [
            { "type": "input", "element": "title", "valueFrom":"title", "fieldSize": "40", "prompt": "Enter Text:" }
          ]
        },
        {
          "label": "Text Attributes",
          "configurationElements": [
            { "type": "fontSelect", "valueFrom":"fontFamily", "element": "fontFamily", "prompt": "Select Font:" },
            {
              "type": "select",
              "selectOptions": ['10pt', '12pt', '18pt', '24pt', '36pt', '48pt', '72pt'],
              "valueFrom":"fontSize",
              "element": "fontSize",
              "prompt": "Size"
            },
            {
              "type": "select",
              "selectOptions": ['normal', 'bold', 'bolder', 'lighter'],
              "valueFrom":"fontWeight",
              "element": "fontWeight",
              "prompt": "Weight"
            },
            {
              "type": "select",
              "selectOptions": ['normal', 'italic', 'oblique'],
              "valueFrom":"fontStyle",
              "element": "fontStyle",
              "prompt": "Style"
            },
            {
              "type": "select",
              "selectOptions": ['left', 'center', 'right'],
              "valueFrom":"textAlign",
              "element": "textAlign",
              "prompt": "Align"
            },
            { "type": "color", "valueFrom":"color", "element": "color", "prompt": "Color:" }
          ]
        }
      ],
    }



  },

  methods: {
    showMsg(){
      debugger;
      this.tdialogMsg='message recieved';
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
        "greenComponent",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues,
      ]);



    },
*/
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
    editClicked(){
      var mOpts = this.getMenuOpts('editing');
      this.currentMenuOpts = mOpts.currentMenuOpts;

      this.editStatus = true;
      this.$emit("editClick", [
        "cardClicked",
        this.cardKey,
        "greenComponent",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues,
      ]);
    },
/*
    getMenuOpts(menuContext){
      switch(menuContext){
        case'entryMenu_greenComponent':{
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
        case 'editing':{
          return {
            currentMenuOpts :[
              ['Save', 'saveContent'],
              ['Cancel', 'Cancel']
            ],
            currentMenuSelection: 'Cancel'
          }
        }
      }
    },
*/
    menuOptSelected(msg){
      console.log(msg);
      switch(msg){
        case 'Cancel':{
          this.editStatus = false;
          var mOpts = this.getMenuOpts('entryMenu_greenComponent');
          this.currentMenuOpts = mOpts.currentMenuOpts;

          break;
        }
        case 'saveContent':{
          var titleValue = {
            title:this.cardTitle
          }
          this.$emit('configSelected', ['title', titleValue, 'main']);
          this.$emit('configSelected',['saveCardContent', titleValue, 'main']);
          this.editStatus=false;
          break;
        }
        case 'Configure':{
          this.configureClicked();
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
          mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay':{
          console.log('remove from layout selected');
          this.removeCardFromLayout(this.cardId);
/*
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
*/
          break;
        }
        case 'DelCardFromDb':{
          console.log('remove from db selected');
          this.DeleteCardFromDb(this.cardId);
/*
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
*/
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
  text-align: center;
}

textarea {
  width: 100%;
  height: 70%;
  border: 3px solid #cccccc;
  padding: 5px;
  font-family: Tahoma, sans-serif;
}

</style>
