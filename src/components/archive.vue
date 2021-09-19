<template>
  <span>
    <div class="cardHeader" v-if="this.showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>

  </span>
</template>

<script>
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";


export default {
name: "archive",
  extends: CardBase,
  components: {menuOpt},
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('archive_entry');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    this.loadCardConfiguration(this.cardId);
  },
  data(){
    return {
      showOptions:false,
      styling: {},
      currentMenuOpts:[],
      configurationCurrentValues:{},

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
          debugger;
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
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },

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
