<template>
    <span class="backgroundPickerWrapper">
      <span class="radioItem">
          <o-radio v-model="val" name="imageType" @input="colorSelected" native-value="color">
          Color
          </o-radio>

        </span>
      <span class="radioItem">
          <o-radio v-model="val" name="imageType" @input="imageSelected" native-value="image">
          Image
          </o-radio>

      </span>
     <span class="radioItem">
          <o-radio v-if="!noTransparent" v-model="val" name="imageType" @input="transparentSelected" native-value="transparent">
          Transparent
          </o-radio>

      </span>
      <span v-if="this.backgroundTypeSelection==this.COLOR_SELECTED || this.backgroundTypeSelection==this.IMAGE_SELECTED" class="pickers">
            <span v-if="this.backgroundTypeSelection==this.COLOR_SELECTED">
                <color-picker :currentValues="currentValues" :pType="pType" @selectedValue="configSelected"></color-picker>
            </span>
            <span v-if="this.backgroundTypeSelection==this.IMAGE_SELECTED" class="imageSelectorStyle">
                <file-upload :fileRole="this.fileRole" @selectedValue="fileSelected"></file-upload>
                <div class="backDisplayCss" v-if="fileHasBeenSelected==true">
                        <o-radio v-model="backgroundDisplayType" name="backDisplay" @input="backDisplayChosen" native-value="crop">
                            Crop to fit
                        </o-radio>
                        <o-radio v-model="backgroundDisplayType" name="backDisplay" @input="backDisplayChosen" native-value="existing">
                            Existing Size
                        </o-radio>
                        <o-radio v-model="backgroundDisplayType" name="backDisplay" @input="backDisplayChosen" native-value="stretch">
                            Stretch
                        </o-radio>

                </div>
            </span>
        </span>
    </span>
</template>

<script>
    import colorPicker from "../components/colorPicker.vue";
    import fileUpload from "../components/fileUpload.vue";
    export default {
        name: "backgroundPicker",
        components:{colorPicker, fileUpload},
        props:{
          currentValues: {
              type: Object,
              required: false
          },
          pType: {
              type: String,
              required: false
          },
          dialogKey:{
            type: Number,
            required:false
          },
          noTransparent:{
            type:Boolean,
            required:false
          }
        },
        data(){
          return {
              backgroundTypeSelection:0,
              NOTHING_SELECTED:0,
              COLOR_SELECTED:1,
              IMAGE_SELECTED:2,
              TRANSPARENT_SELECTED:3,
              val: '',
              fileRole:"backgroundImage",
              row:'',
              showTransparent:true,
              backgroundDisplayType:'',
              fileHasBeenSelected:false
          }
        },
        watch:{
          currentValues: function(){
            this.refreshCurrentValues();
          },
          dialogKey: function(){
            this.refreshCurrentValues();
          }
        },
        mounted(){
//            console.log(this.currentValues);
          this.refreshCurrentValues();
          if(this.noTransparent==true){
            this.showTransparent=false;
          }
        },
        methods:{
            refreshCurrentValues(){
//              debugger;
              console.log('currentValues updated in backgroundPicker');
              var typeColor = (this.currentValues['backgroundTypeColor']=='checked' ? true: false);
              console.log('typeColor-',typeColor);
              var typeImage = (this.currentValues['backgroundType']=='checked' ? true: false);
              console.log('typeImage', typeImage);
              var backgroundImage = this.currentValues['backgroundImage'];
              var backgroundImageDefined = typeof(backgroundImage)=='string' ? true: false;
              console.log('backgroundImageDefined', backgroundImageDefined);
              if(backgroundImageDefined && typeImage){
                this.backgroundTypeSelection = this.IMAGE_SELECTED;
                this.val='image';
              }else{
                this.backgroundTypeSelection = this.COLOR_SELECTED;
                this.val='color';
              }
            },
            colorSelected(){
                console.log('color has been selected');
                this.backgroundTypeSelection = this.COLOR_SELECTED;
                this.$emit('configSelected', ['backgroundTypeColor',this.backgroundTypeSelection] );
            },
            imageSelected(){
                console.log('image has been selected');
                this.backgroundTypeSelection = this.IMAGE_SELECTED;
                this.$emit('configSelected', ['backgroundType',this.backgroundTypeSelection] );
            },
            backDisplaySelected(msg){
              this.$emit('configSelected', ['backDisplay',msg[1]]);
            },
            transparentSelected(){
              console.log('transparent has been selected');
              this.backgroundTypeSelection = this.TRANSPARENT_SELECTED;
              this.$emit('configSelected', ['backgroundTypeTransparent',this.backgroundTypeSelection] );
              this.$emit('configSelected', ['backgroundColor','transparent']);
            },
            configSelected(msg){
                console.log('bgpick - color:', msg);
                this.$emit('configSelected', ['backgroundColor',msg[1]]);
            },
            fileSelected(msg){
              console.log('bgpick - file:', msg);
              this.fileHasBeenSelected=true;
              this.$emit('configSelected', ['backgroundImage',msg[1]]);
            },
            backDisplayChosen(msg){
              this.$emit('configSelected', ['backgroundDisplay',msg]);
            },
            getCurrentValue(){
                //debugger;
                if(typeof(this.currentValues[this.pType])=='undefined'){
                    return '';
                }else{
                    return this.currentValues[this.pType];
                }
            },
        }
    }
</script>

<style scoped>
    .backgroundPickerWrapper{
        display:grid;
        grid-template-rows: 100%;
        grid-template-columns: 20% 20% 20% 40%;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .pickers{
        margin-left: 10px;


    }
    .radioItem {
      margin-right: 10px;
    }
    .backDisplayCss{
      display: grid;
      grid-template-rows: 30% 30% 30%;
      grid-template-columns: 100%;

    }

</style>
