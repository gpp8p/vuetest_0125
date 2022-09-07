
<script>
  /* eslint-disable no-debugger */

  export default {
    name: "GenericCardBase",
    methods:{
      setCardData(cardData, cardDataElement) {
//        debugger;
        console.log('GenericCardBase setCardData - cardData:', cardData, 'cardDataElement', cardDataElement);
        switch (cardDataElement) {
          case "backgroundColor":
            debugger;
            this.$el.style.backgroundColor=cardData;
            break
          case "backgroundImage":
            debugger;
            this.$el.style.backgroundImage=cardData;
            this.$el.style.backgroundSize="100% 100%";
            break;
          case "fontFamily":
            this.$el.style.fontFamily=cardData;
            break;
          case "fontSize":
            this.$el.style.fontSize=cardData;
            break;
          case "fontWeight":
            this.$el.style.fontWeight=cardData;
            break;
          case "fontStyle":
            this.$el.style.fontStyle=cardData;
            break;
          case "color":
            this.$el.style.color=cardData;
            break;
          case "textAlign":
            this.$el.style.textAlign=cardData;
            break;
          case "roundIncluded":
            if(cardData=="activated" | cardData=="checked") {
              this.$el.style.borderRadius = "8px";
            }else{
              this.$el.style.borderRadius = "";
            }
            break;
          case "shadow":
            if(cardData=="activated"| cardData=="checked"){
              this.$el.style.boxShadow="10px 20px 30px black";
            }else{
              this.$el.style.boxShadow="";
            }
            break;
          case "border":
//            debugger;
            if(cardData=='activated'| cardData=="checked"){
              this.$el.style.border="thin solid #0000FF";
            }else{
              this.$el.style.border=null;
              this.$el.style.borderWidth=null;
              this.$el.style.borderColor=null;
            }
            break;
          case "borderSize":
            this.$el.style.border = cardData;
            break;
          case "borderColor":
            this.$el.style.border = cardData;
            break;
        }
        return this.cardKey;
      }
    }
  }
</script>

<style scoped>

</style>
