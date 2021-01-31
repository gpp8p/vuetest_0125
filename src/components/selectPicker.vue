<template>
  <span class="labelPlusSelect">
    <span  class="labelStyle">{{label}} </span>
    <select v-model="optSelected" ref="sel" class="selectStyle" @change="optionSelected()">
      <option value="" disabled selected class="optionStyle">Select</option>
      <option v-for="(opt, index) in this.options" :key="index" v-bind:value="opt" :selected="opt==optSelected" class="optionStyle">{{ opt }}</option>
    </select>
  </span>
</template>

<script>
export default {
name: "selectPicker",
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
    options: {
      type: Array,
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
  data(){
    return {
      optSelected:''
    }
  },
  mounted(){
    if(this.setValue.length>0){
      this.optSelected=this.setValue;
    }else{
      this.optSelected = this.getCurrentValue();
    }

  },
  watch:{


    currentValues: function(){
      this.getCurrentValues();
    },

//                debugger;
    dialogKey: function(){
      this.refreshCurrentValues();
    }
  },
  methods:{

    refreshCurrentValues(){
      this.optSelected = this.getCurrentValue();
    },
    optionSelected(){
      this.$emit('configSelected', [this.pType, this.$refs.sel.value]);
    },

    getCurrentValue(){
//        debugger;
      if(typeof(this.currentValues[this.pType])=='undefined'){
        return '';
      }else{
        return this.currentValues[this.pType];
//          var currentValuesEntriesParts = this.currentValues[this.configElement.element].split(":");
//          return currentValuesEntriesParts[1].replace(';','');
      }
    }


  }
}
</script>

<style scoped>
.selectStyle {
  background: #DBAA6E;
  color:blue;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 3px;
  width: 60%;
}
.optionStyle {
  background: #DBAA6E;
  color:blue;
  width:60px;
}
.labelStyle{
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.labelPlusSelect {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 20% 80%;
}

</style>
