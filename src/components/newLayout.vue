<template>
  <span class="newLayoutWrapper">
     <span class="labelPlusInput">
         <span>
            Layout Name:
         </span>
         <span>
            <input v-model="layoutName"  size="35"/>
         </span>
     </span>
     <span class="labelPlusInput">
        <span>
          Layout Description:
        </span>
       <span>
          <input v-model="layoutDescription" size="45"/>
       </span>
     </span>

     <span class="labelPlusInput">
        <span>
          Rows:
        </span>
       <span>
         <input v-model="layoutRows" size="8"/>
       </span>
     </span>
     <span class="labelPlusInput">
        <span>
          Layout Columns:
        </span>
       <span>
         <input v-model="layoutColumns" size="8"/>
       </span>
     </span>
     <span class="labelPlusInput">
          <span>
            Background Color:
          </span>
          <span  class="colorSpan">
            <input  id="input-color" type="color" class="input-color" @change="newColor" :value="val"/>
          </span>
     </span>
  </span>

</template>

<script>
import axios from "axios";
export default {
  name: "newLayout",
  mounted(){
    this.$emit("componentSettingsMounted",[this.menuOptions,this.openMenuOption])
  },
  props:{
    cmd: {
      type: String,
      required: false
    }
  },
  watch:{
    cmd: function(){
      console.log('newLayout cmd changed - ', this.cmd);
      switch(this.cmd){
        case 'saveSpace':{
          this.saveClicked();
          break;
        }
      }
    }
  },
  data(){
    return {
      layoutName:'',
      layoutDescription:'',
      layoutRows:'',
      layoutColumns:'',
      val:'#dbddb0',

      menuOptions: ['Create New Layout', 'Cancel' ],
      openMenuOption: 'Create New Layout'
    }
  },
  methods:{
    saveClicked(){
        debugger;
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      axios.post(apiPath+'api/shan/createLayoutNoBlanks?XDEBUG_SESSION_START=17516', {
//      axios.post('http://localhost:8000/createLayoutNoBlanks?XDEBUG_SESSION_START=17516', {
        name: this.layoutName,
        description: this.layoutDescription,
        height: this.layoutRows,
        width: this.layoutColumns,
        backgroundColor: this.val,
        userId: this.$store.getters.getLoggedInUserId,
        user: this.$store.getters.getLoggedInUser,
        orgId: this.$store.getters.getOrgId
      }).then(response=>
      {
//            debugger;
        this.layoutId=response.data;
        this.$emit('layoutData', [this.layoutId, this.layoutRows, this.layoutColumns, this.layoutDescription, this.layoutName, this.val]);
//                this.$refs.editGrid.createBlankLayout(msg[2],msg[3],msg[1],msg[0]);
      }).catch(function(error) {
        console.log(error);
      });
    },
  }
}
</script>

<style scoped>
.newLayoutWrapper {
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
.colorSpan{
  width: 50px;


  font-family: Helvetica;
  font-size: smaller;
}
.colorSpanLabel {
  width: 150Px;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
