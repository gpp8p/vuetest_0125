<template>
  <span>
    <span v-if="this.mode==SHOW_ALLOWED_REGS">
      <register-restrict-show @emailSelected="emailSelected" :org="org" @subCmd="setSubCmd" @allowedMemberSelected="allowedMemberSelected"></register-restrict-show>
    </span>
    <span v-if="this.mode==this.NEW_REG">
      <register-restrict-new :org="org" @allowedRegistrantSaved ="allowedRegistrantSaved" @subCmd="setSubCmd" :selectedMember="selectedMember"></register-restrict-new>
    </span>
  </span>
</template>

<script>
import registerRestrictShow from "../components/registerRestrictShow.vue";
import registerRestrictNew from "../components/registerRestrictNew.vue";
import axios from "axios";
export default {
name: "registerRestrict",
  components: {registerRestrictShow, registerRestrictNew},
  props:{
    selectedMenuOption: {
      type: String,
      required: true
    },
    org:{
      type: Number,
      required: true
    }
  },
  mounted(){
    this.$emit('childCmd', this.childCmd);
    this.mode=this.SHOW_ALLOWED_REGS;
  },
  data(){
    return {
      mode:0,
      SHOW_ALLOWED_REGS:0,
      NEW_REG:1,
      SAVE_REG:2,
      DELETE_REG:3,
      parentCmd:'',
      subCmd: null,
      selectedMember: null

    }
  },
  methods :{
    setSubCmd(msg){
      console.log('subCmd has been set in registerRestrict');
      this.subCmd = msg;
    },
    allowedRegistrantSaved(){
      this.mode=this.SHOW_ALLOWED_REGS;
 /*
      this.$nextTick(() => {
        console.log('dom has been updated');
        this.subCmd('loadAllowedMembers');
      });

  */
//      this.$emit('allowedRegistrantSaved');
    },
    allowedRegistrantDeleted(){
      this.subCmd('loadAllowedMembers');
    },
    allowedMemberSelected(msg){
      this.selectedMember = msg;
      this.$emit('allowedMemberSelected');
    },
    childCmd(parentCommand){
      console.log('parentCommand = ', parentCommand);
      debugger;
      switch(parentCommand){
        case 'regBackToTop':{
          this.mode=this.SHOW_ALLOWED_REGS;
          break;
        }
        case 'editAllowedMember':{
          this.mode=this.NEW_REG;
          console.log('setting subCmd editAllowedMember');
          this.$nextTick(() => {
            console.log('dom has been updated');
            this.subCmd('editAllowedMember');
          });
          break;
        }
        case 'updateAllowedMember':{
          this.subCmd('updateAllowedMember');
          break;
        }
        case 'showAllowedRegisterants':{
          this.mode=this.SHOW_ALLOWED_REGS;
          break;
        }
        case 'loadNewAllowedReg':{
          this.mode=this.SHOW_ALLOWED_REGS;
          break;
        }
        case 'newAllowedRegistrant':{
          this.mode=this.NEW_REG;
          break;
        }
        case 'saveAddRestrict':{
          this.subCmd('saveAllowedRegistrant');
          break;
        }
        case 'deleteAllowedMember':{
          this.deleteAllowedMember();
          break;
        }
      }
      this.componentKey += 1;
    },
    deleteAllowedMember(){
      var apiPath = this.$store.getters.getApiBase;
      axios.get(apiPath+'api/shan/deleteAllowedRegistrant?XDEBUG_SESSION_START=14668', {
        params: {
          regId: this.selectedMember.id,
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            if(response.data=="ok"){
              this.allowedRegistrantDeleted();
            }else{
              console.log('error deleting allowedRergistrant'.response);
              this.$emit('errorRegRestriction');
            }
            console.log(response);
          })
          .catch(e => {
            this.errors.push(e);
            console.log('deleteAllowedRegistrant failed');
          });
    }
  }
}
</script>

<style scoped>
span {
  font-family: Arial;
  font-size: smaller;
  --oruga-table-color: green;
  --oruga-table-background-color: #ab97ff;
  --oruga-table-background: #ab97ff;
  --oruga-table-detail-background: #ab97ff;
}

</style>
