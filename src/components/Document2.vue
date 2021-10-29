<template>
  <div class="cardStyle ck-content">
    <div class="cardHeader" v-if="showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <br/>

    <div class="cardBody" v-if="this.mode==this.SHOW_TEXT" ref="textContent"  v-html="cardData">
    </div>
    <span v-if="this.mode==this.SETUP" class="selectDefaults">
      <span>
        <text-field :p-type="inputFieldReference" :dialogKey="this.dKey" :label="inputFieldLabel" :currentValues="this.cardContent" :textStyle="this.cardNameStyling"></text-field>
      </span>
      <span>
        <select-picker :pType="documentTypeReference" :dialogKey="this.dKey" :label="documentTypeLabel" :options="documentTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></select-picker>
      </span>
      <span>
        <select-picker :pType="fileTypeReference" :dialogKey="this.dKey" :label="fileTypeLabel" :options="fileTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></select-picker>
      </span>
      <span>
        <select-picker :pType="accessTypeReference" :dialogKey="this.dKey" :label="accessTypeLabel" :options="accessTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></select-picker>
      </span>
      <span>
        <input-checkbox :pType="indexTypeReference" :dialogKey="this.dKey" :label="indexLabel" :options="accessTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></input-checkbox>
      </span>
    </span>
    <span v-if="this.mode==this.RICH_TEXT_EDITOR" ref="textContent">
      <editor-ck
          :cardData="cardData"
          :cmd="cmd"
          :cmdObject="this.cObject"
          :cmdVersion="cObjectVersion"
          @saveContent="cardSaved"
          @editorReady="editorReady"
          @currentContent="currentContent"
          @imageInsert = "imageInsert"
      ></editor-ck>
    </span>

  </div>
</template>

<script>
/* eslint-disable no-console,no-debugger */
import CardBase from "../components/CardBase.vue";
import selectPicker from "@/components/selectPicker";
//import inputField from "@/components/inputField";
import textField from "@/components/textField";
import inputCheckbox from "@/components/inputCheckbox"
import editorCk from '../components/editorCk.vue'
import menuOpt from "../components/menuOptV2.vue";
import axios from "axios";
//import axios from "axios";
export default {
  name: "Document",
  extends: CardBase,
  components: {editorCk, menuOpt, selectPicker, inputCheckbox, textField},
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }

    if(typeof(this.cardContent['title'])!=='undefined'){
      this.title= this.cardContent['title'];
    }
    if(typeof(this.cardContent['cardText'])!=='undefined'){
      this.cardData= this.cardContent['cardText'];
    }
    if(typeof(this.cardContent['documentType'])!=='undefined'){
      this.documentType= this.cardContent['documentType'];
    }
    if(typeof(this.cardContent['fileType'])!=='undefined'){
      this.fileType= this.cardContent['fileType'];
    }
    if(typeof(this.cardContent['cardText'])!=='undefined'){
      this.cardData= this.cardContent['cardText'];
    }
    if(typeof(this.cardContent['indexFile'])!=='undefined'){
      if(this.cardContent['indexFile']==1){
        this.indexFile=true;
      }else{
        this.indexFile=false;
      }
    }
    debugger;
    var contentPropertiesLength =Object.keys(this.cardContent).length;
    if(contentPropertiesLength>1){
      var mOpts = this.getMenuOpts('archive_edit');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.loadCardConfiguration(this.cardId);
      this.mode = this.SHOW_TEXT;
    }else{
      mOpts = this.getMenuOpts('archive_entry');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode =this.SHOW_TEXT;
    }


  },
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
    cmd:{
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
  computed: {
    height () {
      return this.$refs.textContent.clientHeight
    },
    width() {
      return this.$refs.textContent.clientWidth
    }
  },
  data() {
    return {
      editorInstance:{},
      cardMessage: this.getCardProps(),
      cardHasBeenSetup: false,
      cstyle: this.cardStyle,
      cardData: this.cardContent.cardText,
      styling: {},
      content: {},
      configurationCurrentValues: {},
      showOptions: false,
      mode: 0,
      SETUP:2,
      RICH_TEXT_EDITOR: 1,
      SHOW_TEXT: 0,
      currentMenuOpts: [],
      linkedLayoutId:0,
      cObject:{},
      cObjectVersion:0,

      title:'',
      documentType:'',
      fileType:'',
      currentValues:{},
      inputFieldLabel: 'Card Name:',
      inputFieldReference: 'card_name',
      documentTypeReference:'documentType',
      documentTypeLabel: 'Document Type:',
      documentTypeOptions:[],
      fileTypeReference:'fileType',
      fileTypeLabel:'File Type:',
      fileTypeOptions:[],
      accessTypeReference:'accessType',
      accessTypeLabel:'Access:',
      AccessTypeOptions:[],
      accessType:'',
      indexLabel:'Index Document ?',
      indexTypeReference:'indexFile',
      indexFile:false,

      cardNameStyling: 'font-family:Geneva;font-size:12px;font-style:normal;font-weight:bold;',
      accessTypeOptions:[],

    }

  },

  watch:{
/*
    cmd: function(){
      console.log('textShow cmd changed-', this.cmd);
      var parsedCmd = JSON.parse(this.cmd);
      debugger;
      switch(parsedCmd.action){
        case 'addLink':{
          this.linkedLayoutId = parsedCmd.linkedLayoutId;
          var mOpts = this.getMenuOpts('insertLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'save':{
          break;
        }
      }
    }
*/
    cmdObjectVersion: function(){
      debugger;
      switch(this.cmdObject.action){
        case 'addLink':{
          var mOpts = this.getMenuOpts('insertLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.layoutLink = this.cmdObject.linkedLayoutId;
          break;
        }
      }
    }

  },

  methods: {
    cellClicked: function () {
//      debugger;
      this.styling = {};
      this.loadCardConfiguration(this.cardId);
//      debugger;
      this.$emit("cardClick", [
        "cardClicked",
        this.cardKey,
        "textShow",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues
      ]);
      if (this.cardData == 'Click on this card to configure its appearence') {
        this.cardData = "";
      }

    },
    moveClicked() {
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
    /*
    imageInsert(msg){

//        var targetUrl = 'http://localhost:8080/displayLayout/'+targetId;
        axios.post('http://localhost:8000/api/shan/createNewLink?XDEBUG_SESSION_START=17516', {
          org_id: this.$store.getters.getOrgId,
          layout_id: this.$store.getters.getCurrentLayoutId,
          description: 'image link',
          card_instance_id:this.cardId,
          is_external:0,
          layout_link_to:0,
          linkUrl:msg,
          type:'I'
        }).then(response=>
        {
          console.log('image insert link created',response);
          if(response.data=='ok'){
//           this.mode=this.DIALOG_OFF;
//            this.$emit('configSelected',['reload']);
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
*/
    editClicked() {
      debugger;
      this.mode = this.RICH_TEXT_EDITOR;
      console.log('height-', this.height);
      var editorHeight = this.height + 275;
      var editorWidth = this.width + 29;
      var editorHeightParam = editorHeight + 'px';
      var editorWidthParam = editorWidth + 'px';
      let root = document.documentElement;
      root.style.setProperty('--ck-height', editorHeightParam);
      root.style.setProperty('--ck-width', editorWidthParam);
//      this.showOptions=false;

//      this.loadCardConfiguration(this.cardId);
//      this.$emit('textEditor', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'textShow']);
    },
    refId: function () {
      return "card" + this.cardId;
    },
    getCardProps() {
      //     debugger;
      if ((typeof this.cardProperties === "undefined") | (this.cardProperties == "")) {
        return "Click on configure to set its appearence";
      } else {
        var colonDelimiterLocatedAt = this.cardProperties.indexOf(":");
        var thisProp = this.cardProperties.substr(colonDelimiterLocatedAt + 1);
        return thisProp;
      }
    },
    cardSaved() {
      console.log('cardSaved event');
    },
    editorReady(msg) {
      console.log('editorReady event');
      this.editorInstance = msg;
    },
    currentContent(msg) {
      console.log('currentContent event');
      this.cardContent = msg;
      this.content.cardText = this.cardContent;
      this.content.title= this.title;
      this.content.fileType = this.fileType;
      this.content.documentType=this.documentType;
      this.content.indexFile= this.indexFile;
      this.content.accessType=this.accessType;
      this.content.cardType='Document';
      this.setCardData(this.content, 'saveCardContent', 'main');
      this.mode = this.SHOW_TEXT;
      var mOpts = this.getMenuOpts('entryMenu');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
    },
    loadOptions() {
      axios.get('http://localhost:8000/api/shan/documentDefaults?XDEBUG_SESSION_START=14668', {})
          .then(response => {
            console.log(response);
            this.documentTypeOptions = [];
            this.fileTypeOptions = [];
            this.accessTypeOptions = []
            response.data.documentTypes.forEach((val, index) => {
              console.log('Index: ' + index + ' Value: ' + val.document_type);
              this.documentTypeOptions.push(val.document_type);
            });
            response.data.fileTypes.forEach((val, index) => {
              console.log('Index: ' + index + ' Value: ' + val.file_type);
              this.fileTypeOptions.push(val.file_type);
            });
            response.data.accessTypes.forEach((val, index) => {
              console.log('Index: ' + index + ' Value: ' + val.access_type);
              this.accessTypeOptions.push(val.access_type);
            });
            var mOpts = this.getMenuOpts('document_setup');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.mode = this.SETUP;

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });

    },
    configSelected(msg) {
      console.log('configSelected', msg);
      switch (msg[0]) {
        case 'val': {
          this.title = msg[1];
          break;
        }
        case 'documentType': {
          this.documentType = msg[1];
          break;
        }
        case 'fileType': {
          this.fileType = msg[1];
          break;
        }
        case 'accessType': {
          this.accessType = msg[1];
          break;
        }
        case 'checkbox': {
          if (msg[1] == 'activated') {
            this.indexFile = 1;
          } else {
            this.indexFile = 0;
          }

        }
      }
      console.log(msg);
    },
    nextClicked() {
      debugger;
      var errorMsg = 'Missing Fields:';
      var entryError = false;
      if (this.title == '') {
        errorMsg = errorMsg + 'Title, '
        entryError = true;
      }
      if (this.documentType == '') {
        errorMsg = errorMsg + 'Document Type, '
        entryError = true;
      }
      if (this.fileType == '') {
        errorMsg = errorMsg + 'File Type '
        entryError = true;
      }
      if (entryError) {
        this.message = errorMsg + "<- Please enter";
        this.showOptions = false;
        this.showMessage = true;
      } else {
//        debugger;
        this.currentValues['title'] = this.title;
        this.currentValues['documentType'] = this.documentType;
        this.currentValues['fileType'] = this.fileType;
        var mOpts = this.getMenuOpts('archive_entry');
        this.currentMenuOpts = mOpts.currentMenuOpts;
//        this.mode = this.ARCHIVE_BLANK;
        this.showOptions = true;
        this.showMessage = false;
      }
      console.log('next has been clicked!');
    },
    menuOptSelected(msg) {
      console.log(msg);
      switch (msg) {
        case 'EditDoc': {
          this.nextClicked();
          switch (this.fileType) {
            case 'Rich Text HTML': {
              var mOpts = this.getMenuOpts('richTextOpen');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.editClicked();
              break;
            }
          }
          break;
        }
        case 'NewDoc': {
          this.loadOptions();
          break;
        }
        case 'Resize': {
          this.moveClicked();
          break;
        }
        case 'Configure': {
          this.configureClicked('textShow');
          break;
        }
        case 'Cancel': {
          mOpts = this.getMenuOpts('entryMenu');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode = this.SHOW_TEXT;
          break;
        }
        case 'exitEdit':{
          this.$router.push({
            name: 'displayLayout',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
          break;
        }
        case 'Link to Another Space': {
          this.$emit('configSelected', ['rtLink']);
          break;
        }
        case 'Insert the Link': {
          debugger;
          var textHasBeenSelected = false;
          const selection = this.editorInstance.model.document.selection;
          const range = selection.getFirstRange();
//                  const range = this.currentSelectedRange;

          for (const item of range.getItems()) {
            console.log(item.data) //return the selected text
            textHasBeenSelected = true;
          }
          if (!textHasBeenSelected) {
            this.titleMsg = 'Please select some text!';
          } else {
            this.forwardToUrl = "http://localhost:8080/displayLayout/" + this.layoutLink;
            this.editorInstance.execute('link', this.forwardToUrl);
            //                  this.currentMenuOpts = ['Cancel', 'Link to Another Space',  'Save'];
            mOpts = this.getMenuOpts('richTextOpen');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
          }
          break;

        }
        case 'Save': {
          debugger;
          this.cObject = {};
          this.cObject.action = 'save';
          this.cObject.linkedLayoutId = msg[1];
          this.cObjectVersion = this.cObjectVersion + 1;
          break;
        }
        case 'DeleteCard': {
          mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay': {
          console.log('remove from layout selected');
          axios.get('http://localhost:8000/api/shan/rmvlay?XDEBUG_SESSION_START=14668', {
            params: {
              layoutId: this.$store.getters.getCurrentLayoutId,
              cardId: this.cardId,
              orgId: this.$store.getters.getOrgId
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
        case 'DelCardFromDb': {
          console.log('remove from db selected');
          axios.get('http://localhost:8000/api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
            params: {
              layoutId: this.$store.getters.getCurrentLayoutId,
              cardId: this.cardId,
              orgId: this.$store.getters.getOrgId
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
    /*
    getMenuOpts(menuContext){
//              debugger;
//      console.log('Dialog2 getMenuOpts menuContext:', menuContext);
      switch(menuContext){
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
*/

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
.cardFooter {
  height: 5%;
  width:100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center
}
.selectDefaults{
  display:grid;
  grid-template-rows: 20% 20% 20% 20%;
  margin-left: 60px;
  margin-top: 30px;
}

:root {
  --ck-color-mention-background: hsla(341, 100%, 30%, 0.1);
  --ck-color-mention-text: hsl(341, 100%, 30%);
  --ck-highlight-marker-blue: hsl(201, 97%, 72%);
  --ck-highlight-marker-green: hsl(120, 93%, 68%);
  --ck-highlight-marker-pink: hsl(345, 96%, 73%);
  --ck-highlight-marker-yellow: hsl(60, 97%, 73%);
  --ck-highlight-pen-green: hsl(112, 100%, 27%);
  --ck-highlight-pen-red: hsl(0, 85%, 49%);
  --ck-image-style-spacing: 1.5em;
  --ck-todo-list-checkmark-size: 16px;
}

/* ckeditor5-image/theme/imageresize.css */
.ck-content .image.image_resized {
  max-width: 100%;
  display: block;
  box-sizing: border-box;
}
/* ckeditor5-image/theme/imageresize.css */
.ck-content .image.image_resized img {
  width: 100%;
}
/* ckeditor5-image/theme/imageresize.css */
.ck-content .image.image_resized > figcaption {
  display: block;
}
/* ckeditor5-image/theme/imagestyle.css */
.ck-content .image-style-side {
  float: right;
  margin-left: var(--ck-image-style-spacing);
  max-width: 50%;
}
/* ckeditor5-image/theme/imagestyle.css */
.ck-content .image-style-align-left {
  float: left;
  margin-right: var(--ck-image-style-spacing);
}
/* ckeditor5-image/theme/imagestyle.css */
.ck-content .image-style-align-center {
  margin-left: auto;
  margin-right: auto;
}
/* ckeditor5-image/theme/imagestyle.css */
.ck-content .image-style-align-right {
  float: right;
  margin-left: var(--ck-image-style-spacing);
}
/* ckeditor5-image/theme/image.css */
.ck-content .image {
  display: table;
  clear: both;
  text-align: center;
  margin: 1em auto;
}
/* ckeditor5-image/theme/image.css */
.ck-content .image img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  min-width: 50px;
}
/* ckeditor5-image/theme/imagecaption.css */
.ck-content .image > figcaption {
  display: table-caption;
  caption-side: bottom;
  word-break: break-word;
  color: hsl(0, 0%, 20%);
  background-color: hsl(0, 0%, 97%);
  padding: .6em;
  font-size: .75em;
  outline-offset: -1px;
}
/* ckeditor5-highlight/theme/highlight.css */
.ck-content .marker-yellow {
  background-color: var(--ck-highlight-marker-yellow);
}
/* ckeditor5-highlight/theme/highlight.css */
.ck-content .marker-green {
  background-color: var(--ck-highlight-marker-green);
}
/* ckeditor5-highlight/theme/highlight.css */
.ck-content .marker-pink {
  background-color: var(--ck-highlight-marker-pink);
}
/* ckeditor5-highlight/theme/highlight.css */
.ck-content .marker-blue {
  background-color: var(--ck-highlight-marker-blue);
}
/* ckeditor5-highlight/theme/highlight.css */
.ck-content .pen-red {
  color: var(--ck-highlight-pen-red);
  background-color: transparent;
}
/* ckeditor5-highlight/theme/highlight.css */
.ck-content .pen-green {
  color: var(--ck-highlight-pen-green);
  background-color: transparent;
}
/* ckeditor5-font/theme/fontsize.css */
.ck-content .text-tiny {
  font-size: .7em;
}
/* ckeditor5-font/theme/fontsize.css */
.ck-content .text-small {
  font-size: .85em;
}
/* ckeditor5-font/theme/fontsize.css */
.ck-content .text-big {
  font-size: 1.4em;
}
/* ckeditor5-font/theme/fontsize.css */
.ck-content .text-huge {
  font-size: 1.8em;
}
/* ckeditor5-block-quote/theme/blockquote.css */
.ck-content blockquote {
  overflow: hidden;
  padding-right: 1.5em;
  padding-left: 1.5em;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  border-left: solid 5px hsl(0, 0%, 80%);
}
/* ckeditor5-block-quote/theme/blockquote.css */
.ck-content[dir="rtl"] blockquote {
  border-left: 0;
  border-right: solid 5px hsl(0, 0%, 80%);
}
/* ckeditor5-basic-styles/theme/code.css */
.ck-content code {
  background-color: hsla(0, 0%, 78%, 0.3);
  padding: .15em;
  border-radius: 2px;
}
/* ckeditor5-table/theme/table.css */
.ck-content .table {
  margin: 1em auto;
  display: table;
}
/* ckeditor5-table/theme/table.css */
.ck-content .table table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  height: 100%;
  border: 1px double hsl(0, 0%, 70%);
}
/* ckeditor5-table/theme/table.css */
.ck-content .table table td,
.ck-content .table table th {
  min-width: 2em;
  padding: .4em;
  border: 1px solid hsl(0, 0%, 75%);
}
/* ckeditor5-table/theme/table.css */
.ck-content .table table th {
  font-weight: bold;
  background: hsla(0, 0%, 0%, 5%);
}
/* ckeditor5-table/theme/table.css */
.ck-content[dir="rtl"] .table th {
  text-align: right;
}
/* ckeditor5-table/theme/table.css */
.ck-content[dir="ltr"] .table th {
  text-align: left;
}
/* ckeditor5-page-break/theme/pagebreak.css */
.ck-content .page-break {
  position: relative;
  clear: both;
  padding: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* ckeditor5-page-break/theme/pagebreak.css */
.ck-content .page-break::after {
  content: '';
  position: absolute;
  border-bottom: 2px dashed hsl(0, 0%, 77%);
  width: 100%;
}
/* ckeditor5-page-break/theme/pagebreak.css */
.ck-content .page-break__label {
  position: relative;
  z-index: 1;
  padding: .3em .6em;
  display: block;
  text-transform: uppercase;
  border: 1px solid hsl(0, 0%, 77%);
  border-radius: 2px;
  font-family: Helvetica, Arial, Tahoma, Verdana, Sans-Serif;
  font-size: 0.75em;
  font-weight: bold;
  color: hsl(0, 0%, 20%);
  background: hsl(0, 0%, 100%);
  box-shadow: 2px 2px 1px hsla(0, 0%, 0%, 0.15);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/* ckeditor5-media-embed/theme/mediaembed.css */
.ck-content .media {
  clear: both;
  margin: 1em 0;
  display: block;
  min-width: 15em;
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list {
  list-style: none;
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list li {
  margin-bottom: 5px;
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list li .todo-list {
  margin-top: 5px;
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list .todo-list__label > input {
  -webkit-appearance: none;
  display: inline-block;
  position: relative;
  width: var(--ck-todo-list-checkmark-size);
  height: var(--ck-todo-list-checkmark-size);
  vertical-align: middle;
  border: 0;
  left: -25px;
  margin-right: -15px;
  right: 0;
  margin-left: 0;
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list .todo-list__label > input::before {
  display: block;
  position: absolute;
  box-sizing: border-box;
  content: '';
  width: 100%;
  height: 100%;
  border: 1px solid hsl(0, 0%, 20%);
  border-radius: 2px;
  transition: 250ms ease-in-out box-shadow, 250ms ease-in-out background, 250ms ease-in-out border;
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list .todo-list__label > input::after {
  display: block;
  position: absolute;
  box-sizing: content-box;
  pointer-events: none;
  content: '';
  left: calc( var(--ck-todo-list-checkmark-size) / 3 );
  top: calc( var(--ck-todo-list-checkmark-size) / 5.3 );
  width: calc( var(--ck-todo-list-checkmark-size) / 5.3 );
  height: calc( var(--ck-todo-list-checkmark-size) / 2.6 );
  border-style: solid;
  border-color: transparent;
  border-width: 0 calc( var(--ck-todo-list-checkmark-size) / 8 ) calc( var(--ck-todo-list-checkmark-size) / 8 ) 0;
  transform: rotate(45deg);
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list .todo-list__label > input[checked]::before {
  background: hsl(126, 64%, 41%);
  border-color: hsl(126, 64%, 41%);
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list .todo-list__label > input[checked]::after {
  border-color: hsl(0, 0%, 100%);
}
/* ckeditor5-list/theme/todolist.css */
.ck-content .todo-list .todo-list__label .todo-list__label__description {
  vertical-align: middle;
}
/* ckeditor5-html-embed/theme/htmlembed.css */
.ck-content .raw-html-embed {
  margin: 1em auto;
  min-width: 15em;
  font-style: normal;
}
/* ckeditor5-horizontal-line/theme/horizontalline.css */
.ck-content hr {
  margin: 15px 0;
  height: 4px;
  background: hsl(0, 0%, 87%);
  border: 0;
}
/* ckeditor5-code-block/theme/codeblock.css */
.ck-content pre {
  padding: 1em;
  color: hsl(0, 0%, 20.8%);
  background: hsla(0, 0%, 78%, 0.3);
  border: 1px solid hsl(0, 0%, 77%);
  border-radius: 2px;
  text-align: left;
  direction: ltr;
  tab-size: 4;
  white-space: pre-wrap;
  font-style: normal;
  min-width: 200px;
}
/* ckeditor5-code-block/theme/codeblock.css */
.ck-content pre code {
  background: unset;
  padding: 0;
  border-radius: 0;
}
/* ckeditor5-mention/theme/mention.css */
.ck-content .mention {
  background: var(--ck-color-mention-background);
  color: var(--ck-color-mention-text);
}
@media print {
  /* ckeditor5-page-break/theme/pagebreak.css */
  .ck-content .page-break {
    padding: 0;
  }
  /* ckeditor5-page-break/theme/pagebreak.css */
  .ck-content .page-break::after {
    display: none;
  }
}



</style>
