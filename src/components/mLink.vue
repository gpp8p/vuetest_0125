<template>
  <span @click="linkSelected">
    <li>{{description}}</li>
  </span>
</template>

<script>
export default {
name: "mLink",
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

</style>
