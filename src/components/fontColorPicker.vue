<template>
    <span class="fontColorPickerWrapper">
      <span class="labelStyle">Font Color: </span>
      <span class="pickers">
          <color-picker
              :currentValues="currentValues"
              :pType="fontColorReference"
              @selectedValue="selectedValue"
          >
          </color-picker>
      </span>
    </span>

</template>

<script>
import colorPicker from "../components/colorPicker.vue";
export default {
  name: "fontColorPicker",
  components: {colorPicker},
  methods:{
      selectedValue(msg){
        console.log(msg);
        debugger;
        this.$emit('configSelected', msg);
      }
  },
  props:{
    currentValues: {
      type: Object,
      required: true
    },
    pType: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      fontColorReference: 'color'
    }
  }
}
</script>

<style scoped>
  .pickers{
    margin-top: 8px;
  }
  .labelStyle{
    font-family: Arial;
    font-size: medium;
    color: #0a3aff;
    margin-top: 8px;
  }
  .fontColorPickerWrapper{
    display:grid;
    grid-template-rows: 100%;
    grid-template-columns: 20% 60%;
  }
</style>
