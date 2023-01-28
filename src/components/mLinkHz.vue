<template>
  <span>
  <span @click="linkSelected" v-if="this.is_external==0">
    <span class="mlhz">{{description}}</span>
  </span>
  <span v-if="this.is_external==1">
      <a v-bind:href="extLink" target="_blank" >{{description}}</a>
  </span>
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
    },
    link_url:{
      type: String,
      required: false
    }
  },
  data(){
    return {
      extLink:''
    }
  },
  mounted(){
    if(typeof(link_url)!=undefined){
      this.extLink='http://'+this.link_url;
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
a {
  text-decoration: none;
}

</style>
