<template>
  <span class="inputPlusLabel">
    <span  class="labelStyle">{{label}} </span>
    <o-input class = "inputStyle" v-model="val" @blur="dataEntered"></o-input>
  </span>
</template>

<script>
export default {
name: "inputField",
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
      this.title = this.currentValues['title'];
    }
  },
  data(){
    return {
      val:this.getVal()
    }
  },
  methods:{
    dataEntered(){
      this.$emit('configSelected', ['val',this.val]);
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
