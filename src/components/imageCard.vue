<template>
  <span>
    <div class="cardHeader" v-if="this.showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
  </span>
</template>

<script>
import CardBase from "@/components/CardBase";
import menuOpt from "../components/menuOptV2.vue";

export default {
  name: "imageCard",
  extends: CardBase,
  components :{menuOpt},
  mounted(){
    this.$emit('childCmd', this.childCmd);
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('imageEntry');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    console.log('image card mounted');

  },
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
    cardContent:{
      type: Object,
      required:true
    }
  },
  data(){
    return {
      mode:0,
      configurationCurrentValues:{},
      showOptions:false,
      currentMenuOpts:[],
    }
  },
  methods:{
    childCmd(parentCommand){
      console.log('parentCommand = ', parentCommand);
      debugger;
      switch(parentCommand){
        case 'test':{
          console.log('child cmd in imageCard');
        }
      }
    },
    menuOptSelected(msg){
      console.log('menuOptSelected in imageCard -', msg);
      switch(msg){
        case 'Resize':{
          console.log('moveClicked');
          this.$emit('ghostCard');
          break;
        }
        case 'Configure':{
          this.configureClicked('imageCard');
          break;
        }
        case 'DeleteCard':{
          var mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay':{
          this.removeCardFromLayout(this.cardId);
          break;
        }
        case 'DelCardFromDb':
          this.deleteCardFromDb(this.cardId);
          break;
      }
    },



  }
}
</script>

<style scoped>

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
</style>
