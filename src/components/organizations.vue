<template>
  <span>
    <org-list v-if="orgView==this.ORG_LIST" :cmd="cmd" @orgSelected="orgSelected" @componentSettingsMounted="componentSettingsMounted" @setTitle="setTitle"></org-list>
    <org-membership :cmd="cmd" :orgId="selectedOrgId" v-if="orgView==this.ORG_MEMBERS" @memberSelected="memberSelected" @componentSettingsMounted="componentSettingsMounted" @setTitle="setTitle" @setMenu="setMenu" @clearCmd="clearCmd" @setRestricted="setRestricted"></org-membership>
    <org-new :cmd="cmd" v-if="orgView==this.ORG_NEW"
             :cmdVersion="cmdVersion"
             @componentSettingsMounted="componentSettingsMounted"
             @setTitle="setTitle"
             @setMenu="setMenu"
             @orgCreated="orgCreated"
             @clearCmd="clearCmd"
             :selectedMenuOption="selectedMenuOption"
    ></org-new>
    <registerUser v-if="orgView==NEW_USER" :cmd="cmd" :cmdVersion="cmdVersion" :selectedOrgId="selectedOrgId" @registrationSaved="registrationSaved"></registerUser>
    <user-password v-if="this.orgView==this.USER_PASSWORD" :cmd="cmd" @clearCmd="clearCmd" :current-card-data="currentCardData" @registrationSaved="registrationSaved"></user-password>
  </span>
</template>

<script>
import axios from "axios";
import orgList from "../components/orgList.vue";
import orgMembership from "../components/orgMembership.vue";
import userPassword from "../components/userPassword.vue";
//import TestNewOrg from "@/components/testNewOrg";
import orgNew from "@/components/orgNew.vue";
import registerUser from "@/components/registerUser.vue";

//import orgNew from "../components/orgNew.vue";
export default {
  name: "organizations",
  components:{orgNew, orgList, orgMembership, registerUser, userPassword },
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
    }
  },
  watch:{
    selectedMenuOption: function(){
        switch(this.selectedMenuOption){
          case 'Back':{
            if(this.$store.getters.getIsAdmin==1){
              this.$emit('setTitle','Click on Organization to See Members');
              this.orgView = this.ORG_LIST;
            }else{
              this.$emit('setTitle', 'Site Users');
              this.$emit('setMenu', 'orgMembersMenu');
              this.orgView = this.ORG_MEMBERS;
            }

//            this.$emit('componentSettingsMounted',[['Done', 'Add New Organization'],'Done']);
            break;
          }
          case 'OrgTopBack':{
            if(this.$store.getters.getIsAdmin==1){
              this.$emit('setTitle','Click on Organization to See Members');
              this.orgView = this.ORG_LIST;
            }else{
              this.$emit('setTitle', 'Site Users');
              this.$emit('setMenu', 'orgMembersMenu');
              this.orgView = this.ORG_MEMBERS;
            }
            break;
          }
          case 'Add New Organization':{
            this.orgView=this.ORG_NEW;
            this.$emit('setTitle','New Organization');
            this.$emit('setMenu','saveNewOrg');
//            this.$emit('componentSettingsMounted',[['Back','Done', 'Save'],'Done']);
          }
        }
      },
    cmd: function(){
      console.log('organizations cmd changed -', this.cmd);
      switch(this.cmd){
        case 'NewUser':{
          this.$emit('setMenu','orgMemberNew');
          this.orgView=this.NEW_USER;
          break;
        }
        case 'orgMemberBack':{
          if(this.$store.getters.getIsAdmin==1){
            this.orgView = this.ORG_LIST;
          }else{
            this.$emit('setTitle', 'Site Users');
            this.$emit('setMenu', 'orgMembersMenu');
            this.orgView = this.ORG_MEMBERS;
          }
          break;
        }
        case 'userPassword':{
          this.$emit('setMenu', 'userPassword');
          this.orgView = this.USER_PASSWORD;
          break;
        }
        case 'updatePassword':{
          this.$emit('setMenu', 'userPassword');
          this.$emit('setTitle', 'Enter new password')
          this.orgView = this.USER_PASSWORD;
          break;
        }

      }
    }
  },

  data(){
    return {
      ORG_LIST:0,
      ORG_MEMBERS:1,
      ORG_NEW:2,
      NEW_USER:3,
      USER_PASSWORD:4,
      orgView:0,
      orgs:[],
      orgUsers:[],
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      currentOrgUserPage: 1,
      perPage: 4,
      nxtPage: 'Next Page',
      selected: '',
      selectedUser:'',
      orgColumns: [
        {
          field: 'org_label',
          label: 'Name',
          width: '20',
        },
        {
          field: 'description',
          label: 'Description',
          width: '40'
        },
        {
          field: 'top_layout_id',
          label: 'Home Space',
          width: '10',
          numeric: true,
          visible: false
        }
      ],
      selectedOrgId:0,
      currentCardData:{}
    }
  },
  mounted(){
    this.$emit('setMenu','addNewOrg');
    if(this.$store.getters.getIsAdmin==1){
      this.$emit('setTitle','Click on Organization to See Members');
      this.orgView = this.ORG_LIST;
    }else{
      this.$emit('setTitle', 'Site Users');
      this.$emit('setMenu', 'orgMembersMenu');
      this.orgView = this.ORG_MEMBERS;
    }

//    this.getOrgs();
  },
  methods:{
    getOrgs(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      axios.get(apiPath+'api/shan/orgList?XDEBUG_SESSION_START=14668', {
//      axios.get('http://localhost:8000/api/shan/orgList?XDEBUG_SESSION_START=14668', {
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
//            debugger;
            console.log(response);
            this.orgs=response.data;
//            this.$emit('componentSettingsMounted',[['Done', 'Add New Organization'],'Done']);
            this.$emit('setTitle','Click on Organization to See Members');

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });
    },
    orgSelected(msg){
      this.selectedOrgId=msg;
      this.orgView=this.ORG_MEMBERS;
    },
    orgCreated(){
      debugger;
      this.getOrgs();
      this.clearCmd();
      this.$emit('setMenu','addNewOrg');
      this.orgView=this.ORG_LIST;
    },
    componentSettingsMounted(msg){
      this.$emit('componentSettingsMounted', msg);
    },
    setTitle(msg){
      this.$emit('setTitle', msg);
    },
    clearCmd(){
      this.cmd="";
      this.$emit('clearCmd');
    },
    setMenu(msg){
      this.$emit('setMenu', msg);
    },
    registrationSaved(msg){
      this.$emit('registrationSaved', msg);
    },
    memberSelected(msg){
      console.log('memberSelected-',msg );
      this.currentCardData.id = msg[1].id;
      this.currentCardData.email = msg[1].email;
      this.currentCardData.name = msg[1].name;
      if(this.$store.getters.getIsAdmin==1){
        this.$emit('setMenu','orgMembersSuperAdmin');
      }
    }
  }
}
</script>

<style scoped>
span {
  font-family: Arial;
  font-size: medium;
  --oruga-table-color: green;
  --oruga-table-background-color: #ab97ff;
  --oruga-table-background: #ab97ff;
  --oruga-table-detail-background: #ab97ff;
  --oruga-pagination-link-current-background-color: green;
}
</style>
