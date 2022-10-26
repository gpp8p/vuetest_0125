<template>
  <span class="fileSelectorCss">
    <span class="uploadLabel">Upload Image:</span>
    <file-upload :fileRole="this.fileRole" :pType="this.fileRole" :currentValues="currentValues"  @fileAlreadySelected="fileAlreadySelected" @selectedValue="fileSelected"></file-upload>
    <span>Title:</span>
    <span><input type="text" v-model.lazy="imageTitle" size="50"/></span>
    <span>Description</span>
    <span><textarea rows="6" cols="60" v-model.lazy = "imageDescription"/></span>
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
      fileRole:'imageCard',
      imageTitle:'',
      imageDescription:'',
      imageUrl:''
    }
  },
  methods:{
    fileSelected(msg){
      debugger;
      console.log('image file selected-', msg);
      this.imageUrl = msg[1];
      this.$emit('configSelected', ['imageCardImage',this.imageUrl, 'main']);
    },
    fileAlreadySelecte(msg){
      console.log('image file already selected-', msg);
    }
  },
  watch:{
    cmdObjectVersion: function(){
      debugger;
      switch(this.cmd){
        case "saveImageEdit":{
          this.$emit('configSelected',['saveImageEdit', this.imageUrl, this.imageTitle, this.imageDescription]);
          break;
        }
      }
    }
  }
}
</script>

<style scoped>
  .fileSelectorCss {
    display: grid;
    grid-template-columns: 30% 70%;
    grid-template-rows:20% 30% 50%;
    font-family: Geneva;
    font-size:medium;
    color: blue;
  }
  .uploadLabel {
    padding-top: 10px;
  }

</style>
