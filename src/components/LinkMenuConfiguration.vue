<template>
  <span class="textSetWrapper">
    <span class="fontSet">
      <flex-font-select :pType="this.fontFamilyReference" :currentValues="currentValues.sub" @configSelected="configSelected"></flex-font-select>
    </span>
    <span class="sizeSet">
      <select-picker :pType="fontSizeReference" :label="fontSizeLabel" :options="fontSizeOptions" :currentValues="currentValues.sub" @configSelected="configSelected"></select-picker>
    </span>
    <span class="weightSet">
      <select-picker :pType="fontWeightReference" :label="fontWeightLabel" :options="fontWeightOptions" :currentValues="currentValues.sub" @configSelected="configSelected"></select-picker>
    </span>
    <span class="styleSet">
      <select-picker :pType="fontStyleReference" :label="fontStyleLabel" :options="fontStyleOptions" :currentValues="currentValues.sub" @configSelected="configSelected"></select-picker>
    </span>
    <span class="colorSet">
      <font-color-picker :pType="colorReference" :currentValues="currentValues" @configSelected="configSelected"></font-color-picker>
    </span>

  </span>
</template>

<script>
import flexFontSelect from "../components/flexFontSelect.vue";
//import sizePicker from "../components/sizePicker.vue";
//import weightPicker from "../components/weightPicker.vue";
//import stylePicker from "../components/stylePicker.vue";
//import alignPicker from "../components/alignPicker.vue";
import fontColorPicker from "@/components/fontColorPicker";
import selectPicker from "@/components/selectPicker";
export default {
  name: "LinkMenuConfiguration",
  components: {flexFontSelect, fontColorPicker, selectPicker},
  props:{
    currentValues: {
      type: Object,
      required: true
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
      fontFamilyReference:'fontFamily',
      fontSizeReference: 'fontSize',
      fontSizeLabel: 'Font Size:',
      fontSizeOptions: ['10pt', '12pt', '18pt', '24pt', '36pt', '48pt', '72pt'],

      fontWeightOptions: ['normal', 'bold', 'bolder', 'lighter'],
      fontWeightLabel: 'Font Weight:',
      fontWeightReference: 'fontWeight',

      fontStyleOptions:['normal', 'italic', 'oblique'],
      fontStyleLabel: 'Font Style:',
      fontStyleReference: 'fontStyle',

      fontAlignOptions: ['left', 'center', 'right'],
      fontAlignReference: 'textAlign',
      fontAlignLabel: 'Alignment:',

      colorReference: 'color'
    }
  },
  methods:{
    configSelected(msg){
//      debugger;
      console.log('textSet configSelected-',msg);
      msg.push(this.domElement);
      this.$emit('configSelected', msg);
    }
  }

}
</script>

<style scoped>
.textSetWrapper {
  height: 100%;
  width: 100%;
  margin-left: 5%;
  display: grid;
  grid-template-rows: 15% 15% 15% 15% 15% 15%;
  grid-template-columns: 100%;
}

</style>
