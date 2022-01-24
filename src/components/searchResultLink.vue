<template>
  <span >
    <span  @click="linkSelected">
      <li>{{description}}</li>
    </span>
  </span>
</template>

<script>
export default {
name: "searchResultLink",
  props:{
    description:{
      type: String,
      required: true
    },
    target:{
      type: Number,
      required: true
    },

  },
  methods:{
    linkSelected(){
      this.$emit('linkSelected',this.target);
    }
  }

}
</script>

<style scoped>
li:hover {
  color:red;
}
a {
  text-decoration: none;
  color:blue;
}
a:hover {
  color:red;
}


</style>
