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
            <span v-if="this.backgroundTypeSelection==this.COLOR_SELECTED && this.val !='transparent'">
                <color-picker :currentValues="currentValues" :pType="backgroundColorPtype" @selectedValue="configSelected"></color-picker>
            </span>
            <span v-if="this.backgroundTypeSelection==this.IMAGE_SELECTED" class="imageSelectorStyle">
                <file-upload :fileRole="this.fileRole" :pType="this.fileRole" :currentValues="currentValues"  @fileAlreadySelected="fileAlreadySelected" @selectedValue="fileSelected"></file-upload>
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
                        <o-radio v-model="backgroundDisplayType" name="backDisplay" @input="backDisplayChosen" native-value="repeat">
                            Repeat
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
              fileHasBeenSelected:false,
              backgroundColorPtype:'backgroundColor'


          }
        },
        watch:{
          currentValues: function(){
            this.refreshCurrentValues();
          },
          dialogKey: function(){
            console.log('dialogKey has changed - calling refreshCurrentValues');
            this.refreshCurrentValues();
          }
        },
        mounted(){
//            console.log(this.currentValues);
//          this.refreshCurrentValues();
          if(this.noTransparent==true){
            this.showTransparent=false;
          }
//          debugger;
        },
        methods:{
            refreshCurrentValues(){
//              debugger;
              this.dKey++;
              console.log('currentValues updated in backgroundPicker');
              console.log(this.currentValues['backgroundType']);
              console.log(this.currentValues);
              var typeColor = (this.currentValues['backgroundTypeColor']=='checked' ? true: false);
              console.log('typeColor-',typeColor);
              var typeImage = (this.currentValues['backgroundType']=='checked' ||this.currentValues['backgroundType']=='I' ? true: false);
              console.log('typeImage', typeImage);
              var backgroundImage = this.currentValues['backgroundImage'];
              console.log(typeof this.currentValues['backgroundImage']);
              var backgroundImageDefined = typeof(backgroundImage)=='string' ? true: false;
              console.log('backgroundImageDefined', backgroundImageDefined);
              if(backgroundImageDefined && typeImage){
                this.backgroundTypeSelection = this.IMAGE_SELECTED;
                this.val='image';
                this.backgroundDisplayType = this.currentValues['backgroundDisplay'];
              }else{
                this.backgroundTypeSelection = this.COLOR_SELECTED;
                if(this.currentValues['backgroundColor']=='transparent'){
                  this.val='transparent';
                }else{
                  this.val='color';
                }
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
                this.$emit('configSelected', ['backgroundTypeImage',''] );
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
            fileAlreadySelected(){
              this.fileHasBeenSelected=true;
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
