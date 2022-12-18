<template>
  <span>
    <membership :members="this.orgUsers" :membershipType="membershipType" @memberSelected="memberSelected"></membership>
    <o-checkbox @input="restrictClicked" v-if="this.orgPermissions.admin==true || this.$store.getters.getIsAdmin==1" v-model="restrict">{{restrictLabel}}</o-checkbox>
  </span>
</template>

<script>
import membership from "../components/membership.vue";
import axios from "axios";
//import store from "@/store";
export default {
name: "orgMembership",
  components: {membership},
  props:{
    orgId:{
      type: Number,
      required: true
    },
    cmd:{
      type: String,
      required: false
    }
  },
  mounted(){
    debugger;
//    this.orgId = this.$store.getters.getOrgId;

    if(this.orgId>0){
      if(this.$store.getters.getIsAdmin==1){
//        this.$emit('setMenu','orgMembersMenu');
//        this.$emit('componentSettingsMounted',[['Back','Done', 'Add Member', 'Remove'],'Done']);
        this.getOrgPerms(this.orgId);
        this.$emit('setTitle','Organization Members - Click to Select');
      }else{
        debugger;
        this.getOrgPerms(this.orgId);
/*
        if(this.orgPermissions.admin){
          this.$emit('setMenu','orgMembersAdmin');
//          this.$emit('componentSettingsMounted',[['Back','Done', 'Add Member'],'Done']);
          this.$emit('setTitle','Organization Members - Click to Select');
        }else{
//          this.$emit('componentSettingsMounted',[['Back','Done'],'Done']);
          this.$emit('setMenu','orgMemberNoAdmin');
          this.$emit('setTitle','Organization Members');
        }
 */
      }
//      debugger;
      this.orgMemberViewStatus=this.ORG_MEMBERS;
      this.getOrgMembers(this.orgId);
    }else{
      this.getAllUsers();
      this.orgMemberViewStatus=this.ALL_MEMBERS;
      this.$emit('componentSettingsMounted',[['Back','Done'],'Done']);
    }


  },
  data() {
    return {
      orgUsers: [],
      orgPermissions:{},
      selectedUserId:0,
      ORG_MEMBERS:0,
      ALL_MEMBERS:1,
      AVAILABLE_MEMBERS:2,
      orgMemberViewStatus:0,
      membershipType:'org',
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      perPage: 5,
      nxtPage: 'Next Page',
      selected: '',
      restrictLabel: 'Restrict membership ?',
      restrict:'',
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '10',
          numeric: true
        },
        {
          field: 'name',
          label: 'Name'
        },
        {
          field: 'email',
          label: 'Email'

        }
      ]
    }
  },
  computed:{
    adminAccess(){
      debugger;
      if(typeof(this.orgPermissions.admin)=='undefined' ){
        this.getOrgPerms(this.orgId);
      }
      if(this.$store.getters.getIsAdmin==1){
        return true;
      }else if(this.orgPermissions.admin==true){
        return true;
      }else{
        return false;
      }
    }
  },
  watch :{
    cmd: function(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      switch(this.cmd){
        case 'Add Member':{
          console.log('orgMembership Add Member activated');
          this.$emit('setTitle','Click to Select Member to Add');
          this.$emit('componentSettingsMounted',[['Back','Done'],'Done']);
          this.getAvailableOrgMembers(this.orgId);
          this.orgMemberViewStatus = this.AVAILABLE_MEMBERS;
          this.$emit('clearCmd');

          break
        }
        case 'Remove':{
          debugger;

          axios.get(apiPath+'api/shan/removeUserFromOrg?XDEBUG_SESSION_START=14668', {
//          axios.get('http://localhost:8000/api/shan/removeUserFromOrg?XDEBUG_SESSION_START=14668', {
            params: {
              userId:this.selectedUserId,
              orgId: this.orgId
            }
          })
              .then(response => {
// eslint-disable-next-line no-debugger
                // JSON responses are automatically parsed.
                debugger;
                if(response.data=="ok"){
                  this.orgMemberViewStatus=this.ORG_MEMBERS;
                  this.getOrgMembers(this.orgId);
                  this.$emit('clearCmd');
                }
                console.log(response);
              })
              .catch(e => {
                this.errors.push(e);
                console.log('orgMembers failed');
              });
          break;
        }
      }
    }
  },
  methods:{
    memberSelected(msg){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      switch(this.orgMemberViewStatus){
        case this.ORG_MEMBERS:{
          debugger;
          console.log('member selected ORG_MEMBERS', msg);
//          this.$emit('setTitle','Click Remove to remove '+msg[1].name);
          this.selectedUserId = msg[1].id;
          this.$emit('memberSelected', msg);
          break;
        }
        case this.ALL_MEMBERS:{
          console.log('member selected ALL_MEMBERS');
          this.$emit('memberSelected', msg);
          this.$emit('setMenu','saveNewOrg');
          break;
        }
        case this.AVAILABLE_MEMBERS:{
          console.log('member selected AVAILABLE_MEMBERS');
          console.log('selected member:',msg[1].id);
          axios.post(apiPath+'api/shan/addUserToOrg?XDEBUG_SESSION_START=15022', {
//          axios.post('http://localhost:8000/api/shan/addUserToOrg?XDEBUG_SESSION_START=15022', {
            userId:msg[1].id,
            orgId: this.orgId
          }).then(response=>
          {
            console.log(response)
            if(response.data=='ok'){
              if(this.$store.getters.getIsAdmin==1){
                this.$emit('componentSettingsMounted',[['Back','Done', 'Add Member'],'Done']);
                this.$emit('setTitle','Organization Members - Click to Select');
              }else{
                this.$emit('componentSettingsMounted',[['Back','Done'],'Done']);
                this.$emit('setTitle','Organization Members');
              }
              this.$emit('clearCmd');
              this.orgMemberViewStatus=this.ORG_MEMBERS;
              this.getOrgMembers(this.orgId);
            }
          }).catch(function(error) {
//                    debugger;
            console.log(error);
          });

          break;
        }
      }
      console.log(msg);
//      this.$emit('memberSelected', msg);
    },
    restrictClicked(){
      console.log('restrict=',this.restrict);
/*
      if(this.restrict){
        this.$emit('setMenu','orgMembersRestrict');
      }else{
        this.$emit('setMenu','orgMembersMenu');
      }
*/
      this.getOrgPerms(this.orgId);
      this.setOrgRestrict();
//      debugger;
    },
    setOrgRestrict(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      var restrictValue = 0;
      if(this.restrict){
        restrictValue = 1;
      }
      console.log('at setOrgRestrict');
      axios.get(apiPath+'api/shan/setOrgRestrict?XDEBUG_SESSION_START=14668', {
//      axios.get('http://localhost:8000/api/shan/orgUsers?XDEBUG_SESSION_START=14668', {
        params: {
          orgId:this.orgId,
          restricted:restrictValue
        }
      }).then(response => {
// eslint-disable-next-line no-debugger
        // JSON responses are automatically parsed.
        debugger;
        console.log(response);
      })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });



    },
    getOrgMembers(orgId){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

      axios.get(apiPath+'api/shan/orgUsers?XDEBUG_SESSION_START=14668', {
//      axios.get('http://localhost:8000/api/shan/orgUsers?XDEBUG_SESSION_START=14668', {
        params: {
          orgId:orgId
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            console.log(response);
            this.orgUsers=response.data.orgUsers;
            if(response.data[0].registration_restricted == 0){
              this.restrict=false;
//              this.$emit('setMenu','orgMembersMenu');
            }else{
              this.restrict=true;
//              this.$emit('setMenu','orgMembersRestrict');
            }
            this.orgView=this.ORG_MEMBERS;
            this.getOrgPerms(orgId);
  //          this.$emit('componentSettingsMounted',[['Back','Done', 'Add Member'],'Done']);
//            this.$emit('setTitle','Organization Members - Click to Select');

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });
    },

    getAvailableOrgMembers(orgId){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

      axios.get(apiPath+'api/shan/availableUsers?XDEBUG_SESSION_START=14668', {
//      axios.get('http://localhost:8000/api/shan/availableUsers?XDEBUG_SESSION_START=14668', {
        params: {
          orgId:orgId
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            console.log(response);
            this.orgUsers=response.data;
            this.orgView=this.AVAILABLE_MEMBERS;
            //          this.$emit('componentSettingsMounted',[['Back','Done', 'Add Member'],'Done']);
//            this.$emit('setTitle','Organization Members - Click to Select');

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });
    },

    getAllUsers(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);

 //     axios.get('http://localhost:8000/api/shan/allUsers?XDEBUG_SESSION_START=14668', {
      axios.get(apiPath+'api/shan/allUsers?XDEBUG_SESSION_START=14668', {

      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            console.log(response);
            this.orgUsers=response.data;
            this.orgView=this.ORG_MEMBERS;

//            this.$emit('setTitle','Organization Members - Click to Select');

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });
    },
    getOrgPerms(orgId){
      debugger;
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      axios.get(apiPath+'api/shan/userOrgPerms?XDEBUG_SESSION_START=14668', {
//      axios.get('http://localhost:8000/api/shan/userOrgPerms?XDEBUG_SESSION_START=14668', {
        params: {
          orgId:orgId
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            this.orgPermissions.view = response.data.view;
            this.orgPermissions.author = response.data.author;
            this.orgPermissions.admin = response.data.admin;
            if(this.orgPermissions.admin==true || this.$store.getters.getIsAdmin==1){
              if(!this.restrict){
                this.$emit('setMenu','orgMembersAdmin');
              }else{
                this.$emit('setMenu','orgMembersAdminRestrict');
              }
//              this.$emit('componentSettingsMounted',[['Back','Done', 'Add Member'],'Done']);
              this.$emit('setTitle','Organization Members - Click to Select');
            }else{
              this.$emit('setMenu','orgMemberNoAdmin');
//              this.$emit('componentSettingsMounted',[['Back','Done'],'Done']);
              this.$emit('setTitle','Organization Members');
            }
            console.log(response);

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgUserPerms failed');
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
