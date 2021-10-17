<template>
  <span class="cardStyle" >
    <div class="cardHeader" v-if="this.showOptions==true">
        <menu-opt :mOpts="currentMenuOpts"  @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <div class="cardHeader msgHeader" v-if="this.showMessage==true">
      {{this.message}}
    </div>
    <span v-if="this.mode==this.ARCHIVE_SELECT_DEFAULTS" class="selectDefaults">
      <span>
        <input-field :p-type="inputFieldReference" :dialogKey="this.dKey" :label="inputFieldLabel" :currentValues="this.cardContent" @configSelected="configSelected"></input-field>
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
    <span v-if="this.mode==this.ARCHIVE_RT_EDITOR" ref="textContent">
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
    <span v-if="this.mode==this.ARCHIVE_SHOW_RT" v-html="cardData">
    </span>
    </span>
</template>

<script>
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";
import selectPicker from "@/components/selectPicker";
import inputField from "@/components/inputField";
import inputCheckbox from "@/components/inputCheckbox"
import editorCk from '../components/editorCk.vue'
import axios from "axios";


export default {
  name: "Document",
  extends: CardBase,
  components: {menuOpt, selectPicker, inputField, editorCk, inputCheckbox},
  mounted(){
    console.log('DSocument mounted');
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
//    this.loadCardConfiguration(this.cardId);
    this.mode = this.ARCHIVE_BLANK;
    console.log('cardContent.title:',this.cardContent['title']);
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
    if(this.cardContent.length==0){
      var mOpts = this.getMenuOpts('archive_entry');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.loadCardConfiguration(this.cardId);
      this.mode = this.ARCHIVE_BLANK;
    }else{
      mOpts = this.getMenuOpts('archive_edit');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode =this.ARCHIVE_SHOW_RT;
    }
//    this.mode=this.ARCHIVE_SHOW_RT;
  },
  data(){
    return {
      showOptions:false,
      showMessage:false,
      message:'',
      styling: {},
      documentType:'',
      fileType:'',
      currentValues:{},
      currentMenuOpts:[],
      configurationCurrentValues:{},
      title:'',
      inputFieldLabel: 'Title:',
      inputFieldReference: 'title',
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
      cardData:'',

      accessTypeOptions:[],
      mode:0,
      ARCHIVE_BLANK:0,
      ARCHIVE_SELECT_DEFAULTS:1,
      ARCHIVE_RT_EDITOR:2,
      ARCHIVE_SHOW_RT:3,
      cObject:{},
      cObjectVersion:0,
      content: {},




    }
  },
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    },
    cmd: {
      type: String,
      required: false
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
    cardContent:{
      type: Object,
      required: true
    },
  },
  computed: {
    height () {
      return this.$refs.textContent.clientHeight
    },
    width() {
      return this.$refs.textContent.clientWidth
    }
  },
  methods: {
    menuOptSelected(msg) {
      console.log(msg);
      switch (msg) {
        case 'Cancel': {
          this.editStatus = false;
          var mOpts = this.getMenuOpts('archive_entry');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'Configure':{
          this.configureClicked('archive');
          break;
        }
        case 'Resize': {
//          debugger;
          this.moveClicked();
          break;
        }
        case 'DeleteCard': {
          mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay': {
          console.log('remove from layout selected');
          this.removeCardFromLayout(this.cardId);
          break;
        }
        case 'DelCardFromDb': {
          console.log('remove from db selected');
          this.deleteCardFromDb(this.cardId);
          break;
        }
        case 'CancelDocumentSetup':{
          mOpts = this.getMenuOpts('archive_entry');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.ARCHIVE_BLANK;
          break;
        }
        case 'NewDoc':{
          this.loadOptions();
          break;
        }
        case 'EditDoc':{
          debugger;
          switch(this.fileType){
            case 'Rich Text HTML':{
              this.mode=this.ARCHIVE_RT_EDITOR;
              break;
            }
          }
          break;
        }
        case 'ChangeSetup':{
          this.loadOptions();
          this.mode=this.ARCHIVE_SELECT_DEFAULTS;
          break;
        }
        case 'DocumentSave':{
          this.cObject = {};
          this.cObject.action = 'save';
          this.cObject.linkedLayoutId = msg[1];
          this.cObjectVersion=this.cObjectVersion+1;
          break;
        }
        case 'Document_rte_Back':{
          mOpts = this.getMenuOpts('document_setup');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.ARCHIVE_SELECT_DEFAULTS;
          break;
        }
        case 'DocumentEntry':{
          debugger;
          this.nextClicked()
          switch(this.fileType){
            case 'Rich Text HTML':{
              mOpts = this.getMenuOpts('document_rt_entry');
              this.currentMenuOpts = mOpts.currentMenuOpts;
              this.mode = this.ARCHIVE_RT_EDITOR;
              var editorHeight = this.height+275;
              var editorWidth = this.width+29;
              var editorHeightParam = editorHeight+'px';
              var editorWidthParam = editorWidth+'px';
              console.log('editorHeight',editorHeightParam );
              console.log('editorWidth',editorWidthParam );
              let root = document.documentElement;
              root.style.setProperty('--ck-height', editorHeightParam);
              root.style.setProperty('--ck-width', editorWidthParam);
              break;
            }
          }
          break;
        }
      }
    },
    currentContent(msg){
      console.log('currentContent event',msg);
      this.cardContent = msg;
      this.content.cardText = this.cardContent;
      this.content.title= this.title;
      this.content.fileType = this.fileType;
      this.content.documentType=this.documentType;
      this.content.indexFile= this.indexFile;
      this.content.accessType=this.accessType;
      this.content.cardType='Document';

      this.setCardData(this.content, 'saveCardContent', 'main');

    },
    loadOptions(){
      axios.get('http://localhost:8000/api/shan/documentDefaults?XDEBUG_SESSION_START=14668', {
      })
          .then(response => {
            console.log(response);
            this.documentTypeOptions=[];
            this.fileTypeOptions=[];
            this.accessTypeOptions=[]
            response.data.documentTypes.forEach((val, index) =>{
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
            this.mode=this.ARCHIVE_SELECT_DEFAULTS;

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });

    },
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
    configSelected(msg){
      console.log('configSelected',msg);
      switch(msg[0]){
        case 'val':{
          this.title = msg[1];
          break;
        }
        case 'documentType':{
          this.documentType = msg[1];
          break;
        }
        case 'fileType':{
          this.fileType = msg[1];
          break;
        }
        case 'accessType':{
          this.accessType = msg[1];
          break;
        }
        case 'checkbox':{
          if(msg[1]=='activated'){
            this.indexFile = 1;
          }else{
            this.indexFile = 0;
          }

        }
      }
      console.log(msg);
    },
    nextClicked(){
//      debugger;
      var errorMsg = 'Missing Fields:';
      var entryError=false;
      if(this.title==''){
        errorMsg = errorMsg + 'Title, '
        entryError = true;
      }
      if(this.documentType==''){
        errorMsg = errorMsg + 'Document Type, '
        entryError = true;
      }
      if(this.fileType==''){
        errorMsg = errorMsg + 'File Type '
        entryError = true;
      }
      if(entryError){
        this.message = errorMsg + "<- Please enter";
        this.showOptions=false;
        this.showMessage = true;
      }else{
//        debugger;
        this.currentValues['title']=this.title;
        this.currentValues['documentType']=this.documentType;
        this.currentValues['fileType']=this.fileType;
        var mOpts = this.getMenuOpts('archive_entry');
        this.currentMenuOpts = mOpts.currentMenuOpts;
//        this.mode = this.ARCHIVE_BLANK;
        this.showOptions=true;
        this.showMessage = false;
      }
      console.log('next has been clicked!');
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
.selectDefaults{
  display:grid;
  grid-template-rows: 20% 20% 20% 20%;
  margin-left: 60px;
  margin-top: 30px;



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
.msgHeader {
  color:red;
}
.cardBody {
  height: 90%;
  margin:10px;
}

</style>

