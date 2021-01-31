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
            Background:
          </span>
       <span class="backgroundPick">
          <background-picker :currentValues="currentValues" :dialogKey="dialogKey" :pType="backgroundColorType" :noTransparent=true @configSelected="configSelected"></background-picker>
      </span>
     </span>
  </span>

</template>

<script>
import axios from "axios";
import backgroundPicker from "@/components/backgroundPicker";

export default {
name: "createLayout",
  components: {backgroundPicker},
  mounted(){
    this.$emit("componentSettingsMounted",[this.menuOptions,this.openMenuOption])
  },
  data(){
    return {
      layoutId:'',
      layoutName:'',
      layoutDescription:'',
      layoutRows:'',
      layoutColumns:'',
      val:'#dbddb0',
      updatedColor:'#dbddb0',

      backgroundImageFile:'',
      backgroundType:'',
      NOTHING_SELECTED:0,
      COLOR_SELECTED:1,
      IMAGE_SELECTED:2,

      menuOptions: ['Save', 'Cancel' ],
      openMenuOption: 'Save'
    }
  },
  props:{
    cmd:{
      type: String,
      required: false
    }
  },
  watch:{
    cmd: function(){
      console.log('createLayout cmd changed - ', this.cmd);
      switch(this.cmd){
        case 'Save':{
          this.saveClicked();
          break;
        }
        case 'saveSpace':{
          this.saveClicked();
          break;
        }
      }
    }
  },
  methods:{
    getEnteredData(){
      this.saveClicked();

    },
    configSelected(msg){
      debugger;
      switch(msg[0]){
        case "backgroundType":{
/*
          if(msg[1]==this.COLOR_SELECTED){
            this.backgroundType="C";
          }else if(msg[1]==this.IMAGE_SELECTED){
            this.backgroundType="I";
          } else {
            this.backgroundType='';
          }
 */
          this.backgroundType="I";
          break;
        }
        case "backgroundTypeColor":{
          this.backgroundType="C";
          break;
        }
        case "backgroundImage":{
          this.backgroundImageFile = msg[1];
          break;
        }
        case "backgroundColor":{
          this.updatedColor = msg[1];
          break;
        }
      }

    },
    newColor(evt){
      console.log(evt.target.value);
      this.updatedColor=evt.target.value;
    },
    getColorVal(){

    },
    saveClicked(){
//        debugger;
      axios.post('http://localhost:8000/createLayoutNoBlanks?XDEBUG_SESSION_START=17516', {
        name: this.layoutName,
        description: this.layoutDescription,
        height: this.layoutRows,
        width: this.layoutColumns,
        backgroundColor: this.updatedColor,
        backgroundType: this.backgroundType,
        backgroundImage: this.backgroundImageFile,
        userId: this.$store.getters.getLoggedInUserId,
        user: this.$store.getters.getLoggedInUser,
        orgId: this.$store.getters.getOrgId
      }).then(response=>
      {
//            debugger;
        this.layoutId=response.data;
        this.$emit('layoutData', [this.layoutId,this.layoutName, this.layoutDescription, this.layoutRows, this.layoutColumns, this.val, this.updatedColor]);
//        this.$emit('layoutSaved', [this.layoutId, this.layoutRows, this.layoutColumns, this.layoutDescription, this.layoutName, this.val]);
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
