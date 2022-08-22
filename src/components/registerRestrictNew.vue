<template>
  <span>
    <span class="labelPlusInput">
         <span>
            Email:
         </span>
         <span>
            <o-input v-model="userEmail"></o-input>
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Name:
         </span>
         <span>
            <o-input v-model="userName"></o-input>
         </span>
     </span>
  </span>
</template>

<script>
import axios from "axios";

export default {

  name: "registerRestrictNew",
  mounted(){
    this.$emit('subCmd', this.subCmd);
  },
  props:{
    selectedMenuOption: {
      type: String,
      required: true
    },
    org:{
      type: Number,
      required: true
    },
    selectedMember:{
      type: Object,
      required: false
    }
  },

  data(){
    return {
      userEmail:'',
      userName:'',
    }
  },
  methods:{
    saveAddRestrict(){
      var apiPath = this.$store.getters.getApiBase;
      var orgToUse;
      if(this.org===null){
        orgToUse = this.$store.getters.getOrgId;
      }else{
        orgToUse = this.org;
      }
      debugger;
      axios.get(apiPath+'api/shan/saveRestrictedRegistrant?XDEBUG_SESSION_START=14668', {
        params: {
          orgId: orgToUse,
          name: this.userName,
          email: this.userEmail
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            if(response.data=="ok"){
              this.$emit('allowedRegistrantSaved');
            }else{
              console.log('error saving allowedRergistrant'.response);
              this.$emit('errorRegRestriction');
            }
            console.log(response);
          })
          .catch(e => {
            this.errors.push(e);
            console.log('getRestrictedRegistrants failed');
          });
    },
    subCmd(subCommand){
      switch(subCommand){
        case 'saveAllowedRegistrant':{
          debugger;
          this.saveAddRestrict();
          break;
        }
        case 'editAllowedMember':{
          debugger;
          this.userEmail = this.selectedMember.email;
          this.userName = this.selectedMember.name;
          break;
        }
        case 'updateAllowedMember':{
          debugger;
          this.updateAllowedMember();
          break;
        }

      }
    },
    updateAllowedMember(){
      var apiPath = this.$store.getters.getApiBase;
      axios.get(apiPath+'api/shan/updateAllowedRegistrant?XDEBUG_SESSION_START=14668', {
        params: {
          regId: this.selectedMember.id,
          name: this.userName,
          email: this.userEmail
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            if(response.data=="ok"){
              this.$emit('allowedRegistrantSaved');
            }else{
              console.log('error saving allowedRergistrant'.response);
              this.$emit('errorRegRestriction');
            }
            console.log(response);
          })
          .catch(e => {
            this.errors.push(e);
            console.log('getRestrictedRegistrants failed');
          });
    },


  }


}
</script>

<style scoped>
.newUserWrapper {
  display:grid;
  grid-template-rows: 30% 30%;

}
.labelPlusInput {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 30% 70%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}

.inputStyle {
  padding:4px;
  border-radius:4px;
}
</style>
