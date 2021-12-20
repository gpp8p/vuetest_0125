<template>
  <span >
    <span v-if="this.is_external==0" @click="linkSelected">
      <li>{{description}}</li>
    </span>
    <span v-if="this.is_external==1">
      <li><a v-bind:href="link_url" target="_blank" >{{description}}</a></li>
    </span>

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
    },
    link_url:{
      type: String,
      required: false
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
