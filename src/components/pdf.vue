<template>
<span>
    <div class="cardHeader" v-if="showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <div v-if="errMsg==true">
      {{errorMessage}}
    </div>
    <span v-if="this.mode==this.PDF_UPLOAD" class="inputPlusLabel">
      <span class="labelStyle">Please select file to upload:</span><file-upload :fileRole="this.pdfFileRole" @selectedValue="pdfFileSelected"></file-upload>
    </span>
    <span v-if="this.mode==this.PDF_SHOW">
      <pdf-iframe :fileLocation="this.fileLocation"></pdf-iframe>
    </span>
    <div v-if="this.mode==this.ENTER_METADATA">
      <meta-data-dialog @metaDataEntered='metaDataEntered' :cardContent="this.cardContent"></meta-data-dialog>
    </div>
</span>
</template>

<script>
import pdfIframe from "../components/pdfIframe.vue";
import MetaDataDialog from "../components/MetaDataDialog.vue";
import fileUpload from "../components/fileUpload.vue";
import axios from "axios";
import CardBase from "@/components/CardBase";
import menuOpt from "../components/menuOptV2.vue";
export default {
name: "pdf",
  extends: CardBase,
  components:{pdfIframe, MetaDataDialog, fileUpload, menuOpt},
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    console.log('pdf cardContent',this.cardContent);
    if(typeof(this.cardContent['documentType'])!=='undefined'){
      this.documentType= this.cardContent['documentType'];
    }
    if(typeof(this.cardContent['fileLocation'])!=='undefined'){
      this.fileLocation = this.cardContent['fileLocation'];
    }
    if(typeof(this.cardContent['documentType'])!=='undefined'){
      this.documentType = this.cardContent['documentType'];
    }
    if(typeof(this.cardContent['accessType'])!=='undefined'){
      this.accessType = this.cardContent['accessType'];
    }
    if(typeof(this.cardContent['indexFile'])!=='undefined'){
      if(this.cardContent['indexFile']==1){
        this.indexFile=true;
      }else{
        this.indexFile=false;
      }
    }
    if(this.fileLocation==''){
      debugger;
      var mOpts = this.getMenuOpts('pdf_file_select');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.showOptions==true;
      this.mode=this.PDF_UPLOAD;
    }else{
      mOpts = this.getMenuOpts('pdf_file_showing');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode=this.PDF_SHOW;
    }

  },
  props:{
    cardId: {
      type: String,
      required: true
    },
    cmd:{
      type: String,
      required: false
    },
    cardContent:{
      type: Object,
      required: true
    },
    displayStatus:{
      type: Boolean,
      required: false
    },
  },
  data() {
    return {
      mode: 0,
      PDF_UPLOAD: 3,
      PDF_SHOW:4,
      ENTER_METADATA:2,
      currentMenuOpts: [],
      content: {},
      configurationCurrentValues: {},
      showOptions: false,
      errMsg:false,
      errorMessage:'',
      fileLocation:'',
      indexFile:false,
      documentType:'',
      accessType:'',
      pdfFileRole: 'document',
    }
  },
  methods:{
    menuOptSelected(msg) {
      console.log(msg);
      switch (msg) {
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
        case 'CancelPdfSelect':{
          if(this.fileLocation.length==0){
            this.showOptions=false;
            this.errMsg=true;
            this.errorMessage = 'No file selected - please select a file';
          }else{
            mOpts = this.getMenuOpts('pdf_file_selected');
            this.currentMenuOpts = mOpts.currentMenuOpts;
            this.mode=this.PDF_SHOW;
          }
          break;
        }
        case 'pdfExit':{
//          debugger;
          this.showOptions=false;
          this.$router.push({
            name: 'displayLayout',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
          break;
        }
        case 'pdfSave':{
          this.uploadedFileSave();
          break;
        }
        case 'changePdf':{
          this.mode = this.PDF_UPLOAD;
          mOpts = this.getMenuOpts('pdf_file_select');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'pdfMeta':{
          mOpts = this.getMenuOpts('entering_pdf_meta');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.ENTER_METADATA;
          break;
        }
        case 'exitMeta':{
          mOpts = this.getMenuOpts('pdf_file_showing');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.PDF_SHOW;
          break;
        }

      }
    },
    pdfFileSelected(msg){
      console.log('file has been selected', msg);
      this.cardContent.fileLocation=msg[1];
      this.fileLocation = msg[1];
      var mOpts = this.getMenuOpts('pdf_file_selected');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.currentSelectedMenuOption = mOpts.currentSelectedMenuOption;
      this.showOptions==true;
      this.mode =this.PDF_SHOW;
    },
    uploadedFileSave(){
      this.content.fileLocation = this.cardContent.fileLocation;
      this.content.documentType = this.cardContent.documentType;
      this.content.accessType = this.cardContent.accessType;
      this.content.indexFile = this.cardContent.indexFile;
      this.content.cardType = 'pdf';
      this.setCardData(this.content, 'saveCardContent', 'main');
    },
    metaDataEntered(msg){
      console.log('metadata entered-',msg);
      this.content.fileLocation = this.cardContent.fileLocation;
      this.content.documentType=msg.documentType;
      this.content.accessType=msg.accessType;
      this.content.indexFile=msg.indexFile;
      this.content.keyWords = msg.keyWords;
      this.cardContent.createDate = msg.createDate;
      this.content.createDate = msg.createDate;
      this.setCardData(this.content, 'saveCardContent', 'main');
      var mOpts = this.getMenuOpts('pdf_file_showing');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode=this.PDF_SHOW;
    },
  }

}
</script>

<style scoped>

.cardHeader {
  color: blue;
  height: 5%;
  background-color: #fff722;
  font-family: Geneva;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
.cardBody {
  height: 95%;
  margin:10px;
}


</style>
