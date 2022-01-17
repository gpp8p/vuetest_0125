<template>
  <section class="labelPlusInput">
      <span  class="labelStyle">{{label}} </span>
      <span class="textAreaStyle">
          <o-input v-model='fieldContent' @input='textEntered' type="textarea"></o-input>
      </span>
  </section>

</template>

<script>
export default {
name: "textAreaField",
  mounted(){
    this.fieldContent = this.getCurrentValue();
    let root = document.documentElement;
    root.style.setProperty('--fieldBackground', this.backgroundColor);
  },
  data(){
    return {
      fieldContent:''
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
  methods:{
    textEntered(){
      this.$emit('configSelected', [this.pType, this.fieldContent]);
    },
    getCurrentValue(){
//        debugger;
      if(typeof(this.currentValues[this.pType])=='undefined'){
        return '';
      }else{
        return this.currentValues[this.pType];
      }
    }
  }
}
</script>

<style scoped>
section {
  --oruga-input-background-color: var(--fieldBackground);
  --oruga-input-max-width:80%;
  --oruga-input-textarea-max-height:50px;
}
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
.textAreaStyle {
  background: #DBAA6E;
}

</style>
