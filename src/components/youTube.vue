<template>
  <div id="ytComponent" ref="ytComponent">
    <div class="cardHeader" v-if="this.showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <div v-if="this.mode==this.YT_SHOW">
      <youtube v-if="this.mode==this.YT_SHOW"
               :video-id="videoId"
               ref="youtube"
               :width=spanWidth
               :height=spanHeight
               @ready="playerReady"
               @playing="playing"
      ></youtube>
    </div>

    <div v-if="this.mode==this.YT_EDIT" class="config">
      <label for="ytubeUrl" style="justify-self: center;">You-Tube Embed Code:</label>
      <span><input type="text" size="40" id="ytubeUrl" maxlength="254" v-model ="ytubeUrl"/></span>
      <span></span>
      <span><button @click="saveUrl">Save You-Tube Embed Code</button></span>

    </div>
    <div v-if="this.mode==this.YT_META">
      <meta-data-dialog @metaDataEntered='metaDataEntered' :cardContent="this.cardContent"></meta-data-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";
import MetaDataDialog from "../components/MetaDataDialog.vue";
//import axios from "axios";


Vue.use(VueYoutube)
export default {
name: "youTube",
  extends: CardBase,
  components: {menuOpt, MetaDataDialog},
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
    yturl: {
      type: String,
      required: true
    },
    cardContent:{
      type: Object,
      required:true
    }
  },
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('entryMenu_youTube');
    this.currentMenuOpts = mOpts.currentMenuOpts;
//    this.loadCardConfiguration(this.cardId);
    console.log('youTube cardContent',this.cardContent);
    if(typeof(this.cardContent.ytubeUrl)=='undefined'){
      this.mode=this.YT_EDIT;
    }else{
      this.videoId = this.$youtube.getIdFromUrl(this.cardContent.ytubeUrl);
      this.mode=this.YT_SHOW;
    }
  },
  data() {
    return {
      videoId: '',
      spanHeight:'',
      spanWidth:'',
      showOptions:false,
      currentMenuOpts:[],
      styling: {},
      configurationCurrentValues:{},
      ytubeUrl:'',
//      cardContent:{},
      ytid:'',
      content:{},
      mode:0,
      YT_SHOW:1,
      YT_EDIT:2,
      YT_META:3
    }
  },
/*
  watch:{
    cardContent: function(){
      this.ytubeUrl = this.cardContent.ytubeUrl;
      this.videoId = this.$youtube.getIdFromUrl(this.ytubeUrl);
    }
  },
 */
  methods: {
    playVideo() {
      this.player.playVideo()
    },
    playing() {
      console.log(' we are watching!!!')
    },
    playerReady(){
      console.log(this.cardContent.ytubeUrl);
      console.log(this.$youtube.getIdFromUrl(this.cardContent.ytubeUrl));
      this.spanHeight =  this.$refs.ytComponent.parentNode.clientHeight+'px';
      this.spanWidth = this.$refs.ytComponent.parentNode.clientWidth+'px';
    },
    destroy(){
      this.player.destroy();
    },
/*
    saveUrl(){
      var ytContent ={
        ytubeUrl:this.ytubeUrl,
        spanWidth:this.$refs.ytComponent.parentNode.clientWidth,
        spanHeight:this.$refs.ytComponent.parentNode.clientHeight
      }
      var cardConfigurationPackage = [this.cardId, ytContent];
      var jsonCardConfigurationPackage = JSON.stringify(cardConfigurationPackage);
      var domElement = 'main';
      axios.post('http://localhost:8000/api/shan/saveCardContent?XDEBUG_SESSION_START=14252', {
        cardParams: jsonCardConfigurationPackage,
        domElement: domElement,
        org: this.$store.getters.getOrgId,
        layoutId: this.$store.getters.getCurrentLayoutId
      }).then(response=>
      {
        console.log(response);
        this.$emit('configSelected', ['display']);
      }).catch(function(error) {
        console.log(error);
      });



//      this.saveCardContent( ytContent,'main');
    },

 */
    saveUrl(){
      this.content.ytubeUrl = this.ytubeUrl;
      this.content.spanWidth = this.$refs.ytComponent.parentNode.clientWidth;
      this.content.spanHeight = this.$refs.ytComponent.parentNode.clientHeight;
      this.content.cardType = 'youTube';
      this.setCardData(this.content, 'saveCardContent', 'main');
      this.$emit('configSelected', ['display']);
    },
    metaDataEntered(msg){
      console.log('metadata entered-',msg);
      this.content.fileLocation = this.cardContent.fileLocation;
      this.content.documentType=msg.documentType;
      this.content.accessType=msg.accessType;
      this.content.indexFile=msg.indexFile;
      this.content.ytubeUrl = this.cardContent.ytubeUrl;
      this.content.spanWidth = this.$refs.ytComponent.parentNode.clientWidth;
      this.content.spanHeight = this.$refs.ytComponent.parentNode.clientHeight;
      this.content.cardType = 'youTube';
      this.setCardData(this.content, 'saveCardContent', 'main');
      this.$emit('configSelected',['display'])
    },
    menuOptSelected(msg) {
      console.log(msg);
      switch (msg) {
        case 'Cancel': {
          this.editStatus = false;
          var mOpts = this.getMenuOpts('entryMenu_youTube');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'ytdone': {
          this.$emit('configSelected',['display'])
          break;
        }
        case 'Resize': {
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
        case 'ytEdit':{
          mOpts = this.getMenuOpts('editing_youTube');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.YT_EDIT;
          console.log('youTube mode changed',this.mode);
          break;
        }
        case 'ytShow':{
          mOpts = this.getMenuOpts('entryMenu_youTube');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.YT_SHOW;
          break;
        }
        case 'metaData':{
          this.destroy();
          mOpts = this.getMenuOpts('metaData_youTube');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          this.mode=this.YT_META;
          break;
        }
      }
    },
    ytConfigureClicked(){

    },
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },
  },
  computed: {
    player() {
      return this.$refs.youtube.player
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
.config {
  margin-top: 20%;
  display:grid;
  grid-template-rows: 30% 30%;
  grid-template-columns: 30% 70%;
  font-family: Helvetica;
  font-size: large;



}
.config1 {
  padding-top: 30%;
}

</style>
