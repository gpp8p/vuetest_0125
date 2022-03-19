<template>
  <span class="pagerLine">
    <span class="splabel" @click="previous">Previous</span>
    <span class="splabel"></span>
    <span class="splabel" @click="next">Next</span>
  </span>
</template>

<script>
export default {
name: "pager",
  methods :{
    next(){
      this.$emit('nextClicked');
    },
    previous(){
      this.$emit('previousClicked');
    }
  }
}
</script>

<style scoped>
.pagerLine {
  width:100%;
  margin-left: 5%;
  margin-right: 5%;
  display:grid;
  grid-template-rows: 10%;
  grid-template-columns: 20% 60% 20%;

}
.splabel {
  font-family: Helvetica;
  font-size: x-small;
  color: #0a3aff;
}

.splabel:hover {
  color: #ff330a;
}

</style>
