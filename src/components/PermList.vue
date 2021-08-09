<template>
    <span class="permListContainer">
     <span v-if="this.view==this.PERMS" >
        <perm-list-header :deleteActive="deleteActive"></perm-list-header>
        <perm-list-line v-for="(perm, index) in currentPerms "
                        :key="index"
                        :groupId="perm.id"
                        :layoutId="layoutId"
                        :groupDescription="perm.description"
                        :viewValue="perm.view"
                        :authorValue="perm.author"
                        :adminValue="perm.admin"
                        :opt1Value="perm.opt1"
                        :opt2Value="perm.opt2"
                        :opt3Value="perm.opt3"
                        :selectedId="selectedGroupId"
                        :deleteActive="deleteActive"
                        :cmd="cmd"
                        @deleteClicked="deleteClicked"
                        @groupClicked="groupClicked"></perm-list-line>

        </span>
        <span v-if="this.view==this.GROUP_INFO">
          <membership :members="this.groupMembers" :membershipType="groupMembershipType" @memberSelected="memberSelected" :cmd="cmd"></membership>
        </span>
        <span v-if="this.view==this.GROUP_LIST">
          <group-list-header></group-list-header>
          <group-list-line v-for="(group, index) in  groups"
                           :key="index"
                           :groupId="group.id"
                           :groupDescription="group.description"
                           :cmd="cmd"
                           @groupClicked="groupSelected"
          ></group-list-line>
        </span>
        <span v-if="this.view==this.ORG_MEMBERS">
          <membership :members="orgMembers" :membershipType="orgMembershipType" @memberSelected="memberSelected" :cmd="cmd"></membership>
        </span>
      </span>
</template>

<script>
import axios from "axios";

//import store from "../store";
import PermListLine from "./permListLine.vue";
import PermListHeader from "./permListHeader.vue";
//import GroupMemberLine from "./GroupMemberLine.vue";
//import GroupMemberHeader from "./GroupMemberHeader";
//import groupMembership from "@/components/groupMembership";
//import orgMembership from "@/components/orgMembership";
import membership from "./membership.vue";
import groupListHeader from "./groupListHeader.vue";
import groupListLine from "./groupListLine.vue";
import GroupListHeader from "@/components/groupListHeader";
import GroupListLine from "@/components/groupListLine";

export default {
name: "PermList",
  components: {GroupListLine, GroupListHeader, PermListLine, PermListHeader,  groupListHeader, groupListLine, membership },
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
    cmd: function(){
      console.log('PermList cmd changed - ', this.cmd);
      switch(this.cmd){
        case 'AddMemberGroup':{
          this.orgMemberSelected(this.selectedMemberId);
          break;
        }
      }
    },
    selectedMenuOption: function(){
      debugger;
      console.log('permList selectedMenuOption watcher triggered');
      this.openMenuOption = this.selectedMenuOption;
      switch(this.selectedMenuOption){
        case 'Back':{
          this.currentMenu = this.topMenu;
          this.currentMenuActiveOption = 'Done';
          this.layoutId = this.$store.getters.getCurrentLayoutId;
          this.reloadLayoutPerms();
          this.view=this.PERMS;
          this.$emit('setTitle', 'Who Can Access This Space');
          this.$emit("componentSettingsMounted",[this.currentMenu,this.currentMenuActiveOption]);
          break;
        }
        case "Add Group":{
          debugger;
          this.getOrgGroups(this.orgId, this.layoutId);
          break;
        }
        case "Add Member To Group":{
          this.orgMemberSelected(this.selectedMemberId);
          break;
        }
        case "Remove Member From Group":{
//          debugger;
          this.removeUserFromGroup(this.selectedMemberId)
          break;
        }
        case "Add Member":{
          this.getOrgMembers();
          this.$emit('componentSettingsMounted',[['Back','Done'],'Done']);
          this.$emit('setTitle','Click on member to add');
          break;
        }
        case "Remove":{
          console.log('Remove-', this.view);
          this.setDeleteMemberActive();
          break;
        }
        case "Remove Group":{
          this.setDeleteActive();
          break;
        }
        case "Clear Remove":{
          console.log('clear remove-', this.view);
//          debugger;
          switch(this.view){
            case 0:
              this.clearDeleteActive();
              break;
            case 1:
              this.clearDeleteActiveMembers();
              break;
          }
          break;
        }
      }
    }
  },
  data(){
    return {
      currentMenu: [],
      currentMenuActiveOption:'',
      openMenuOption:'',

      PERMS:0,
      GROUP_INFO:1,
      NEW_GROUP:2,
      FIND_MEMBER:3,
      ADD_NEW_MEMBER:4,
      ADD_USER_TO_GROUP:5,
      ORGANIZATION_GROUPS:6,
      GROUP_LIST:7,
      ORG_MEMBERS:8,

      NEW_USER:1,
      SELECT_USER:0,

      currentPerms: [],
      groupMembers: [],
      orgMembers:[],
      groups:[],
      groupMembershipType:"groups",
      orgMembershipType:"org",
      OrganizationGroups: [],
      selectedGroupDescription:'',
      adminUserSelect:0,
      allUserRefresh:0,
      selectedGroupId:0,
      selectedMemberId:0,
      view:0,
      layoutId:'',
      isGroupAdmin:false,
      orgId: this.$store.getters.getOrgId,

      deleteActive: false,
      currentGroupDescription:'',

      topMenu: ['Add Group', 'Remove Group','Done'],
      topMenuB: ['Add Group', 'Clear Remove','Done'],
      adminGroupMenu: ['Add Member','Back','Done'],
      groupMenu:['Back', 'Done']


    }
  },
  mounted(){
    debugger;
    this.currentMenu = this.topMenu;
    console.log('currentMenu set to topmenu - mounted');
    this.currentMenuActiveOption = 'Done';
    this.layoutId = this.$store.getters.getCurrentLayoutId;
    this.reloadLayoutPerms();
    this.$emit('setTitle', 'Who Can Access This Space');
    this.$emit("setMenu",'topMenu');
  },

  methods:{
    setDeleteActive(){
      this.deleteActive=true;
      this.currentMenu = this.topMenuB;
      this.currentMenuActiveOption = 'Done';
      this.$emit('setTitle', 'Remove A Group From This List ?');
      this.$emit("setMenu",'topMenuB');
    },
    setDeleteMemberActive(){
      this.deleteActive=true;
      this.currentMenu = this.topMenuB;
      this.currentMenuActiveOption = 'Done';
      this.$emit('setTitle', 'Remove A Member from this Group ?');
      this.$emit("setMenu",'topMenuB');
    },
    clearDeleteActive(){
      this.deleteActive=false;
      this.currentMenu = this.topMenu;
      console.log('currentMenu set to topmenu - clearDeleteActive');
      this.$emit('setTitle', 'Who Can Access This Space');
      this.currentMenuActiveOption = 'Done';
      this.$emit("setMenu",'topMenu');
    },
    clearDeleteActiveMembers(){
      debugger;
      this.deleteActive=false;
      this.currentMenu = this.adminGroupMenu;
      this.$emit('setTitle', this.currentGroupDescription+" click on member to select");
      this.$emit("setMenu",'adminGroupMenu');

    },
    deleteClicked(msg){
      console.log('deleteClicked-',msg, 'layout-', this.layoutId);
      this.clearDeleteActive();
      axios.post('http://localhost:8000/api/shan/removePerm?XDEBUG_SESSION_START=15022', {
        params:{
          layoutId:this.layoutId,
          groupId:msg
        }
      }).then(response=>
      {
        debugger;
        if(response.data=='ok'){
          this.reloadLayoutPerms();
          this.$emit('setTitle', 'Access This Space - Click on Group to Select');
          this.$emit("setMenu",'topMenu');
          this.view=this.PERMS;
        }
      })
          .catch(e => {
            this.errors.push(e);
            console.log('addAccess failed');
          });
    },
    reloadLayoutPerms(){
      axios.get('http://localhost:8000/api/shan/layoutPerms?XDEBUG_SESSION_START=14668', {
        params:{
          orgId:this.$store.getters.getOrgId,
          userId:this.$store.getters.getLoggedInUserId,
          layoutId:this.layoutId
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
                               debugger;
            this.currentPerms = response.data;
            console.log(this.currentPerms);
          })
          .catch(e => {
            this.errors.push(e);
            console.log('viewableLayouts failed');
          });
    },
    getOrgMembers(){
      axios.get('http://localhost:8000/api/shan/availableOrgUsers?XDEBUG_SESSION_START=14668', {
        params:{
          orgId: this.$store.getters.getOrgId,
          groupId: this.selectedGroupId
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
//            debugger;
            console.log(response);
            this.orgMembers=response.data;
            this.$emit("setMenu",'groupMenu');
            this.$emit('setTitle','Click on member to add');
            this.view=this.ORG_MEMBERS;



          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });
    },
    getOrgGroups(orgId, layoutId){
      debugger;
      axios.get('http://localhost:8000/api/shan/orgGroups?XDEBUG_SESSION_START=14668', {
        params:{
          orgId: orgId,
          layoutId:layoutId
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
//            debugger;
            console.log(response);
            this.groups=response.data;
            this.view=this.GROUP_LIST;



          })
          .catch(e => {
            this.errors.push(e);
            console.log('groupMembers failed');
          });
    },

    getGroupMembers(groupId){
//              debugger;
      this.selectedGroupId = groupId;
      axios.get('http://localhost:8000/api/shan/groupMembers?XDEBUG_SESSION_START=14668', {
        params:{
          groupId: groupId
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
                      debugger;
            console.log('getGroupMembers', response.data);
            this.groupMembers=response.data.members;
            this.isGroupAdmin = response.data.groupAdmin;
            this.currentGroupDescription=response.data.groupDescription

            this.view=this.GROUP_INFO;
            if(this.isGroupAdmin){
              this.isGroupAdmin = true;
              this.$emit('setTitle', this.currentGroupDescription+" Click on Member to Select");
//             this.currentMenu = this.adminGroupMenu;
//              this.currentMenuActiveOption = 'Done';
              this.$emit("setMenu",'adminGroupMenu');
            }else{
              this.isGroupAdmin=false;
              this.$emit('setTitle', this.currentGroupDescription+" Members");
//              this.currentMenu = this.groupMenu;
//              this.currentMenuActiveOption = 'Done';
              this.$emit("setMenu",'groupMenu');
            }


          })
          .catch(e => {
            this.errors.push(e);
            console.log('groupMembers failed');
          });
    },
    groupClicked(msg){
      console.log('groupClicked',msg);
      this.selectedGroupDescription = msg[0][1];
      this.getGroupMembers(msg[0][0]);
    },
    removeUserFromGroup(userId){
      debugger;
      axios.post('http://localhost:8000/api/shan/removeUserFromGroup?XDEBUG_SESSION_START=15022', {
        params:{
          groupId: this.selectedGroupId,
          selectedUserId: userId
        }
      }).then(response=>
      {
        debugger;
        if(response.data=='ok'){
          this.getGroupMembers(this.selectedGroupId);
        }
      })
          .catch(e => {
            this.errors.push(e);
            console.log('addAccess failed');
          });

    },
    orgMemberSelected(userId){
      debugger;
      axios.post('http://localhost:8000/api/shan/addUserToGroup?XDEBUG_SESSION_START=15022', {
        params:{
          groupId: this.selectedGroupId,
//          orgId:this.$store.getters.getOrgId,
          selectedUserId: userId
        }
      }).then(response=>
      {
        debugger;
        if(response.data=='ok'){
          this.getGroupMembers(this.selectedGroupId);
        }
      })
          .catch(e => {
            this.errors.push(e);
            console.log('addAccess failed');
          });


    },
    memberSelected(msg){
      console.log(msg);
      if(msg[0]=="orgMemberSelected"){
        if(this.isGroupAdmin){
          var titleMsg = "Add "+msg[1].name+" to "+this.selectedGroupDescription+" ?";
          this.selectedMemberId = msg[1].id;
          this.$emit("setMenu",'adminAddMemberMenu');
          this.$emit('setTitle',titleMsg)
        }

      }
      if(msg[0]=="groupMemberSelected"){
        if(this.isGroupAdmin){
          titleMsg = "Remove "+msg[1].name+" from "+this.selectedGroupDescription+" ?";
          this.selectedMemberId = msg[1].id;
          this.$emit("setMenu",'adminRemoveMemberMenu');
          this.$emit('setTitle',titleMsg)
        }
      }
    },
    groupSelected(msg) {
      console.log(msg);



      axios.post('http://localhost:8000/api/shan/addAccess?XDEBUG_SESSION_START=15022', {
        params:{
          orgId:this.$store.getters.getOrgId,
          layoutId:this.layoutId,
          groupId:msg
        }
      }).then(response=>
      {
        debugger;
        if(response.data=='ok'){
          this.reloadLayoutPerms();
          this.$emit('setTitle', 'Who Can Access This Space');
          this.$emit("setMenu",'topMenu');
          this.view=this.PERMS;
        }
      })
      .catch(e => {
        this.errors.push(e);
        console.log('addAccess failed');
      });
    }


  }

}
</script>

<style scoped>

</style>
