<template>
  <div class="cardStyle ck-content scrollbar-hidden">
    <div class="cardHeader" v-if="showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <br/>
    <div v-if="this.mode==this.ENTER_METADATA">
      <meta-data-dialog @metaDataEntered='metaDataEntered' :cardContent="this.cardContent"></meta-data-dialog>
    </div>
    <span v-if="this.mode==this.SRC_UPLOAD" class="inputPlusLabel">
      <span class="labelStyle">Please upload the original source document:</span><file-upload :fileRole="this.srcFileRole" @selectedValue="srcFileSelected"></file-upload>
    </span>
    <div class="cardBody" v-if="this.mode==this.SHOW_TEXT" ref="textContent"  v-html="cardData">
    </div>
    <span v-if="this.mode==this.RICH_TEXT_EDITOR" id="ckeditSpan">
      <editor-ck
          :cardData="cardData"
          :cmd="cmd"
          :cmdObject="this.cObject"
          :cmdVersion="cObjectVersion"
          @saveContent="cardSaved"
          @updateContent="metaTransition"
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
import editorCk from '../components/editorCk.vue'
import menuOpt from "../components/menuOptV2.vue";
import MetaDataDialog from "../components/MetaDataDialog.vue";
import fileUpload from "../components/fileUpload.vue";
import axios from "axios";
//import axios from "axios";
export default {
  name: "textShow",
  extends: CardBase,
  components: {editorCk, menuOpt, MetaDataDialog, fileUpload},
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var existingQuery = '';
    console.log('textShow - activeQuery - ', sessionStorage.getItem('searchActive'), sessionStorage.getItem('searchQuery'));
    if(sessionStorage.getItem('searchActive')=='true'){
      existingQuery =sessionStorage.getItem('searchQuery');
      if(existingQuery.length>0){
        console.log('existingQuery - ', existingQuery);
        this.cardData=this.cardContent.cardText;
        var newSearchedExpression = "<span style='background-color: yellow; color:#ff0000;'>"+existingQuery+"</span>";
        this.cardData = this.cardData.replaceAll(existingQuery, newSearchedExpression);
        console.log('new card data -', this.cardData);
        console.log('inserting search tags');
      }else{
        this.cardData=this.cardContent.cardText;
      }

    }else{
      this.cardData=this.cardContent.cardText;
    }


//    this.cardData=this.cardContent.cardText;
    this.mode=this.SHOW_TEXT;
    var mOpts = this.getMenuOpts('entryMenu');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    console.log('mounted');
    this.$nextTick(() => {
      this.cheight = this.$refs.textContent.clientHeight;
      this.cwidth = this.$refs.textContent.clientWidth;
//      console.log(this.$refs.textContent.clientHeight);
//      console.log(this.$refs.textContent.clientWidth);
      if(typeof(this.cardContent.cardText)=='undefined' && this.displayStatus==false){
        this.editClicked();
        var mOpts = this.getMenuOpts('richTextOpen');
        this.currentMenuOpts = mOpts.currentMenuOpts;
        this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      }
    })

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
      cardData: '',
      originalCardData:'',
      styling: {},
      content: {},
      configurationCurrentValues: {},
      showOptions: false,
      mode: 0,
      ENTER_METADATA:2,
      RICH_TEXT_EDITOR: 1,
      SHOW_TEXT: 0,
      SRC_UPLOAD:7,
      currentMenuOpts: [],
      linkedLayoutId:0,
      cObject:{},
      cObjectVersion:0,
      srcFilePathUploaded:'',
      srcFileRole: 'document',
      cheight:0,
      cwidth:0

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
    cellClicked: function() {
//      debugger;
      this.styling={};
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
      if(this.cardData=='Click on this card to configure its appearence'){
        this.cardData = "";
      }

    },
    moveClicked(){
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
    editClicked(){
//      debugger;
      console.log('editClicked');
      this.logDim();
//      var editorHeight = this.height+275;
      var editorHeight = this.cheight+275;
//      var editorWidth = this.width+29;
      var editorWidth = this.cwidth+29;
      var editorHeightParam = editorHeight+'px';
      var editorWidthParam = editorWidth+'px';
      let root = document.documentElement;
      root.style.setProperty('--ck-height', editorHeightParam);
      root.style.setProperty('--ck-width', editorWidthParam);
//      this.showOptions=false;
      this.mode=this.RICH_TEXT_EDITOR;
//      this.loadCardConfiguration(this.cardId);
//      this.$emit('textEditor', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'textShow']);
    },
    logDim(){
      console.log('height-',this.height);
      console.log('width-', this.width);
    },
    refId: function() {
      return "card" + this.cardId;
    },
    getCardProps() {
 //     debugger;
      if ((typeof this.cardProperties === "undefined") | (this.cardProperties == "")) {
        return "Click on configure to set its appearence";
      }else {
        var colonDelimiterLocatedAt= this.cardProperties.indexOf(":");
        var thisProp = this.cardProperties.substr(colonDelimiterLocatedAt+1);
        return thisProp;
      }
    },
    cardSaved(){
      console.log('cardSaved event');
    },
    editorReady(msg){
      console.log('editorReady event');
      this.logDim();
      this.editorInstance = msg;
    },
    currentContent(msg){
      console.log('currentContent event-', msg);
      if(typeof(this.cardContent['documentType'])!=='undefined'){
        this.content.documentType= this.cardContent['documentType'];
      }
      if(typeof(this.cardContent['indexFile'])!=='undefined'){
        if(this.cardContent['indexFile']==1){
          this.content.indexFile=true;
        }else{
          this.content.indexFile=false;
        }
      }
      if(typeof(this.cardContent['accessType'])!=='undefined'){
        this.content.accessType = this.cardContent['accessType'];
      }
      debugger;
//      this.cardContent = msg;
      this.content.cardText = msg;
      this.content.cardType = 'textShow';
      if(typeof(this.cardContent['keyWords'])!='undefined'){
        this.content.keyWords=this.cardContent['keyWords'];
      }
      if(typeof(this.cardContent['createDate'])!='undefined'){
        this.content.createDate = this.cardContent['createDate'];
      }
      this.setCardData(this.content, 'saveCardContent', 'main');
//      this.mode=this.SHOW_TEXT;
      this.$router.push({
        name: 'displayLayout',
        params: { layoutId: this.$store.getters.getCurrentLayoutId }
      })
/*
      this.mode=this.RICH_TEXT_EDITOR;
      var mOpts = this.getMenuOpts('richTextOpen');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
*/
    },
    metaDataEntered(msg){
      console.log('metaDataEntered-',msg);
      this.content.documentType=msg.documentType;
      this.content.accessType=msg.accessType;
      this.cardContent.documentType=msg.documentType;
      this.cardContent.accessType=msg.accessType;
      this.content.indexFile=msg.indexFile;
      this.cardContent.indexFile=msg.indexFile;
      this.cardContent.keyWords=msg.keyWords;
      this.content.keyWords = msg.keyWords;
      this.cardContent.createDate = msg.createDate;
      this.content.createDate = msg.createDate;
      this.content.cardText = this.cardContent.cardText;
      this.content.cardType = 'textShow';
      this.content.removeDocumentFromIndex=msg.removeDocumentFromIndex;
      this.setCardData(this.content, 'saveCardContent', 'main');
      this.updateCardName(this.cardId, msg.cardName);
      var mOpts = this.getMenuOpts('richTextOpen');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode=this.RICH_TEXT_EDITOR;

    },
    metaTransition(msg){
      console.log(msg);
      this.cardData = msg;
      var mOpts = this.getMenuOpts('enteringMetaData');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode=this.ENTER_METADATA;
    },
    srcFileSelected(msg){
      console.log(msg);
      this.srcFilePathUploaded=msg[1];
//      this.mode=this.RICH_TEXT_EDITOR;
    },
    menuOptSelected(msg) {
      console.log(msg);
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      switch(msg){
        case 'Edit':{
          console.log('edit selected');
          this.logDim();
          var mOpts = this.getMenuOpts('richTextOpen');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.editClicked();
          break;
        }
        case 'exitEdit':{
          this.$router.push({
            name: 'displayLayout',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
          break;
        }
        case 'Resize':{
          this.moveClicked();
          break;
        }
        case 'Configure':{
          this.configureClicked('textShow');
          break;
        }
        case 'Cancel':{
          mOpts = this.getMenuOpts('entryMenu');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.cardData = this.cardContent.cardText;
          this.mode=this.SHOW_TEXT;
          break;
        }
        case 'Link to Another Space':{
          this.$emit('configSelected',['rtLink']);
          break;
        }
        case 'Insert the Link':{
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
            debugger;
            var urlBase = this.$store.getters.getUrlBase;
            if(typeof(this.layoutLink.id)=='undefined'){
              this.forwardToUrl = urlBase + 'displayLayout/'+ this.layoutLink;
            }else{
              this.forwardToUrl = urlBase + 'displayLayout/'+ this.layoutLink.id;
            }

            this.editorInstance.execute('link', this.forwardToUrl);
            //                  this.currentMenuOpts = ['Cancel', 'Link to Another Space',  'Save'];
            mOpts = this.getMenuOpts('richTextOpen');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;

//            this.titleMsg = 'Edit This Card';
          }
          break;

        }
        case 'Save':{
          debugger;
          this.cObject = {};
          this.cObject.action = 'save';
          this.cObject.linkedLayoutId = msg[1];
          console.log('save invoked in textShow-', this.cObject);
          this.cObjectVersion=this.cObjectVersion+1;
          break;
        }
         case 'DeleteCard':{
           mOpts = this.getMenuOpts('deleteChoice');
           this.currentMenuOpts = mOpts.currentMenuOpts;
           break;
         }
         case 'RmvLay':{
           console.log('remove from layout selected');



           axios.get(apiPath+'api/shan/rmvlay?XDEBUG_SESSION_START=14668', {
//             axios.get('http://localhost:8000/api/shan/rmvlay?XDEBUG_SESSION_START=14668', {
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
//           var apiPath = this.$store.getters.getApiBase;
//           console.log('apiPath - ',apiPath);


           axios.get(apiPath+'api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
//             axios.get('http://localhost:8000/api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
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
         case 'metaData':{
           this.cObject = {};
           this.cObject.action = 'update';
           this.cObjectVersion=this.cObjectVersion+1;
          //ckeditor will send updateContent event up containing current content so it can be saved

           break;
         }
        case 'SaveUpld':{
          this.content.srcFilePath = this.srcFilePathUploaded;
          this.srcFilePathUploaded = '';
          mOpts = this.getMenuOpts('richTextOpen');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.RICH_TEXT_EDITOR;
          break;
        }
        case 'CancelSourceUpload':{
          console.log('cancel src upload');

          axios.get(apiPath+'api/shan/removeUploadedFile?XDEBUG_SESSION_START=15122"', {
//          axios.get('http://localhost:8000/api/shan/removeUploadedFile?XDEBUG_SESSION_START=15122"', {
            params:{
              path: this.srcFilePathUploaded
            }
          }).then(response => {
            console.log(response);
            mOpts = this.getMenuOpts('entryMenu');
            this.currentMenuOpts = mOpts.currentMenuOpts;

            this.mode= this.SHOW_TEXT;
          }).catch(e => {
            console.log(e);
          });
          break;
        }
        case 'UpSource':{
          mOpts = this.getMenuOpts('source_upload_screen');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.SRC_UPLOAD;
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
                ['Remove from Page', 'RmvLay'],
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
  scrollbar-width:none;

}
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge add Firefox */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
}

.cardHeader {
  color: blue;
  height: 6%;
  background-color: #fff722;
  font-family: Geneva;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
.cardBody {
  height: 90%;
  margin:10px;
  scrollbar-width:none;


}

.cardFooter {
  height: 5%;
  width:100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center
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
