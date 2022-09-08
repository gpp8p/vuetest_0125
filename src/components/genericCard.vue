<template >
<span v-bind:style='thisCardStyle' v-on:click="processClick" id=cardId v-if="this.ghost==false">



        <text-show v-if="cardType=='textShow' || cardType=='RichText'"
                   :card-style=cardStyle
                   :card-id=cardId
                   :card-key=cardKey
                   :card-position=cardPosition
                   :cardProperties = cardProperties
                   :displayStatus = displayStatus
                   :elementStyles="elementStyles"
                   :cardContent="cardContent"
                   :cmdObject="cmdObject"
                   :cmdObjectVersion="cmdObjectVersion"
                   :cmd = cmd
                   @cardClick="processCardClick"
                   @configSelected="configSelected"
                   @textEditor="textEditor"
                   @configurationHasBeenSaved="configurationHasBeenSaved"
                   @cardDataLoaded="cardDataLoaded"
                   @cardPropertySet="cardPropertySet"
                   @ghostCard="ghostCard"
                   ref="cardKey"
        ></text-show>

        <NavigationMenu v-if="cardType=='NavigationMenu'"
                   :card-style=cardStyle
                   :card-id=cardId
                   :card-key=cardKey
                   :card-position=cardPosition
                   :cardProperties = cardProperties
                   :displayStatus = displayStatus
                   :elementStyles="elementStyles"
                   :cardContent="cardContent"
                   :cmdObject="cmdObject"
                   :cmdObjectVersion="cmdObjectVersion"
                   :cmd = cmd
                   @configSelected="configSelected"
                   @cardClick="processCardClick"
                   @textEditor="textEditor"
                   @newLayout="newLayout"
                   @linkSelected="linkSelected"
                   @configurationHasBeenSaved="configurationHasBeenSaved"
                   @cardDataLoaded="cardDataLoaded"
                   @cardPropertySet="cardPropertySet"
                   @ghostCard="ghostCard"
                   ref="cardKey"
        ></NavigationMenu>
       <Headline v-if="cardType=='Headline'"
                  :card-style=cardStyle
                  :card-id=cardId
                  :card-key=cardKey
                  :card-position=cardPosition
                  :cardProperties = cardProperties
                  :displayStatus = displayStatus
                  :elementStyles="elementStyles"
                  :cardContent="cardContent"
                  :cmdObject="cmdObject"
                  :cmdObjectVersion="cmdObjectVersion"
                  :headlineStyle="thisCardStyle"
                  :cmd = cmd
                  @configSelected="configSelected"
                  @cardClick="processCardClick"
                  @textEditor="textEditor"
                  @linkSelected="linkSelected"
                  @configurationHasBeenSaved="configurationHasBeenSaved"
                  @cardDataLoaded="cardDataLoaded"
                  @cardPropertySet="cardPropertySet"
                  @ghostCard="ghostCard"
                  ref="cardKey"
       ></Headline>
        <login-link v-if="cardType=='loginLink'"
                    :displayStatus = displayStatus
                    :card-id=cardId
                    @cardClick="processCardClick"
                    @ghostCard="ghostCard"
                    @configurationHasBeenSaved="configurationHasBeenSaved"
                    @cardPropertySet="cardPropertySet"
                    @cardDataLoaded="cardDataLoaded"
                    ref="cardKey"
        ></login-link>
        <you-tube v-if="cardType=='youTube'"
                  :displayStatus = displayStatus
                  :card-id=cardId
                  :yturl="cardContent.ytubeUrl"
                  :cardContent="cardContent"
                  @configSelected="configSelected"
                  @cardClick="processCardClick"
                  @ghostCard="ghostCard"
                  @configurationHasBeenSaved="configurationHasBeenSaved"
                  @cardPropertySet="cardPropertySet"
                  @cardDataLoaded="cardDataLoaded"
                  ref="cardKey"
        ></you-tube>
        <image-card v-if="cardType=='imageCard'"
                  :displayStatus = displayStatus
                  :card-id=cardId
                  :yturl="cardContent.ytubeUrl"
                  :cardContent="cardContent"
                  @configSelected="configSelected"
                  @cardClick="processCardClick"
                  @ghostCard="ghostCard"
                  @configurationHasBeenSaved="configurationHasBeenSaved"
                  @cardPropertySet="cardPropertySet"
                  @cardDataLoaded="cardDataLoaded"
                  ref="cardKey"
        ></image-card>

        <pdf v-if="cardType=='pdf'"
             @configSelected="configSelected"
             @ghostCard="ghostCard"
             @configurationHasBeenSaved="configurationHasBeenSaved"
             @cardPropertySet="cardPropertySet"
             @cardDataLoaded="cardDataLoaded"
             @cardClick="processCardClick"
             :displayStatus = displayStatus
             :cardContent="cardContent"
             :card-id=cardId
             :cmdObject="cmdObject"
             :cmdObjectVersion="cmdObjectVersion"
             :cmd = cmd
             ref="cardKey"
        ></pdf>


</span>




</template>


<script>
  /* eslint-disable no-console,no-debugger */

//  import GreenComponent from "../components/greenComponent";
  import GenericCardBase from "../components/GenericCardBase.vue";
  import textShow from "./textShow.vue";
  import loginLink from "../components/loginLink";
  import youTube from "../components/youTube.vue";
  import pdf from "../components/pdf.vue";
  import Headline from "../components/Headline.vue";
  import NavigationMenu from "../components/NavigationMenu.vue"
  import imageCard from "@/components/imageCard";

  export default {
    name: "genericCard",
    extends: GenericCardBase,
    components: {textShow, loginLink, youTube, pdf, Headline, NavigationMenu, imageCard},
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
      },
      elementStyles:{
        type: Object,
        required:false
      },
      cardContent:{
        type: Object,
        required: true
      },
      cmdObject:{
        type:Object,
        required: false
      },
      cmdObjectVersion:{
        type: Number,
        required:false
      }
    },
    data(){
      return {
         dataEntered:'',
         ghost:false,
         thisCardStyle:''
      }
    },
    mounted(){
 //     console.log('genericCardMounted-', this.cardPosition);
      this.thisCardStyle = this.cardStyle;
      this.$emit('registerCard',[this.editMethod, this.cardPosition[0], this.cardPosition[1]]);
    },
    watch: {
      cmdObjectVersion: function () {
//        console.log(this.cmdObject.cardId,'-',this.cardId);
        if(this.cardId!=this.cmdObject.cardId){
          return;
        }
        switch (this.cmdObject.action) {
          case 'newStyle': {
            console.log('newStyle called on'+this.cardId);
            break;
          }
        }
      }
    },
    methods: {
      processClick(msg){
        debugger;
        if(this.hasChildern(this.$refs)){
          console.log('hasChildern is true');
        }else{
          console.log('no childern');
          console.log('generic card recieved a click:'+msg);
          var cardData = {};
          cardData.id = this.cardId;
          cardData.cardkey = this.cardKey;
          cardData.location = this.cardPosition;
          console.log('card click', cardData.location);
          this.$emit('storeValue', [this.cardId, cardData, this.cardKey, this.cardPosition[0], this.cardPosition[1]], this.editMethod);
        }
      },
      editMethod(background){
//        debugger;
        this.setCardBackground(background);
        console.log('editMethod from', this.cardPosition);
      },
      ghostCard(){
        debugger;
        this.$emit('ghostCard', [this.cardPosition, this.cardId]);
        this.ghost=true;
      },
      configurationHasBeenSaved(){
        debugger;
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
//        debugger;
        this.$emit('textEditor', [msg]);
      },
      newLayout(msg){
        this.$emit('newLayout', [msg]);
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
//        debugger;
        console.log('GenericCard recieved a cardPropertySet - ',msg);
        this.setCardData(msg[0], msg[1]);
      },
      linkHelperRequested(){
        this.$emit('linkHelperRequested');
      },
      linkSelected(msg){
//        console.log('link selected', msg);
        this.$emit('linkSelected', msg);
      },
      setCardBackground(newBackground){
        debugger;
        var backgroundAt = this.thisCardStyle.indexOf('background-color:#');
        var styleBegining = this.thisCardStyle.slice(0,backgroundAt);
        var newStyle = styleBegining+'background-color:#'+newBackground+this.thisCardStyle.slice((backgroundAt+24));
        this.thisCardStyle= newStyle;
        console.log('new style',newStyle);
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
