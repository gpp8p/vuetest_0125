<template>
  <span class="newLayoutWrapper">
     <span class="labelPlusInput">
         <span>
            Template:
         </span>
         <span>
            {{this.sourceTemplate}}
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Page Name:
         </span>
         <span>
            <input v-model="menu_label"  size="31" maxlength="31"  />
         </span>
     </span>
    <span class="labelPlusInput">
        <span>
          Page Description:
        </span>
       <span>
          <input v-model="description"  size="45" maxlength="45" />
       </span>
     </span>
    <span class="labelPlusInput">
        <span>
          Permissions::
        </span>
       <span>
          <o-radio  v-model="permType" name="imageType"  native-value="default">
          Open Access
          </o-radio>
          <o-radio v-if="this.parentFound==1" v-model="permType" name="imageType"  native-value="template">
          Copy Page Permissions (Restricted)
          </o-radio>
        <div v-if="this.parentFound==0" >
            Cannot copy permissions - no parent.
          </div>
       </span>
     </span>

  </span>

</template>

<script>
import axios from "axios";
import store from "@/store";
export default {
  name: "cloneTemplate",
  store,
  data(){
    return {
      description: '',
      menu_label: '',
      entriesOk:false,
      menu_label_entered:false,
      description_entered: false,
      permType: 'default',
      parentFound:0
    }
  },
  created(){
    this.parentFound = this.$store.getters.getIsLayoutGroup;
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
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

      axios.post(apiPath+'api/shan/cloneTemplate?XDEBUG_SESSION_START=14668', {
//      axios.post('http://localhost:8000/api/shan/cloneTemplate?XDEBUG_SESSION_START=14668', {
        params:{
          layoutId: this.$store.getters.getCurrentLayoutId,
          templateId: this.sourceTemplateId,
          orgId: this.$store.getters.getOrgId,
          description: this.description,
          menu_label: this.menu_label,
          permType: this.permType,
          copyIt: this.copyIt
        }
      })
      .then(response => {
        console.log(response);
        console.log('route status after makeTemplateClone', this.$route.name);
        console.log('cmd after makeTemplateClone:'+this.cmd);
//        debugger;
        if(this.$route.name == 'edit'){
//        from a link mod
          if(this.cmd == 'doAddThisPageCopy') {
            this.$emit('addCloneSuccessful', response.data);
          }else if(this.cmd == 'doCloneTemplateAdd'){
            this.$emit('doCloneTemplateAddSuccessful', response.data);
          }else{
            this.$emit('cloneSuccessfulReturnToEdit', response.data);
          }

        }else{
//        from a top-level create
          this.$emit('cloneSuccessful', response.data);
        }
      })
      .catch(e => {
        console.log(e,'- cloneTemplate failed');
      });

    }
  },
  watch: {
    cmdVersion: function () {
      console.log('cmdVersion in cloneTemplate triggered cmd - ',this.cmd);
      switch(this.cmd){
        case 'doCloneTemplate':{
//          debugger;

          console.log('watch triggered in cloneTemplate - ', this.cmd,' entriesOk-', this.entriesAreOk());

          break;
        }
        case 'doCloneTemplateAdd':{
//          debugger;

          console.log('watch triggered in cloneTemplate - ', this.cmd,' entriesOk-', this.entriesAreOk());

          break;
        }
        case 'doCopyLayout':{
          console.log('watch triggered in cloneTemplate doCopyLayout - ', this.cmd,' entriesOk-', this.entriesAreOk());
          break
        }
        case 'doAddThisPageCopy':{
          console.log('watch triggered in cloneTemplate doCopyLayout - ', this.cmd,' entriesOk-', this.entriesAreOk());
          break
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
    },
    copyIt:{
      type: Boolean,
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
