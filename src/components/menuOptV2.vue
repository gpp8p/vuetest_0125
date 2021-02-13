<template>
  <span>
    <span class="linkStyle" v-for="opt in mOpts" @click="optSelected(opt)" :key="opt">{{opt[0]}}</span>
  </span>

</template>

<script>
export default {
name: "menuOpt",
  props:{
    mOpts:{
      type: Array,
      required: true
    }
  },
  watch:{
    mOpts: function(){
      this.$forceUpdate();
    }

  },
  methods:{
    optSelected(opt){
//      debugger;
      console.log(opt[1]);
      this.$emit('menuOptSelected', opt[1]);
    }
  }
}
</script>

<style scoped>
  .linkStyle{
    font-family: Arial;
    font-size: medium;
    color: #0a3aff;
    margin-left: 10%;
    margin-right: 5%;
  }
</style>
