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
    <button @click="playVideo">play</button>

  </div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";


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

  },
  data() {
    return {
      videoId: 'lG0Ys-2d4MA',
      spanHeight:'',
      spanWidth:'',
      showOptions:false,
      currentMenuOpts:[],
      styling: {},
      configurationCurrentValues:{}
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
      this.spanHeight =  this.$refs.ytComponent.parentNode.clientHeight+'px';
      this.spanWidth = this.$refs.ytComponent.parentNode.clientWidth+'px';
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
        case 'ytConfigure': {
          this.ytConfigureClicked();
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

</style>
