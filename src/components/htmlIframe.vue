<template>
  <iframe :src="this.htmlSrc" id="myIframe" scrolling="no" type="text/html" frameborder="0"
          style="position: relative; height: 100%; width: 100%;"></iframe>
</template>

<script>
import axios from "axios";

export default {
name: "htmlIframe",
  mounted(){
    this.getHtmlFile();
  },

  unmounted(){
    URL.revokeObjectURL(this.htmlSrc);
  },

  data(){
    return {
      htmlSrc:{}
    }
  },
  props:{
    fileLocation: {
      type: String,
      required: true
    }
  },
  methods: {
    getHtmlFile(){
      console.log('getting pdf', this.fileLocation);
      axios.get('http://localhost:8000/api/shan/getFile?XDEBUG_SESSION_START=14668',{
        responseType: "blob",
        params:{
          path: this.fileLocation
        }
      }).then(response => {
        console.log("Success", response);
        const blob = new Blob([response.data], {type: "text/html"});
        this.htmlSrc = URL.createObjectURL(blob);
      })
    }
  }
}
</script>

<style scoped>

</style>
