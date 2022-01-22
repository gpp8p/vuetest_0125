<template>
  <section class="inputPlusLabel">
    <span  class="labelStyle"><o-button @click="submitSearch" :size="small">Search</o-button></span>
    <span>
      <input class="inputStyle" type="text" :maxlength="inputSize" v-model="fieldContent" />
    </span>
  </section>

</template>

<script>
export default {
name: "searchBox",
  props:{
    label:{
      type: String,
      required: true
    },
    inputSize:{
      type: Number,
      required: true
    }
  },
  data(){
    return {
      fieldContent:''
    }
  },
  methods:{
    submitSearch(){
      this.$emit('search',this.fieldContent);
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
  width:100%;

}

.labelStyle{
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.inputPlusLabel {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 25% 75%;
}
</style>
