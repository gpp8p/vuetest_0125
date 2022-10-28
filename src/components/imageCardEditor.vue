<template>
  <span class = "wrapperCss">
    <span class="captionCss">
      <span>Title:</span>
      <span><input type="text" v-model.lazy="imageTitle" size="50"/></span>
    </span>
  </span>

</template>

<script>


export default {
name: "imageCardEditor",

  props:{
    cmd: {
      type: String,
      required: false
    },
    cmdObjectVersion:{
      type: Number,
      required: false
    },
    cmdObject: {
      type: Object,
      required: false
    },
  },
  mounted(){
    if(typeof this.cmdObject.imageTitle != 'undefined'){
      this.imageTitle = this.cmdObject.imageTitle;
    }
    this.imageCardId = this.cmdObject.cardId;

/*
    if(typeof this.cmdObject.imageDescription != 'undefined'){
      this.imageDescription = this.cmdObject.imageDescription;
    }
    if(typeof this.cmdObject.cardFormat != 'undefined'){
      this.optSelected = this.cmdObject.cardFormat;
    }
*/
  },
  data(){
    return {
      fileHasBeenSelected:false,
      fileRole:'imageCard',
      imageTitle:'',
      imageDescription:'',
      imageUrl:'',
      ptype:'imageUrl',
      formatOptions:['Image Link', 'Image Link w Title', 'Image w Description','Image w Caption', 'Image w Caption and Description', 'Text Only'],
      formatLabel:'',
      dkey:0,
      optSelected:'Image Link',
      imageCardId:0
    }
  },
  watch:{
    cmdObjectVersion: function(){
      debugger;
      switch(this.cmd){
        case "saveImageEdit":{
          this.$emit('configSelected',['saveImageEdit', this.imageUrl, this.imageTitle, this.imageDescription, this.optSelected, this.imageCardId]);
          break;
        }
      }
    }
  }
}
</script>

<style scoped>
  .wrapperCss {
    display: grid;
    grid-template-rows:30% 20% 30%;
  }
  .fileSelectorCss {
    display: grid;
    grid-template-columns: 30% 70%;
    font-family: Geneva;
    font-size:medium;
    color: blue;
  }
  .formatSelectorCss {
    display: grid;
    grid-template-columns: 30% 70%;
    font-family: Geneva;
    font-size:medium;
    color: blue;

  }
  .captionCss {
    display: grid;
    grid-template-columns: 30% 70%;
    font-family: Geneva;
    font-size:medium;
    color: blue;
  }
  .selectCss {
    max-width: 30%;
  }
  .uploadLabel {
    padding-top: 10px;
  }


</style>
