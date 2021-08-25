<template>
  <div>
    <direct-login-component :cmd = "this.cmd" @login="login" @register="register" @newLayout="newLayout" @logError="logError"></direct-login-component>
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
  methods:{
    login(msg){
      console.out('directLogin login-',msg);

    }
  }
}
</script>

<style scoped>

</style>
