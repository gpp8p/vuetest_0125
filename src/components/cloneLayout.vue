<template>
  <span class="newLayoutWrapper">
     <span class="labelPlusInput">
         <span>
            Source Template:
         </span>
         <span>
            {{this.sourceTemplate}}
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Layout Name:
         </span>
         <span>
            <input v-model="menu_label"  size="35" @change="menu_label_changed" />
         </span>
     </span>
    <span class="labelPlusInput">
        <span>
          Layout Description:
        </span>
       <span>
          <input v-model="description" @change="description_changed" size="45"/>
       </span>
     </span>

  </span>

</template>

<script>
export default {
  name: "cloneLayout",
  data(){
    return {
      description: '',
      menu_label: ''
    }
  },
  watch: {
    cmd: function () {
      switch(this.cmd){
        case 'cloneLayout':{
          console.log('watch triggered in cloneLayout - ', this.cmd);
          break;
        }
      }
    }
  },

  props:{
    cmd:{
      type: String,
      required: true
    },
    sourceTemplate:{
      type: String,
      required: true
    },
    sourceTemplateId:{
      type: Number,
      required: true
    }
  },
}
</script>

<style scoped>
.newLayoutWrapper {
  margin-left: 4px;
  display:grid;
  grid-template-rows: 15% 15% 15% 15% 15%;

}
.labelPlusInput {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 30% 70%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.colorSpan{
  width: 50px;


  font-family: Helvetica;
  font-size: smaller;
}
.colorSpanLabel {
  width: 150Px;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
