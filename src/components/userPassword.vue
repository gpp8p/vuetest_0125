<template>
  <span class="newUserWrapper">
    <form>
    <span class="labelPlusInput">
         <span>
            Email:
         </span>
         <span>
            {{this.currentCardData.email}}
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Name:
         </span>
         <span>
            {{this.currentCardData.name}}
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Password:
         </span>
         <span>
            <input type="password" v-model="userPassword"  size="40" class="inputStyle" />
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Password Confirm:
         </span>
         <span>
            <input type="password" v-model="userPasswordRepeat"  size="40" class="inputStyle" />
         </span>
     </span>
      </form>
  </span>
</template>

<script>
import axios from "axios";
//import Vue from 'vue';

export default {
name: "userPassword",
  props:{
    cmd:{
      type: String,
      required: false
    },
    currentCardData:{
      type: Object,
      required:false
    }
  },
  mounted(){
/*
    let self = this
    Vue.nextTick()
        .then(function () {
          console.log(self.$refs.email.focus())
        })
*/
  },
  data(){
    return {
      userName:'',
      userEmail:'',
      userPassword:'',
      userPasswordRepeat:'',
      existingUserData:{}
    }
  },
  methods:{








    checkEntryFields(){
      if(this.userPasswordRepeat==''){
        this.$emit('setTitle','You must enter a Password!!');
      }
      if(this.userPassword!=this.userPasswordRepeat){
        this.$emit('setTitle','The passwords must match !');
      }else{
        return true;
      }
      return false;
    },
    updatePassword() {
      axios.post('http://localhost:8000/api/shan/updatePassword?XDEBUG_SESSION_START=17516', {
        params: {
          email: this.currentCardData.email,
          password: this.userPassword,
        }
      }).then(response => {
        debugger;
        if (response.data == 'ok') {
          console.log('registration has been saved');
          this.$emit('registrationSaved', ['ok']);
        }

      }).catch(function (error) {
        console.log(error);
      });
    },





    saveRegistration(){
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
  },
  watch :{
    cmd: function(){
      debugger;
      console.log('userPassword cmd', this.cmd);
      switch(this.cmd){
        case 'saveRegistration':{
          if(this.checkEntryFields()){
            this.saveRegistration()
          }
          break;
        }
        case 'changePassword':{
          if(this.checkEntryFields()){
            console.log('password entry ok');
            this.updatePassword();
          }else{
            alert('You must enter password in both fields and they must match');
          }
          this.$emit('clearCmd');
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
          axios.post('http://localhost:8000/api/shan/createUser?XDEBUG_SESSION_START=17516', {
            params:{
              name:this.userName,
              email:this.userEmail,
              password:this.userPassword,
              org: this.$store.getters.getOrgId
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
