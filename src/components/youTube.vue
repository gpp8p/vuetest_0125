<template>
  <div id="ytComponent" ref="ytComponent">
    <div class="cardHeader" v-if="this.showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <youtube v-if="this.showOptions==false"
             :video-id="videoId"
             ref="youtube"
             :width=spanWidth
             :height=spanHeight
             @ready="playerReady"
             @playing="playing"
    ></youtube>
    <div v-if="this.showOptions==true" class="config">
      <label for="ytubeUrl" style="justify-self: center;">You-Tube Url:</label>
      <span><input type="text" size="40" id="ytubeUrl" maxlength="60" v-model ="ytubeUrl"/></span>
      <span></span>
      <span><button @click="saveUrl">Save YouTube URL</button></span>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";
import axios from "axios";


Vue.use(VueYoutube)
export default {
name: "youTube",
  extends: CardBase,
  components: {menuOpt},
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
  },
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('entryMenu_youTube');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    this.loadCardConfiguration(this.cardId);
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
      cardContent:{},
      ytid:''
    }
  },
  watch:{
    cardContent: function(){
      this.ytubeUrl = this.cardContent.ytubeUrl;
      this.videoId = this.$youtube.getIdFromUrl(this.ytubeUrl);
    }
  },
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
    saveUrl(){
      var ytContent ={
        ytubeUrl:this.ytubeUrl,
        spanWidth:this.$refs.ytComponent.parentNode.clientWidth+'px',
        spanHeight:this.$refs.ytComponent.parentNode.clientHeight+'px'
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
