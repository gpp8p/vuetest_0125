<template>
  <span class="newUserWrapper">
    <form>
    <span class="labelPlusInput">
         <span>
            Email:
         </span>
         <span>
            <input type="text" v-model="userEmail" ref="email" size="60" class="inputStyle"  placeholder="Email" @blur="focusChangedUserEmail"/>
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Name:
         </span>
         <span>
            <input v-model="userName" ref="name" size="40" class="inputStyle" placeholder="Name" @blur="focusChangedUserName" />
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Password:
         </span>
         <span>
            <input type="password" v-model="userPassword"  size="40" class="inputStyle" @blur="focusChangedPass1"/>
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Password:
         </span>
         <span>
            <input type="password" v-model="userPasswordRepeat"  size="40" class="inputStyle" @blur="focusChangedPass2"/>
         </span>
     </span>
      </form>
  </span>
</template>

<script>
import axios from "axios";
import Vue from 'vue';

export default {
name: "registerUser",
  props:{
    cmd:{
      type: String,
      required: false
    },
    selectedOrgId:{
      type: Number,
      required: false
    }
  },
  mounted(){
    if(typeof(this.selectedOrgId)=='undefined'){
      this.orgId = this.$store.getters.getOrgId;
    }else {
      this.orgId = this.selectedOrgId;
    }
    console.log('orgId is:', this.orgId);
    let self = this
    Vue.nextTick()
        .then(function () {
          console.log(self.$refs.email.focus())
        })
  },
  data(){
    return {
      userName:'',
      userEmail:'',
      userPassword:'',
      userPasswordRepeat:'',
      existingUserData:{},
      orgId:0
    }
  },
  methods:{
    focusChangedUserName(){

      if(this.userName==''){
        this.$emit('setTitle','You must enter a name!');
      }else{
        this.$emit('setTitle','Register New User');
      }

    },
    focusChangedUserEmail(){

      if(this.userEmail==''){
        this.$emit('setTitle','You must enter an Email !!');
      }else {
        if(!this.validateEmail(this.userEmail)){
          this.$emit('setTitle', 'You must enter a valid email');
          this.userEmail='';
          return;
        }
        this.$emit('setTitle', 'Register New User');
        var apiPath = this.$store.getters.getApiBase;
        console.log('apiPath - ',apiPath);

        axios.get(apiPath+'api/shan/userExists?XDEBUG_SESSION_START=14668', {
//          axios.get('http://localhost:8000/api/shan/userExists?XDEBUG_SESSION_START=14668', {
          params: {
            email: this.userEmail
          }
        }).then(response => {
// eslint-disable-next-line no-debugger
          // JSON responses are automatically parsed.
          debugger;
          if (response.data.result == true) {
            console.log('user exists');
            this.$emit('setTitle', "User " + response.data.name + "(" + response.data.email + ") already exists!");
            this.existingUserData.name = response.data.name;
            this.existingUserData.email = response.data.email;
            this.existingUserData.id = response.data.id;
            this.existingUserData.is_admin = response.data.is_admin;
            this.$emit('userExists', this.existingUserData);
          } else {
            console.log('user does not exist');
          }

        })
            .catch(e => {
              this.errors.push(e);
              console.log('user exists failed', e);
            });
      }


    },

    focusChangedPass1(){

      if(this.userPassword==''){
        this.$emit('setTitle','You must enter a Password!!');
      }else{
        this.$emit('setTitle','Register New User');
      }
      if(this.userPassword.length<6){
        this.$emit('setTitle','Password must be 6 or more characters!!');
      }
    },
    focusChangedPass2(){
      debugger;
      if(this.checkEntryFields()==true){
        this.$emit('setTitle','Click on Save Registration to register !');
      }else{
        this.$emit('setTitle','Problem with your entries - please correct!!');
      }
    },
    validateEmail(email){
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },


    checkEntryFields(){
      if(this.userPasswordRepeat==''){
        this.$emit('setTitle','You must enter a Password!!');
      }
      if(this.userPassword.length<6){
        this.$emit('setTitle','Password must be 6 or more characters!!');
        return false;
      }
      if(this.userPassword!=this.userPasswordRepeat){
        this.$emit('setTitle','The passwords must match !');
      }else if(this.userEmail!='' && this.userEmail!='' && this.userPassword!=''){
//        this.$emit('componentSettingsMounted', [['Save Registration','Cancel'],'Cancel']);
        return true;
      }else{
        this.$emit('setTitle','All fields must be entered !');
        return false
      }
      return false;
    },
    saveRegistration(){
      debugger;
      if(this.checkEntryFields()==false){
        this.$emit('setTitle','Entry errors - please correct !');
        this.$emit('clearCmd');
        return;
      }
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      axios.post(apiPath+'api/shan/setupNewUser?XDEBUG_SESSION_START=17516', {
//        axios.post('http://localhost:8000/api/shan/setupNewUser?XDEBUG_SESSION_START=17516', {
        params:{
          name:this.userName,
          email:this.userEmail,
          password:this.userPassword,
          org: this.orgId
        }
      }).then(response=>
      {
            debugger;
        if(response.data.result=='ok'){
          console.log('registration has been saved');
          this.$emit('registrationSaved',['ok',response.data.userName, response.data.email, response.data.userId]);
        }
        if(response.data.result=='userFound'){
          this.$emit('registrationSaved',['userFound',response.data.userName, response.data.email, response.data.userId]);
        }

      }).catch(function(error) {
        console.log(error);
      });

    }
  },
  watch :{
    cmd: function(){
      debugger;
      console.log('registerUser cmd', this.cmd);
      switch(this.cmd){
        case 'saveRegistration':{
          if(this.checkEntryFields()){
            this.saveRegistration()
          }
          break;
        }
      }
      if(this.cmd=='saveRegistration'){
/*
        debugger;
        if(this.checkEntryFields()){
          axios.post('http://localhost:8000/api/shan/setupNewUser?XDEBUG_SESSION_START=17516', {
            params:{
              name:this.userName,
              email:this.userEmail,
              password:this.userPassword,
              org: this.$store.getters.getOrgId
            }
          }).then(response=>
          {
            debugger;
            if(response.data.result=='ok'){
              console.log('registration has been saved');
              this.$emit('registrationSaved',['ok',response.data.userName, response.data.email, response.data.userId]);
            }
            if(response.data.result=='userFound'){
              this.$emit('registrationSaved',['userFound',response.data.userName, response.data.email, response.data.userId]);
            }

          }).catch(function(error) {
            console.log(error);
          });
        }

 */
      }else if(this.cmd=='newUserOnlyRegistration'){
        if(this.checkEntryFields()){
          var apiPath = this.$store.getters.getApiBase;
          console.log('apiPath - ',apiPath);


          axios.post(apiPath+'api/shan/createUser?XDEBUG_SESSION_START=17516', {
//          axios.post('http://localhost:8000/api/shan/createUser?XDEBUG_SESSION_START=17516', {
            params:{
              name:this.userName,
              email:this.userEmail,
              password:this.userPassword,
              org: this.orgId
            }
          }).then(response=>
          {
//            debugger;
            if(response.data.result=='ok'){
              console.log('registration has been saved');
              this.$emit('registrationSaved',['ok',response.data.userName, response.data.email, response.data.userId]);
            }
            if(response.data.result=='userFound'){
              this.$emit('registrationSaved',['userFound',response.data.userName, response.data.email, response.data.userId]);
            }

          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    }
  }
}
</script>

<style scoped>
.newUserWrapper {
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

.inputStyle {
  padding:4px;
  border-radius:4px;
}

</style>
