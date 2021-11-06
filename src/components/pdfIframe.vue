<template>
  <iframe :src="this.pdfSrc" id="myIframe" scrolling="no" type="application/pdf" frameborder="0"
          style="position: relative; height: 100%; width: 100%;"></iframe>
</template>

<script>
import axios from "axios";

export default {
name: "pdfIframe",
  mounted(){
    this.getPdf();
  },

  unmounted(){
    URL.revokeObjectURL(this.pdfSrc);
  },

  data(){
    return {
      pdfSrc:{}
    }
  },
  props:{
    fileLocation: {
      type: String,
      required: true
    }
  },
  methods: {
    getPdf(){
      console.log('getting pdf', this.fileLocation);
      axios.get('http://localhost:8000/api/shan/getFile?XDEBUG_SESSION_START=14668',{
        responseType: "blob",
        params:{
          path: this.fileLocation
        }
      }).then(response => {
        console.log("Success", response);
        const blob = new Blob([response.data], {type: "application/pdf"});
        this.pdfSrc = URL.createObjectURL(blob);
      })
    }
  }
}
</script>

<style scoped>

</style>
