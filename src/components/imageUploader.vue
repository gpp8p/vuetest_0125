<template>
            <span class="imageSelectorStyle">
                <file-upload :fileRole="this.fileRole" :pType="this.fileRole" :currentValues="currentValues"  @fileAlreadySelected="fileAlreadySelected" @selectedValue="fileSelected"></file-upload>
                <div class="imageDisplayCss" v-if="fileHasBeenSelected==true">
                        <o-radio v-model="imageDisplayType" name="imageDisplay" @input="imageDisplayChosen" native-value="crop">
                            Crop to fit
                        </o-radio>
                        <o-radio v-model="imageDisplayType" name="imageDisplay" @input="imageDisplayChosen" native-value="existing">
                            Existing Size
                        </o-radio>
                        <o-radio v-model="imageDisplayType" name="imageDisplay" @input="imageDisplayChosen" native-value="stretch">
                            Stretch
                        </o-radio>
                        <o-radio v-model="imageDisplayType" name="imageDisplay" @input="imageDisplayChosen" native-value="repeat">
                            Repeat
                        </o-radio>
                </div>
            </span>
</template>

<script>
import fileUpload from "../components/fileUpload.vue";
export default {

name: "imageUploader",
  componenmts:{fileUpload},
  props:{
    fileRole:{
      type: String,
      required: true
    }
  },
  data(){
    return {
      imageDisplayType:'',
      fileHasBeenSelected:false
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
.radioItem {
  margin-right: 10px;
}
.imageDisplayCss{
  display: grid;
  grid-template-rows: 30% 30% 30%;
  grid-template-columns: 100%;

}
</style>
