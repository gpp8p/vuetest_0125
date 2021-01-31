<template>
    <span class="borderPickerWrapper">

        <o-checkbox @input="borderSelectedChanged" v-model="checked">{{borderLabel}}</o-checkbox>

      <span v-if="checked" class="selectThick">
        <select-picker :pType="borderValueRef" :label="borderSizeLabel" :setValue="this.setValReference" :options="borderSizeOptions" :currentValues="currentBorderValues" @configSelected="configSelected"></select-picker>
      </span>
      <span v-if="checked" class="pickers">
          <color-picker
                  :currentValues="currentBorderValues"
                  :pType="borderColorRef"
                  :setColorVal="this.setColorValReference"
                  @selectedValue="selectedValue"
          >
          </color-picker>
      </span>
    </span>
</template>

<script>
    import colorPicker from "../components/colorPicker.vue";
    import selectPicker from "@/components/selectPicker";
    export default {
        name: "borderPicker",
        components:{colorPicker, selectPicker},
        props:{
          pType:{
              type: String,
              required: true
          },
          currentValues: {
                type: Object,
                required: true
           },
          dialogKey:{
            type: Number,
            required:true
          }
        },
        mounted(){
          this.refreshCurrentValues();
        },
        data(){
            return{
                borderLabel: "Border ?",
                borderCheckboxRef:"border",
                borderSizeLabel: "",
                borderValueRef:"borderSize",
                borderColorRef:"borderColor",
                borderSizeOptions: ['thin','medium','thick'],
                checked:false,
                borderSizeValue:'',
                borderColorValue:'',
                items: ['thin','medium','thick'],
                setValReference:'',
                setColorValReference:'',
                borderValue:'',
                borderSelected:false,
                currentBorderValues: {}

            }
        },
        methods:{

            refreshCurrentValues(){
//              debugger;
              if(this.currentValues.borderInclude=='checked'){
                this.checked=true;
                var unpackedBorderValues = this.currentValues.border.split(' ');
                this.currentBorderValues.borderSize = unpackedBorderValues[0];
                this.currentBorderValues.borderColor = unpackedBorderValues[2];
                this.currentValues.borderColor = unpackedBorderValues[2];
                this.currentValues.borderSize = unpackedBorderValues[0];
                this.currentBorderValues.borderColor = this.currentBorderValues.borderColor.replace(';', '');
              }
              if(typeof(this.currentValues.borderSize)!='undefined'){
                this.borderValue=this.currentValues.borderSize;
              }
            },
            borderSelectedChanged(){

              if(this.checked){
                this.setValReference = 'thin';
                this.setColorValReference="#0000FF";
                this.$emit('configSelected', ['border', 'activated']);
              }else{
                this.$emit('configSelected', ['border', '']);
              }
            },
            configSelected(msg){
                console.log('Border value selected:', msg);
//                this.$emit('selectedValue', ['border', true]);
                this.currentValues.borderSize = msg[1];
                this.$emit('configSelected', ['borderSize', msg[1]]);
            },

            selectedValue(msg){
                this.currentValues.borderColor = msg[1];
                this.$emit('configSelected', ['borderColor', msg[1]]);
            }
        },
        watch:{
            checkbox: function(){
//                debugger;
                if(!this.checkbox){
                    console.log('checkbox changed', this.checkbox);
                    this.$emit('selectedValue', ['border', false]);
                    this.$emit('selectedValue', ['borderSize', '']);

                }
            },
          currentValues: function(){
            if(this.currentValues['borderInclude']=='checked'){
              this.checked = true;
              this.borderValue = this.currentValues['borderSize'];
              this.refreshCurrentValues();

            }
          },

          dialogKey: function(){
              this.refreshCurrentValues();
          }
        }
    }
</script>

<style scoped>
    .borderPickerWrapper{
        display:grid;
        grid-template-rows: 100%;
        grid-template-columns: 20% 40% 35%;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
    }
    .selectThick {
      margin-top: 5px;
    }
    .pickers{
        margin-top: 8px;
    }

</style>
