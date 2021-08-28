<template>
  <div class="directLoginPage">
    <span class="directLoginDialog">
      <direct-login-component :cmd = "this.cmd" @login="login" @register="register" @newLayout="newLayout" @logError="logError" @message="message"></direct-login-component>
    </span>
  </div>
</template>

<script>
import directLoginComponent  from "./directLoginComponent";
export default {
name: "directLogin",
  components:{directLoginComponent},
  props:{
    cmd:{
      type: String,
      required: true
    }
  },
  mounted(){
    this.$emit('layoutMessage',['error','This page is protected.  Please log in.',0]);
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

    }
  }
}
</script>

<style scoped>

.directLoginPage {
  display:grid;
  grid-template-columns: 35% 40% 35%;
  grid-template-rows: 33% 33% 33%;
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


</style>
