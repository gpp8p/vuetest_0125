<template>
  <span class="fileSelectorCss">
    <span class="uploadLabel">Upload Image:</span>
    <file-upload :fileRole="this.fileRole" :pType="this.fileRole" :currentValues="currentValues"  @fileAlreadySelected="fileAlreadySelected" @selectedValue="fileSelected"></file-upload>
  </span>
</template>

<script>
import fileUpload from "../components/fileUpload.vue";
export default {
name: "imageCardEditor",
  components:{fileUpload},
  props:{
    cmd: {
      type: String,
      required: false
    },
    cmdObjectVersion:{
      type: Number,
      required: false
    }
  },
  data(){
    return {
      fileHasBeenSelected:false,
      fileRole:'imageCard'
    }
  },
  methods:{
    fileSelected(msg){
      debugger;
      console.log('image file selected-', msg);
      this.$emit('configSelected', ['imageCardImage',msg[1], 'main']);
    },
    fileAlreadySelecte(msg){
      console.log('image file already selected-', msg);
    }
  }
}
</script>

<style scoped>
  .fileSelectorCss {
    display: grid;
    grid-template-columns: 30% 70%;
    font-family: Geneva;
    font-size:medium;
    color: blue;
  }
  .uploadLabel {
    padding-top: 10px;
  }

</style>
