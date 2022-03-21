<template>
  <span class="pagerLine">
    <span class="splabel">
      <o-button @click="previous" :size="buttonSize">Previous</o-button>
    </span>
    <span class="splabel"></span>
    <span class="splabel">
      <o-button @click="next" :size="buttonSize">Next</o-button>
    </span>
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
  },
  data(){
    return {
      buttonSize: 'small'
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
  grid-template-columns: 20% 50% 20%;

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
