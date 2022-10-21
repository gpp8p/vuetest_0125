<template>
  <span>
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
      console.log('image file selected-', msg);
    },
    fileAlreadySelecte(msg){
      console.log('image file already selected-', msg);
    }
  }
}
</script>

<style scoped>

</style>
