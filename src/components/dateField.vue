<template>
  <section class="labelPlusInput">
    <span  class="labelStyle">{{label}} </span>
    <span>
      <input type="date" v-model='fieldContent' required pattern="\d{4}-\d{2}-\d{2}" />
    </span>
  </section>
</template>

<script>
export default {
name: "dateField",
  mounted(){
    this.fieldContent = this.getCurrentValue();
  },
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
    },
    textStyle:{
      type: String,
      required: true
    },
    backgroundColor:{
      type: String,
      required: true
    }
  },
  data(){
    return {
      fieldContent:''
    }
  },
  watch :{
    fieldContent: function(){
      this.$emit('configSelected', [this.pType, this.convertToNumber(this.fieldContent)]);
    }
  },
  methods:{
    convertToNumber(date){
      return date.replaceAll('-', '');
    },
    convertFromNumber(date){
      return date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8);
    },
    getCurrentValue(){
//        debugger;
      if(typeof(this.currentValues[this.pType])=='undefined'){
        return '';
      }else{
        return this.convertFromNumber(this.currentValues[this.pType]);
      }
    }
  }

}
</script>

<style scoped>
.labelPlusInput {
  display:grid;
  grid-template-columns: 20% 80%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.labelStyle{
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
</style>
