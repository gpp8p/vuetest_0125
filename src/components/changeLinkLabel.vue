<template>

    <span class="labelPlusInput">
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
    cmdObjectVersion:{
      type: Number,
      required:false
    },
    linkLabel:{
      type: String,
      required: true
    }
  },
  watch:{
    cmdObjectVersion: function(){
      switch(this.cmd){
        case 'saveLinkLabel':{
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
.labelPlusInput {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 30% 70%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}

</style>
