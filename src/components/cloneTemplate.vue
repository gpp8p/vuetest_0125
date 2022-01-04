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
            <input v-model="menu_label"  size="35"  />
         </span>
     </span>
    <span class="labelPlusInput">
        <span>
          Layout Description:
        </span>
       <span>
          <input v-model="description"  size="45" />
       </span>
     </span>
    <span class="labelPlusInput">
        <span>
          Permissions::
        </span>
       <span>
          <o-radio v-model="permType" name="imageType"  native-value="default">
          Use Defaults
          </o-radio>
          <o-radio v-model="permType" name="imageType"  native-value="template">
          Copy from Template
          </o-radio>
       </span>
     </span>

  </span>

</template>

<script>
import axios from "axios";

export default {
  name: "cloneTemplate",
  data(){
    return {
      description: '',
      menu_label: '',
      entriesOk:false,
      menu_label_entered:false,
      description_entered: false,
      permType: 'default'
    }
  },
  methods:{

    entriesAreOk(){
      if(this.description.length >0 && this.menu_label.length >0){
        return true;
      }else{
        return false;
      }
    },
    makeTemplateClone(){
      axios.post('http://localhost:8000/api/shan/cloneTemplate?XDEBUG_SESSION_START=14668', {
        params:{
          templateId: this.sourceTemplateId,
          orgId: this.$store.getters.getOrgId,
          description: this.description,
          menu_label: this.menu_label,
          permType: this.permType
        }
      })
      .then(response => {
        console.log(response);
        this.$emit('cloneSuccessful', response.data);

      })
      .catch(e => {
        console.log(e,'- cloneTemplate failed');
      });

    }
  },
  watch: {
    cmdVersion: function () {
      switch(this.cmd){
        case 'doCloneTemplate':{
//          debugger;

          console.log('watch triggered in cloneTemplate - ', this.cmd,' entriesOk-', this.entriesAreOk());
          break;
        }
      }
//      this.$emit('clearCmd');
      if(this.entriesAreOk()){
        this.$emit('setTitle','Entries are OK!');
        this.makeTemplateClone();
      }
    }
  },

  props:{
    cmd:{
      type: String,
      required: true
    },
    cmdVersion:{
      type:Number,
      required:true
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
