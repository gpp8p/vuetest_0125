<template>
  <div>
    <div class="cardStyle" v-if="this.editStatus==false">
      <div class="cardHeader" v-if="displayStatus==false">
        <span>
          <a href="#" v-on:click="configureClicked" >Configure</a>
        </span>
        <span>
          <a href="#" v-on:click="moveClicked" >Resize/Move</a>
        </span>
        <span>
          <a href="#"  v-on:click="editClicked" >Edit</a>
        </span>
      </div>
    {{ this.cardTitle }}
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
    }
  },
  watch:{
    cmd: function() {
      console.log('green component cmd changed-', this.cmd);
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
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
    editClicked(){
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
    menuOptSelected(msg){
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
