<template>
  <span @click="linkSelected">
    <span class="mlhz">{{description}}</span>
  </span>
</template>

<script>
export default {
name: "mLinkHz",
  props:{
    description:{
      type: String,
      required: true
    },
    target:{
      type: Number,
      required: true
    },
    is_external:{
      type: Number,
      required: true
    }
  },
  methods:{
    linkSelected(){
      this.$emit('linkSelected',this.target);
    }
  }

}
</script>

<style scoped>
.mlhz:hover {
  color:red;
}


</style>
