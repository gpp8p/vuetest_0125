<template>
    <span>
        <span v-if="this.logStatus===this.NOT_LOGGED" class="notLogged">
            <span>
                 Welcome Guest !
            </span>
            <span>
                <a @click="showLogin">Please Log In</a>
            </span>
        </span>
        <span v-if="this.logStatus===this.SHOW_LOGIN" class="login">
                    <span></span>

                     <label class="labelStyle" for="email">Mail:</label>
                    <input type="text" id="email" name="email" size="30" v-model="email" ref="emailField" class="loginField"/>
                    <span></span>
                    <label class="labelStyle" for="password">Password:</label>
                    <input type="password" id="password" size="30" maxlength="65" v-model="password" class="loginField"/>

                      <span></span>
                     <span class="labelLinkStyle" @click="doLogin">Login </span>
                     <span class="labelLinkStyle" @click="cancelLogin">Cancel</span>


        </span>
        <span v-if="this.logStatus===this.LOGGED_IN" >
            <span v-if="this.credentials.loggedInUser==='GuestUser'" class="notLogged">
                 <span>
                     Welcome Guest !
                </span>
                <span class ="log1">
                  <a @click="showLogin">Please Log In</a>
                </span>
               <span class ="log1">
                  <a @click="register">Register</a>
                </span>
            </span>
            <span v-else class="loggedIn">
                 <span>
                     Welcome {{this.credentials.loggedInUser}}
                </span>
                <span>
                    <a @click="doLogout">Log Out</a>
                </span>
            </span>
        </span>
        <span v-if="this.logStatus===this.LOGIN_ERROR" class="loggedIn">
                 <span>
                     Sorry - That Login Failed
                </span>
                <span>
                    <a @click="showLogin">Try Again</a>
                </span>
        </span>
    </span>
</template>

<script>
    import axios from "axios";
    import store from "../store";
    export default {
        name: "directLoginComponent",
        mounted(){
          if(this.cmd=='directLogin'){
            this.logStatus=this.SHOW_LOGIN;
          }else{
            console.log(sessionStorage.length);
            if(sessionStorage.length>0) {
//                debugger;
              this.credentials.bearerToken = sessionStorage.getItem('bearerToken');
              this.credentials.loggedInUser = sessionStorage.getItem('loggedInUser');
              this.credentials.loggedInUserId = sessionStorage.getItem('loggedInUserId');
              this.credentials.is_admin = sessionStorage.getItem('is_admin');
              this.default_org = sessionStorage.getItem('default_org');

              var thisStringLayoutIdStack = sessionStorage.getItem('layoutIdStack');
              var thisLayoutIdStack;
              if(thisStringLayoutIdStack==null){
                thisLayoutIdStack = [];
              }else{
                thisLayoutIdStack = JSON.parse(thisStringLayoutIdStack);
                var topStack = thisLayoutIdStack[thisLayoutIdStack.length-1];
                if(topStack!=this.$route.params.layoutId){
                  this.$emit('newLayout', [this.$route.params.layoutId]);
                }
              }
              axios.defaults.headers.common['Authorization'] = `Bearer ${this.credentials.bearerToken}`;
              store.commit('setBearerToken', this.credentials.bearerToken);
              store.commit('setLoggedInUserId', this.credentials.loggedInUserId);
              store.commit('setLoggedInUser', this.credentials.loggedInUser);
              store.commit('setIsAdmin', this.credentials.is_admin);
              store.commit('setDefaultOrg', this.default_org);
              store.commit('setOrgId', sessionStorage.getItem('org_id'));

              this.logStatus=this.LOGGED_IN;

            }else{
              this.status=this.SHOW_LOGIN;
            }
          }
//            console.log(this.$store.getters.getDefaultOrg[0]);
        },
      props:{
        cmd:{
          type: String,
          required: true
        }
      },
        data(){
            return {
                logStatus: 0,
                NOT_LOGGED:0,
                SHOW_LOGIN:1,
                LOGGED_IN:2,
                LOGIN_ERROR:-1,
                DIRECT_LOGIN:5,
                email:'',
                password:'',
                credentials:{
                    bearerToken: '',
                    loggedInUserId: '',
                    loggedInUser: '',
                    is_admin: 0
                },
            }
        },
        methods:{
            doLogin(){

                this.sendLogin(this.email, this.password, this.setLoginStatus);
            },
            showLogin(){
                this.setLoginStatus(this.SHOW_LOGIN);
            },
            cancelLogin(){
                this.setLoginStatus(this.LOGGED_IN);
            },
            doLogout(){
                this.sendLogin('GuestUser@nomail.com', 'GuestUser', this.setLoginStatus);
            },
            register(){
 //               debugger;
                console.log('register clicked');
//                store.commit('setRegister', true);
                this.$emit('register');
            },
            setLoginStatus(newStatus){
//                debugger;
               if(newStatus<0){
                   this.email='';
                   this.password='';
               }
               this.logStatus=newStatus;
                if(newStatus==this.LOGGED_IN){
                    this.$emit('login', [this.$store.getters.getDirectLoginLink]);
                }
                this.$forceUpdate();
            },
            sendLogin(email, password, setStatus){
                debugger;
                console.log('sendLogin - ',email,password, setStatus, this.$store.getters.getDefaultOrg);
                axios.post('http://localhost:8000/api/auth/login?XDEBUG_SESSION_START=14427', {
                    email: email,
                    password: password,
                    default_org: this.$store.getters.getDefaultOrg
                }).then(response=>
                {
                    if(response.data.resultType==='Ok'){
//                        debugger;
                        this.credentials.bearerToken = response.data.access_token;
                        this.credentials.loggedInUser = response.data.userName;
                        this.credentials.loggedInUserId = response.data.userId;
                        this.credentials.is_admin = response.data.is_admin;
//                        console.log('access token',response.data.access_token);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${this.credentials.bearerToken}`;

                        sessionStorage.setItem('bearerToken', this.credentials.bearerToken);
                        sessionStorage.setItem('loggedInUser', this.credentials.loggedInUser);
                        sessionStorage.setItem('is_admin', this.credentials.is_admin);
                        sessionStorage.setItem('loggedInUserId', this.credentials.loggedInUserId);
                        sessionStorage.setItem('default_org', this.$store.getters.getDefaultOrg);
                        sessionStorage.setItem('org_id', response.data.orgId);


                        store.commit('setOrgId', response.data.orgId);
                        store.commit('setOrgHome', response.data.orgHome);
                        store.commit('setLoggedInUserId', response.data.userId);
                        store.commit('setIsAdmin', response.data.is_admin);
                        store.commit('setCurrentLayoutId', response.data.orgHome);
                        store.commit('setPerms', response.data.loginPerms);
                        console.log('login successful');
                        console.log(response.data);
                        setStatus(this.LOGGED_IN);
                    }else{
//                        debugger;
                        console.log(response.data.resultType);
                        this.$emit('logError', response.data.resultType);
                    }





                }).catch(function(error) {
//                    debugger;
                    console.log(error);
                    setStatus(-1);
                });
            },
        }
    }
</script>

<style scoped>
    .loggedIn {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 30% 30% 30%;
        justify-items: center;
        color: blue;
        font-size: medium;
        font-family: Arial;

    }
    .notLogged {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 30% 30% 30%;
        justify-items: center;
        color: blue;
        font-size: medium;
        font-family: Arial;
    }
    .login {
        margin-top:15%;
        display: grid;
        grid-template-columns: 40% 8% 20%;
        grid-template-rows: 33% 33% 33%;
        row-gap: 3px;
        justify-items: left;
        color: blue;
        font-size: 12px;
    }
    .log1 {
      color: blue;
    }
    .log1:hover {
      color: #ff330a;
    }
    .labelStyle {
        color:blue;
        font-family: Arial;
        font-size: large;

    }

    .labelLinkStyle {
        color:blue;
        font-family: Arial;
        margin-right: 15px;
        font-size: large;
    }
    .labelLinkStyle:hover {
        color:red;
        font-weight: bold;
    }
    .loginField {
        background-color: #dbddd0;
    }



</style>
