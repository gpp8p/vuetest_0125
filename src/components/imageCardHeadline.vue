<template>
  <span class="captionCss">
    <span>Headline:</span>
    <span><input type="text" v-model.lazy="imageHeadline" size="50"/></span>
  </span>
</template>

<script>
export default {
name: "imageCardHeadline",
  props :{
    currentValues:{
      type: Object,
      required: false
    },
    dialogKey:{
      type: Number,
      required:true
    },
    domElement:{
      type: String,
      required: true
    }
  },
  data(){
    return {
      imageHeadline:''
    }
  },

  watch:{
    imageHeadline: function(){
      this.$emit('configSelected', ['imageHeadline',this.imageHeadline]);
    }
  },
  mounted(){
    this.imageHeadline = this.currentValues['imageHeadline'];
  }
}
</script>

<style scoped>
.captionCss {
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 100%;
  font-family: Geneva;
  font-size:medium;
  color: blue;
}
</style>
