<template>
<span>
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
export default {
name: "pdf",
  components:{pdfIframe, MetaDataDialog, fileUpload},
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    console.log('Document cardContent',this.cardContent);
    if(typeof(this.cardContent['documentType'])!=='undefined'){
      this.documentType= this.cardContent['documentType'];
    }
    if(typeof(this.cardContent['fileLocation'])!=='undefined'){
      this.fileLocation = this.cardContent['fileLocation'];
//      this.getPdf();
    }
    if(typeof(this.cardContent['indexFile'])!=='undefined'){
      if(this.cardContent['indexFile']==1){
        this.indexFile=true;
      }else{
        this.indexFile=false;
      }
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
    }
  },
  data() {
    return {
      mode: 0,
      PDF_UPLOAD: 3,
      PDF_SHOW:4,
      ENTER_METADATA:2,
      content: {},
      configurationCurrentValues: {},
      showOptions: false,
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

      }
    },
    metaDataEntered(msg){
      console.log(msg);
      this.content.documentType=msg.documentType;
      this.content.accessType=msg.accessType;
      this.content.indexFile=msg.indexFile;
      var mOpts = this.getMenuOpts('richTextOpen');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode=this.PDF_SHOW;
    },
    metaTransition(msg){
      console.log(msg);
      this.cardData = msg;
      var mOpts = this.getMenuOpts('enteringMetaData');
      this.currentMenuOpts = mOpts.currentMenuOpts;
      this.mode=this.ENTER_METADATA;
    },
  }

}
</script>

<style scoped>

</style>
