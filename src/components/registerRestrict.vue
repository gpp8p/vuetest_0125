<template>
  <span>
    <span v-if="this.mode==SHOW_ALLOWED_REGS">
      <register-restrict-show @emailSelected="emailSelected" :org="org" @subCmd="setSubCmd" ></register-restrict-show>
    </span>
    <span v-if="this.mode==this.NEW_REG">
      <register-restrict-new :org="org" @allowedRegistrantSaved ="allowedRegistrantSaved" @subCmd="setSubCmd" ></register-restrict-new>
    </span>
  </span>
</template>

<script>
import registerRestrictShow from "../components/registerRestrictShow.vue";
import registerRestrictNew from "../components/registerRestrictNew.vue";
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
      subCmd: null

    }
  },
  methods :{
    setSubCmd(msg){
      this.subCmd = msg;
    },
    allowedRegistrantSaved(){
      this.mode=this.SHOW_ALLOWED_REGS;
//      this.$emit('allowedRegistrantSaved');
    },
    childCmd(parentCommand){
      console.log('parentCommand = ', parentCommand);
      debugger;
      switch(parentCommand){
        case 'regBackToTop':{
          this.mode=this.SHOW_ALLOWED_REGS;
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
        case 'deleteAllowedRegistrant':{
          break;
        }
      }
      this.componentKey += 1;
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
