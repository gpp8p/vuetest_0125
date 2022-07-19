<template>
  <div class="directLoginPage">
    <span class="directLoginDialog" v-if="this.mode==this.LOGGING_IN">
      <direct-login-component :cmd = "this.cmd" @login="login" @register="register" @newLayout="newLayout" @logError="logError" @message="message"></direct-login-component>
    </span>
    <span v-if="this.mode==this.REGISTERING" class="registerWrapper">
      <register-user :cmd="registerCommand" :cmdVersion="directLoginCmdVersion" class="register"></register-user>
      <span class="registerCmd"><span @click="cancelRegister" class="registerCmd1">Cancel</span><span class="registerCmd1">Register</span></span>
    </span>
  </div>
</template>

<script>
import directLoginComponent  from "./directLoginComponent";
import registerUser from "./registerUser.vue"
export default {
name: "directLogin",
  components:{directLoginComponent, registerUser},
  props:{
    cmd:{
      type: String,
      required: true
    }
  },
  mounted(){
    console.log('direct login mounted');
    this.$emit('layoutMessage',['error','This page is protected.  Please log in.',0]);
  },
  data(){
    return {
      mode: 0,
      LOGGING_IN:0,
      REGISTERING:1,
      registerCommand:'',
      directLoginCmdVersion:0

    }
  },
  methods:{
    login(msg){
      debugger;
      this.$emit('layoutMessage',['clear','',0]);
      this.$emit('login', [msg[0]]);
    },
    message(msg){
      console.log('message:',msg);
      this.$emit('layoutMessage',['error','Please re-enter your login or hit back button to go back to where you came from.',0]);

    },
    register(){
      this.mode=this.REGISTERING;
    },
    cancelRegister(){
      this.mode=this.LOGGING_IN;
    }
  }
}
</script>

<style scoped>

.directLoginPage {
  display:grid;
  grid-template-columns: 35% 40% 35%;
  grid-template-rows: 40% 40% 20%;
  height: 600px;

}

.directLoginDialog {
    margin-top: 10%;
    grid-row-start: 2;
    grid-row-end: 3;
    grid-column-start: 2;
    grid-column-end: 3;
    background-color: #d6cee7;
    border-style: solid;
    border-width: 2px;
    border-radius: 10px;
    box-shadow: 10px 10px 8px #75a1a2;

}
.registerWrapper {
  margin-top: 10%;
  display:grid;
  grid-template-rows: 80% 20%;
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column-start: 2;
  grid-column-end: 3;
  background-color: #d6cee7;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  box-shadow: 10px 10px 8px #75a1a2;
  margin-top: 5%;
}
.register {
  margin:3%;
  margin-bottom:2%;
}
.registerCmd {
  margin-left: 45%;
  margin-top: 1%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.registerCmd1 {

  margin-right: 5%;
}


</style>
