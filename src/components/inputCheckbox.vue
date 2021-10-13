<template>
  <span class="inputPlusLabel">
    <span  class="labelStyle">{{label}} </span>
    <o-checkbox @input="cbChanged" v-model="checked"></o-checkbox>
  </span>
</template>

<script>
export default {
name: "inputCheckbox",
  props:{
    currentValues: {
      type: Object,
      required: true
    },
    pType: {
      type: String,
      required: true
    },
    label:{
      type: String,
      required: true
    },
    dialogKey:{
      type: Number,
      required:true
    },
    setValue:{
      type: String,
      required: false
    }
  },
  watch:{
    currentValues: function(){

    }
  },
  data(){
    return {
      checked:''
    }
  },
  methods:{
    cbChanged(){
      if(this.checked){
        this.$emit('configSelected', ['checkbox', 'activated']);
      }else{
        this.$emit('configSelected', ['checkbox', '']);
      }
    },

    getVal(){
      if(typeof this.currentValues[this.pType] !== 'undefined'){
        return this.currentValues[this.pType];
      }else{
        return '';
      }


    }
  }
}
</script>

<style scoped>
.inputStyle {
  background: #DBAA6E;
  color:blue;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 3px;
  width: 60%;
}

.labelStyle{
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.inputPlusLabel {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 20% 80%;
}

</style>
