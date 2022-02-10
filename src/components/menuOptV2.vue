<template>
  <span class="linkStyle">
    <span  v-for="opt in mOpts" @click="optSelected(opt)" :key="opt">
      <span class="linkStyleItem">{{opt[0]}}</span>
    </span>
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
    display: flex;
    justify-content: space-evenly;
    width:80%;
  }
  .linkStyleItem {
    color: blue;
    font-family: Geneva;
    font-size: 12px;
    font-style: normal;
    font-weight: bold;
  }
  .linkStyleItem:hover {
    color:red;
  }
</style>
