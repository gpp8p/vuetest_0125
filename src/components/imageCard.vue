<template>
  <span>
    <div class="cardHeader" v-if="this.showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
  </span>
</template>

<script>
import CardBase from "@/components/CardBase";

export default {
  name: "imageCard",
  extends: CardBase,
  mounted(){
    this.$emit('childCmd', this.childCmd);
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
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
    }

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
