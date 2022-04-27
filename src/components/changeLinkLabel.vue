<template>

    <span class="optionLabelInput">
        <span>
          Option Label:
        </span>
       <span>
          <input v-model="description"  size="45" />
       </span>
    </span>

</template>

<script>


export default {
name: "changeLinkLabel",
  mounted(){
    this.description = this.linkLabel;
  },
  props:{
    cmd:{
      type: String,
      required: true
    },
    cmdVersion:{
      type: Number,
      required:false
    },
    linkLabel:{
      type: String,
      required: true
    }
  },
  watch:{
    cmdVersion: function(){
      console.log('cmdVersion watch triggered');
      switch(this.cmd){
        case 'replaceDescription':{
          this.$emit('newDescription', this.description);
          break;
        }
      }
    }
  },
  methods :{

  },
  data (){
    return {
      description:''
    }
  }
}
</script>

<style scoped>
.optionLabelInput {
  display:grid;
  margin-top: 3px;
  margin-left: 5%;
  grid-template-columns: 20% 80%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}

</style>
