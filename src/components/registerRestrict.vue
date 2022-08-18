<template>
  <span>
    <span v-if="this.mode==SHOW_ALLOWED_REGS">
      <register-restrict-show @emailSelected="emailSelected" :org="org" :cmd="cmd" :cmdVersion="cmdVersion"></register-restrict-show>
    </span>
    <span v-if="this.mode==this.NEW_REG">
      <register-restrict-new :org="org" :cmd="cmd" :cmdVersion="cmdVersion"></register-restrict-new>
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
    cmd:{
      type: String,
      required: false
    },
    cmdVersion:{
      type: Number,
      required: false
    },
    org:{
      type: Number,
      required: true
    }
  },
  mounted(){
    this.mode=this.SHOW_ALLOWED_REGS;
  },
  data(){
    return {
      mode:0,
      SHOW_ALLOWED_REGS:0,
      NEW_REG:1,
      SAVE_REG:2,
      DELETE_REG:3,
    }
  },
  watch:{
    cmdVersion: function(){
      console.log('registerRestrict new cmd - ', this.cmd);
      switch(this.cmd){
        case 'showAllowedRegisterants':{
          this.mode=this.SHOW_ALLOWED_REGS;
          break;
        }
        case 'newAllowedRegistrant':{
          this.mode=this.NEW_REG;
          break;
        }
        case 'saveNewRegistrant':{
          break;
        }
        case 'deleteAllowedRegistrant':{
          break;
        }
      }
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
