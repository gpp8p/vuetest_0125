<template>
  <div>
    <label for="t1">Enter Something:</label>
    <input type="text" v-model="textEntered" size="32" name="t1"/>
    <input type="button" @click="sendData" value="Send it!" />
    <input type="button" @click="postData" value="Post it!" />
    <br/>
    <file-upload></file-upload>
    <br/>
    <label for="userEmail">User Email:</label>
    <input type="text" v-model="email" size="32" name="userEmail"/>
    <label for="userPassword">User Password:</label>
    <input type="text" v-model="password" size="32" name="userPassword"/>
    <input type="button" @click="sendLogin" value="Log In" />




  </div>
</template>

<script>
import axios from "axios";
import fileUpload from "../components/fileUpload.vue";
export default {
  name: "testRequest",
  components: {fileUpload},
  data() {
    return {
      textEntered: '',
      email:'',
      password:''
    }
  },
  methods:{
    sendData(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

      axios.get(apiPath+'api/shan/testGet?XDEBUG_SESSION_START=12666', {
//      axios.get('http://localhost:8000/api/shan/testGet?XDEBUG_SESSION_START=12666', {
        params:{
          textEntered:this.textEntered
        }

      }).then(response=>{
        console.log(response);
      }).catch(e=>{
          console.log('error:',e);
      });
    },

    postData(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

      axios.post(apiPath+'api/shan/testPost??XDEBUG_SESSION_START=11947', {
//      axios.post('http://localhost:8000/api/shan/testPost??XDEBUG_SESSION_START=11947', {
          textEntered:this.textEntered
      }).then(response=>{
        console.log(response);
      }).catch(e=>{
        console.log('error:',e);
      });
    },

    sendLogin(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

      axios.post(apiPath+'api/auth/login?XDEBUG_SESSION_START=11947', {
//      axios.post('http://localhost:8000/api/auth/login?XDEBUG_SESSION_START=11947', {
        email:this.email,
        password:this.password
      }).then(response=>{
        console.log(response);
      }).catch(e=>{
        console.log('error:',e);
      });
    }
  }
}
</script>

<style scoped>

</style>
