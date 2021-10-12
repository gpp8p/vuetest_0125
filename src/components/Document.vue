<template>
  <span>
    <div class="cardHeader" v-if="this.showOptions==true">
        <menu-opt :mOpts="currentMenuOpts"  @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <div class="cardHeader msgHeader" v-if="this.showMessage==true">
      {{this.message}}
    </div>
    <span v-if="this.mode==this.ARCHIVE_SELECT_DEFAULTS" class="selectDefaults">
      <span>
        <input-field :p-type="inputFieldReference" :dialogKey="this.dKey" :label="inputFieldLabel" :currentValues="currentValues" @configSelected="configSelected"></input-field>
      </span>
      <span>
        <select-picker :pType="documentTypeReference" :dialogKey="this.dKey" :label="documentTypeLabel" :options="documentTypeOptions" :currentValues="currentValues" @configSelected="configSelected"></select-picker>
      </span>
      <span>
        <select-picker :pType="fileTypeReference" :dialogKey="this.dKey" :label="fileTypeLabel" :options="fileTypeOptions" :currentValues="currentValues" @configSelected="configSelected"></select-picker>
      </span>
    </span>
    <span v-if="this.mode==this.ARCHIVE_RT_EDITOR">
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

  </span>
</template>

<script>
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";
import selectPicker from "@/components/selectPicker";
import inputField from "@/components/inputField";
import editorCk from '../components/editorCk.vue'
import axios from "axios";


export default {
  name: "Document",
  extends: CardBase,
  components: {menuOpt, selectPicker, inputField, editorCk},
  mounted(){
    console.log('DSocument mounted');
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('archive_entry');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    this.loadCardConfiguration(this.cardId);
    this.mode = this.ARCHIVE_BLANK;
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
      mode:0,
      ARCHIVE_BLANK:0,
      ARCHIVE_SELECT_DEFAULTS:1,
      ARCHIVE_RT_EDITOR:2


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
          axios.get('http://localhost:8000/api/shan/documentDefaults?XDEBUG_SESSION_START=14668', {
          })
              .then(response => {
                console.log(response);
                this.documentTypeOptions=[];
                this.fileTypeOptions=[];
                response.data.documentTypes.forEach((val, index) =>{
                  console.log('Index: ' + index + ' Value: ' + val.document_type);
                  this.documentTypeOptions.push(val.document_type);
                });
                response.data.fileTypes.forEach((val, index) => {
                  console.log('Index: ' + index + ' Value: ' + val.file_type);
                  this.fileTypeOptions.push(val.file_type);
                });
                var mOpts = this.getMenuOpts('document_setup');
                this.currentMenuOpts = mOpts.currentMenuOpts;
                this.mode=this.ARCHIVE_SELECT_DEFAULTS;

              })
              .catch(e => {
                this.errors.push(e);
                console.log('orgMembers failed');
              });

          break;
        }
        case 'DocumentEntry':{
          debugger;
          this.nextClicked()
          switch(this.fileType){
            case 'Rich Text HTML':{
              this.mode = this.ARCHIVE_RT_EDITOR;
              break;
            }
          }
          break;
        }
      }
    },
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
    configSelected(msg){
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
  grid-template-rows: 20% 20% 20%;
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

