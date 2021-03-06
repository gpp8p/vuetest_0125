<template >
<span v-bind:style='cardStyle' v-on:click="processClick" id=cardId>
        <green-component  v-if="cardType=='greenComponent' || cardType=='Headline'" class="genericCardStyle"
                          :card-style=cardStyle
                          :card-id=cardId
                          :card-key=cardKey
                          :card-position=cardPosition
                          :cardProperties = cardProperties
                          :displayStatus = displayStatus
                          @configSelected="configSelected"
                          @editClick = editClick
                          @cardClick="processCardClick"
                          @configurationHasBeenSaved="configurationHasBeenSaved"
                          @cardDataLoaded="cardDataLoaded"
                          @cardPropertySet="cardPropertySet"
                          ref="cardKey"
        ></green-component>
        <text-show v-if="cardType=='textShow' || cardType=='RichText'"
                   :card-style=cardStyle
                   :card-id=cardId
                   :card-key=cardKey
                   :card-position=cardPosition
                   :cardProperties = cardProperties
                   :displayStatus = displayStatus
                   :cmd = cmd
                   @cardClick="processCardClick"
                   @textEditor="textEditor"
                   @configurationHasBeenSaved="configurationHasBeenSaved"
                   @cardDataLoaded="cardDataLoaded"
                   @cardPropertySet="cardPropertySet"
                   ref="cardKey"
        ></text-show>
        <link-menu v-if="cardType=='linkMenu'"
                   :card-style=cardStyle
                   :card-id=cardId
                   :card-key=cardKey
                   :card-position=cardPosition
                   :cardProperties = cardProperties
                   :displayStatus = displayStatus
                   :cmd = cmd
                   @configSelected="configSelected"
                   @cardClick="processCardClick"
                   @editClick = editClick
                   @configurationHasBeenSaved="configurationHasBeenSaved"
                   @cardDataLoaded="cardDataLoaded"
                   @cardPropertySet="cardPropertySet"
                   ref="cardKey"
        ></link-menu>

</span>




</template>


<script>
  /* eslint-disable no-console,no-debugger */

  import GreenComponent from "../components/greenComponent";
  import GenericCardBase from "../components/GenericCardBase.vue";
  import textShow from "./textShow.vue";
  import linkMenu from "../components/LinkMenu";

  export default {
    name: "genericCard",
    extends: GenericCardBase,
    components: {GreenComponent, textShow, linkMenu},
    props: {
      cardType: {
        type: String,
        required: true
      },
      cardStyle: {
        type: String,
        required: true
      },
      cardId: {
        type: String,
        required: true
      },
      cardKey:{
        type: String,
        required: true
      },
      cardPosition: {
        type: Array,
        required: true
      },
      gridCss: {
        type: String,
        required: true
      },
      cardProperties: {
        type: String,
        required: false
      },
      displayStatus:{
         type: Boolean,
         required: false
      },
      cmd:{
        type: String,
        required: false
      }
    },
    data(){
      return {
         dataEntered:''
      }
    },
    methods: {
      processClick(msg){
//        debugger;
        if(this.hasChildern(this.$refs)){
          console.log('hasChildern is true');
        }else{
          console.log('no childern');
          console.log('generic card recieved a click:'+msg);
          this.$emit('storeValue', [this.cardId])
        }
      },
      configurationHasBeenSaved(){
        this.$emit('configurationHasBeenSaved');
      },
      configSelected(msg){
        this.$emit('configSelected', msg);
      },
      processCardClick(msg){
        console.log('blankComponent card recieved a click:'+msg);
        this.$emit('cardClick', [msg])
      },
      textEditor(msg){
        debugger;
        this.$emit('textEditor', [msg]);
      },
      editClick(msg){
        this.$emit('editClick', [msg]);
      },
      hasChildern(refs){
        for(var o in refs ){
          return true;
        }
        return false;
      },
      cardDataLoaded(msg){
        this.$emit('cardDataLoaded', msg);
      },
      cardPropertySet(msg){
        debugger;
        console.log('GenericCard recieved a cardPropertySet - ',msg);
        this.setCardData(msg[0], msg[1]);
      },
      linkHelperRequested(){
        this.$emit('linkHelperRequested');
      }

    }
  };
</script>

<style scoped>
    .genericCardStyle{
        height:100%;
        width:100%;

    }

</style>
