<template>
  <span class="newLayoutWrapper">
     <span class="labelPlusInput">
         <span>
            Layout Name:
         </span>
         <span>
            <input v-model="menu_label"  size="35"/>
         </span>
     </span>
     <span class="labelPlusInput">
        <span>
          Layout Description:
        </span>
       <span>
          <input v-model="description" size="45"/>
       </span>
     </span>

     <span class="labelPlusInput">
        <span>
          Rows:
        </span>
       <span v-if="this.mode==this.LAYOUT_CREATE">
         <input v-model="height" size="8"/>
       </span>
       <span v-if="this.mode==this.LAYOUT_EDIT">
          {{this.height}}
       </span>
     </span>
     <span class="labelPlusInput">
        <span>
          Layout Columns:
        </span>
       <span v-if="this.mode==this.LAYOUT_CREATE">
         <input v-model="width" size="8"/>
       </span>
      <span v-if="this.mode==this.LAYOUT_EDIT">
         {{this.width}}
       </span>
     </span>
     <span class="labelPlusInput">
          <span>
            Background:
          </span>
       <span class="backgroundPick">
          <background-picker :currentValues="currentValues" :dialogKey="cmdObjectVersion" :pType="backgroundTypePtype" :noTransparent=true @configSelected="configSelected"></background-picker>
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
    console.log('cmdObjectVersion is', this.cmdObjectVersion);
  },
  data(){
    return {
      layoutId:'',
      menu_label:'',
      description:'',
      height:'',
      width:'',
      val:'#dbddb0',
      updatedColor:'#dbddb0',

      backgroundImageFile:'',
      backgroundType:'C',
      backgroundDisplay:'',
      backgroundColor:'',
      backgroundUrl:'',
      NOTHING_SELECTED:0,
      COLOR_SELECTED:1,
      IMAGE_SELECTED:2,

      backgroundColorPtype:'backgroundColor',
      backgroundDisplayPtype:'backgroundDisplay',
      backgroundTypePtype:'backgroundType',
      backgroundUrlPtype:'backgroundUrl',
      descriptionPtype:'description',
      heightPtype:'height',
      menu_labelPtype:'menu_label',
      widthPtype:'width',

      LAYOUT_CREATE:0,
      LAYOUT_EDIT:1,
      mode:0,


      menuOptions: ['Save', 'Cancel' ],
      openMenuOption: 'Save'
    }
  },
  props:{
    cmd:{
      type: String,
      required: false
    },
    cmdObjectVersion:{
      type: Number,
      required:false
    },
    currentValues:{
      type: Object,
      required:true
    }
  },
  watch:{
    cmd: function(){
      console.log('createLayout cmd changed - ', this.cmd);
      switch(this.cmd){
        case 'Save':{
          this.saveData();
          break;
        }
        case 'saveSpace':{
          this.saveData();
          break;
        }
      }
    },
    cmdObjectVersion: function(){
      debugger;
        console.log('currentValues is:',this.currentValues);
        console.log('cmd is:', this.cmd);
        if(this.cmd=='editLayoutParams'){
          if(typeof(this.currentValues['backgroundDisplay'])!=='undefined'){
            this.backgroundDisplay= this.currentValues['backgroundDisplay'];
          }
          if(typeof(this.currentValues['backgroundColor'])!=='undefined'){
            this.backgroundColor= this.currentValues['backgroundColor'];
          }
          if(typeof(this.currentValues['backgroundType'])!=='undefined'){
            this.backgroundType = this.currentValues['backgroundType'];
          }
          if(typeof(this.currentValues['backgroundUrl'])!=='undefined'){
            this.backgroundUrl = this.currentValues['backgroundUrl'];
          }
          if(typeof(this.currentValues['height'])!=='undefined'){
            this.height = this.currentValues['height'];
          }
          if(typeof(this.currentValues['width'])!=='undefined'){
            this.width = this.currentValues['width'];
          }
          if(typeof(this.currentValues['description'])!=='undefined'){
            this.description = this.currentValues['description'];
          }
          if(typeof(this.currentValues['menu_label'])!=='undefined'){
            this.menu_label = this.currentValues['menu_label'];
          }
          this.mode=this.LAYOUT_EDIT;
        }


    }
  },
  methods:{

    checkEntry(){
      var errorMsg = '';
      if(this.menu_label==0){
        errorMsg = errorMsg + 'Layout Name, ';
      }
      if(this.description==0){
        errorMsg = errorMsg + 'Layout Description, ';
      }
      if(this.height==0){
        errorMsg = errorMsg + 'Rows , ';
      }
      if(this.width==0){
        errorMsg = errorMsg + 'Columns, ';
      }
      if(errorMsg.length >0){
        return errorMsg + 'need to be enetered!';
      } else {
        return 'Ok';
      }


    },

    configSelected(msg){
//      debugger;
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
        case "backgroundDisplay":{
          this.backgroundDisplay = msg[1];
          break
        }
      }

    },
    newColor(evt){
      console.log(evt.target.value);
      this.updatedColor=evt.target.value;
    },
    getColorVal(){

    },
    saveData(){
        debugger;
      var err = this.checkEntry();
      if(err=='Ok'){
        axios.post('http://localhost:8000/api/shan/createLayoutNoBlanks?XDEBUG_SESSION_START=17516', {
          name: this.menu_label,
          description: this.description,
          height: this.height,
          width: this.width,
          backgroundColor: this.updatedColor,
          backgroundType: this.backgroundType,
          backgroundImage: this.backgroundImageFile,
          backgroundDisplay: this.backgroundDisplay,
          userId: this.$store.getters.getLoggedInUserId,
          user: this.$store.getters.getLoggedInUser,
          orgId: this.$store.getters.getOrgId
        }).then(response=>
        {
//            debugger;
          this.layoutId=response.data;
          this.$emit('layoutData', [this.layoutId,this.menu_label, this.description, this.height, this.width, this.val, this.updatedColor]);
//        this.$emit('layoutSaved', [this.layoutId, this.height, this.width, this.description, this.menu_label, this.val]);
//                this.$refs.editGrid.createBlankLayout(msg[2],msg[3],msg[1],msg[0]);
        }).catch(function(error) {
          console.log(error);
        });

      } else {
        this.$emit('error', err);
      }
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
