<template>
  <span>
    <org-list v-if="orgView==this.ORG_LIST" :cmd="cmd" @orgSelected="orgSelected" @componentSettingsMounted="componentSettingsMounted" @setTitle="setTitle"></org-list>
    <org-membership :cmd="cmd" :orgId="selectedOrgId" v-if="orgView==this.ORG_MEMBERS" @componentSettingsMounted="componentSettingsMounted" @setTitle="setTitle" @setMenu="setMenu" @clearCmd="clearCmd"></org-membership>
    <org-new :cmd="cmd" v-if="orgView==this.ORG_NEW"
             @componentSettingsMounted="componentSettingsMounted"
             @setTitle="setTitle"
             @setMenu="setMenu"
             @orgCreated="orgCreated"
             @clearCmd="clearCmd"
             :selectedMenuOption="selectedMenuOption"
    ></org-new>
  </span>
</template>

<script>
import axios from "axios";
import orgList from "../components/orgList.vue";
import orgMembership from "../components/orgMembership.vue";
//import TestNewOrg from "@/components/testNewOrg";
import orgNew from "@/components/orgNew.vue";

//import orgNew from "../components/orgNew.vue";
export default {
  name: "organizations",
  components:{orgNew, orgList, orgMembership },
  props:{
    selectedMenuOption: {
      type: String,
      required: true
    },
    cmd:{
      type: String,
      required: false
    }
  },
  watch:{
    selectedMenuOption: function(){
        switch(this.selectedMenuOption){
          case 'Back':{
            this.orgView=this.ORG_LIST;
//            this.$emit('componentSettingsMounted',[['Done', 'Add New Organization'],'Done']);
            this.$emit('setTitle','Click on Organization to See Members');
            break;
          }
          case 'OrgTopBack':{
            this.orgView=this.ORG_LIST;
            this.$emit('setMenu','addNewOrg');
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
    }
  },

  data(){
    return {
      ORG_LIST:0,
      ORG_MEMBERS:1,
      ORG_NEW:2,
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
      selectedOrgId:0
    }
  },
  mounted(){
    this.$emit('setMenu','addNewOrg');
    this.orgView = this.ORG_LIST;
//    this.getOrgs();
  },
  methods:{
    getOrgs(){
      axios.get('http://localhost:8000/api/shan/orgList?XDEBUG_SESSION_START=14668', {
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
