<template>
  <span class="newOrgWrapper">
    <span v-if="this.viewStatus==this.NEWORG_ORGINFO">
     <span class="labelPlusInput">
         <span>
            Organization Name:
         </span>
         <span>
            <input v-model.lazy="orgName" ref="orgName" size="40" class="inputStyle" placeholder="Organization Name"  />
         </span>
     </span>
     <span class="labelPlusInput">
         <span>
            Description:
         </span>
         <span>
            <input v-model.lazy="orgDescription"  size="60" class="inputStyle" placeholder="Organization Description"  />
         </span>
     </span>

     <span class="labelPlusInput">
         <span>
            Home Space Dim.:
         </span>
         <span>
           <input v-model.lazy="hpRows" size="5" class="inputStyle"   /> - Rows <input v-model.lazy="hpCols" size="5" class="inputStyle"   /> - Columns
         </span>
     </span>
     <span class="labelPlusInput">
          <span>
            Background:
          </span>
       <span class="backgroundPick">
          <background-picker :currentValues="currentBackground" :dialogKey="dialogKey" :pType="backgroundColorType" :noTransparent=true @configSelected="configSelected"></background-picker>
      </span>
     </span>


     <span class="adminSelect" v-if="adminIdentified==false">
      <span>Administrator:</span>

      <span class="adminTypes">
        <span @click="newUserTypeSelected">Enter new User</span>
        <span @click="existingUserTypeSelected">Select an Existing User</span>
      </span>
     </span>
     <span class="adminSelect" v-if="adminIdentified==true">
       <span @click="showAdminEntryLinks">Administrator</span>
       <span>{{this.orgAdminName}} - {{this.orgAdminEmail}}</span>
     </span>
    </span>
    <span v-if="this.viewStatus==this.NEWORG_NEWUSER">
      <register-user
          @registrationSaved="registrationSaved"
          @setTitle="setTitle"
          @componentSettingsMounted="componentSettingsMounted"
          @userExists="userExists"
          :cmd="cmd"
      ></register-user>
    </span>
    <span v-if="this.viewStatus==this.NEWORG_EXISTING_USER">
      <org-membership :orgId="allUserId" @memberSelected="memberSelected" @componentSettingsMounted="componentSettingsMounted" @setMenu="setMenu" @setTitle="setTitle" ></org-membership>
    </span>

  </span>
</template>

<script>
import Vue from 'vue';
import registerUser from "../components/registerUser.vue";
import orgMembership from "../components/orgMembership.vue";
import backgroundPicker from "@/components/backgroundPicker";
import axios from "axios";
export default {
  name: "orgNew",
  components: {registerUser, orgMembership, backgroundPicker},
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
  mounted(){
    this.viewStatus=this.NEWORG_ORGINFO;

    let self = this
    Vue.nextTick()
        .then(function () {
          console.log(self.$refs.orgName.focus())
        })

  },
  data(){
    return {
      orgName:'',
      orgDescription:'',
      hpRows:'',
      hpCols:'',
      viewStatus:0,
      NEWORG_ORGINFO:0,
      NEWORG_NEWUSER:1,
      NEWORG_EXISTING_USER:2,
      allUserId:0,

      orgAdminName:'',
      orgAdminEmail:'',
      orgAmdinId:'',
      orgIsAdmin:0,
      adminIdentified:false,

      BACKGROUND_TYPE_COLOR:'C',
      BACKGROUND_TYPE_IMAGE:'I',
      currentBackground: '#dbdbdb',
      backgroundType:'C',
      backgroundImage:'',

      errs:{
        orgNameOk:false,
        orgDescriptionOk:false,
        orgAdminOk:false,
        orgRowsOk:false,
        orgColsOk:false,
        orgBackgroundOk:true,
        allOk: function(){
          debugger;
          if(this.orgNameOk && this.orgDescriptionOk && this.orgAdminOk && this.orgRowsOk && this.orgColsOk && this.orgBackgroundOk){
            return true;
          }else{
            return false;
          }
        }
      },
      currentErrs:''
    }
  },
  watch:{
    selectedMenuOption: function() {
      switch (this.selectedMenuOption) {
        case 'Return to New Organization':{
          this.$emit('setTitle','New Organization');
          this.$emit('componentSettingsMounted',[['Back','Done','Save'],'Done']);
          this.viewStatus=this.NEWORG_ORGINFO;
          break;
        }
      }
    },
    cmd: function(){
      switch(this.cmd){
        case 'newOrg':{
          if(this.errs.allOk()){
            debugger;
            axios.post('http://localhost:8000/api/shan/newOrg?XDEBUG_SESSION_START=14668', {
              params:{
                name: this.orgName,
                description: this.orgDescription,
                height: this.hpRows,
                width: this.hpCols,
                backgroundColor: this.currentBackground,
                adminUserId: this.orgAmdinId,
                adminUserEmail: this.orgAdminEmail,
                adminUserName: this.orgAdminName,
                backgroundType: this.backgroundType,
                backgroundImage:this.backgroundImage
              }
            })
            .then(response => {
// eslint-disable-next-line no-debugger
              // JSON responses are automatically parsed.
              debugger;
              this.$emit('clearCmd');
              this.$emit('orgCreated');
              console.log(response);
            })
            .catch(e => {
              this.errors.push(e);
              console.log('new org failed');
            });






          }else{
            if(!this.errs.orgNameOk){
              this.currentErrs += 'Name, ';
            }
            if(!this.errs.orgDescriptionOk){
              this.currentErrs += 'Description, ';
            }
            if(!this.errs.orgAdminOk){
              this.currentErrs += 'Select Admin, ';
            }
            if(!this.errs.orgRowsOk){
              this.CurrentErrs += 'Rows, ';
            }
            if(!this.errs.orgColsOk){
              this.currentErrs += 'Cols, ';
            }
            this.currentErrs = 'Please Correct:'+this.currentErrs;
            this.$emit('setTitle',this.currentErrs);
          }
          break;
        }
      }
    },
    orgName: function(){
      debugger;
      console.log('orgName Changed - ', this.orgName);
      var spaceFound = this.orgName.indexOf(' ');
      if(spaceFound>(-1)){
        this.$emit('setTitle','Organization Name Must Not Have Space!');
      }else{
        this.errs.orgNameOk = true;
        this.$emit('setTitle','New Organization');
      }
    },
    orgDescription: function(){
      this.errs.orgDescriptionOk = true;
      console.log('orgDescription changed -', this.orgDescription);
    },
    hpRows: function(){
      if(!this.hpRows.match(/^[0-9]+$/) != null){
        this.errs.orgRowsOk = true;
      }else{
        this.errs.orgRowsOk = false;
      }
      console.log('hpRows changed - ', this.hpRows);
    },
    hpCols: function(){
      debugger;
      if(!this.hpCols.match(/^[0-9]+$/) != null){
        this.errs.orgColsOk = true;
      }else{
        this.errs.orgColsOk = false;
      }
      console.log('hpCols changed - ', this.hpCols);

    },
    adminIdentified: function(){
      this.$emit('setTitle','New Organization');
      this.$emit('componentSettingsMounted',[['Back','Done','Save'],'Done']);
      this.errs.orgAdminOk = true;
    }

  },
  methods:{
    newUserTypeSelected(msg){
      console.log('new user selected',msg);
//      this.$emit('componentSettingsMounted',[['Return to New Organization','Save Registration'],'Done']);
      this.$emit('setMenu','orgNewUser');
      this.$emit('setTitle','New Organization Administrator');
      this.viewStatus=this.NEWORG_NEWUSER;
    },
    existingUserTypeSelected(msg){
//      this.$emit('componentSettingsMounted',[['Return to New Organization','Done'],'Done']);
      this.$emit('setMenu', 'existingOrgUser');
      this.$emit('setTitle','Select User to be Organization Administrator');
      this.viewStatus=this.NEWORG_EXISTING_USER;
      console.log('existingUserSelected', msg);
    },
    memberSelected(msg){
      debugger;
      console.log('mewmberSelected in orgNew', msg);
      this.orgAdminName=msg[1].name;
      this.orgAdminEmail=msg[1].email;
      this.orgAmdinId=msg[1].id;
      this.$emit('componentSettingsMounted',[['Back','Done','Save'],'Done']);
      this.viewStatus=this.NEWORG_ORGINFO;
      this.adminIdentified=true;
    },
    componentSettingsMounted(msg){
      this.$emit('componentSettingsMounted', msg);
    },
    setTitle(msg){
      this.$emit('setTitle', msg);
    },
    registrationSaved(msg){
      console.log(msg);
      this.orgAdminName = msg[1];
      this.orgAdminEmail = msg[2];
      this.orgAmdinId = msg[3];
      this.$emit('clearCmd');
      this.$emit('setMenu','saveNewOrg');
      this.viewStatus=this.NEWORG_ORGINFO;
      this.adminIdentified=true;
    },
    userExists(msg){
      console.log(msg);
      this.orgAdminName = msg.name;
      this.orgAdminEmail= msg.email;
      this.orgAmdinId=msg.id;
      this.orgIsAdmin=msg.is_admin;
      this.adminIdentified=true;
      this.$emit('clearCmd');
      this.viewStatus=this.NEWORG_ORGINFO;

    },
    setMenu(msg){
      this.$emit('setMenu', msg);
    },
    showAdminEntryLinks(){
      this.adminIdentified=false;
    },
    configSelected(msg){
      console.log(msg);
      switch(msg[0]){
        case 'backgroundType':{
          this.backgroundType=this.BACKGROUND_TYPE_IMAGE;
          break;
        }
        case 'backgroundTypeColor':{
          this.backgroundType=this.BACKGROUND_TYPE_COLOR;
          break;
        }
        case 'backgroundImage':{
          this.backgroundImage=msg[1];
          break;
        }
      }
    }
  }
}
</script>

<style scoped>
.labelPlusInput {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 30% 70%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
.adminTypes {
  display: grid;
  grid-template-columns: 50% 50%;
}
.adminSelect {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 30% 70%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}

.nt {
  color:blue;
}

.nt:hover {
  color:red;
}
</style>

