<template>
  <span>
    <span class="linkStyle" v-for="opt in mOpts" @click="optSelected(opt)" :key="opt">{{opt}}</span>
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
    optSelected(optMsg){
      console.log(optMsg);
      this.$emit('menuOptSelected', optMsg);
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
