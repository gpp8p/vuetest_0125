<template>
  <span class="newLayoutWrapper">
     <span class="labelPlusInput">
         <span>
            Page Name:
         </span>
         <span>
            <input v-model="menu_label"  size="32" maxlength="32" @change="menu_label_changed" />
         </span>
     </span>
     <span class="labelPlusInput">
        <span>
          Page Description:
        </span>
       <span>
          <input v-model="description" @change="description_changed" maxlength="45" size="45"/>
       </span>
     </span>

     <span class="labelPlusInput">
        <span>
          Rows:
        </span>
       <span v-if="this.mode==this.LAYOUT_CREATE">
         <input v-model="height" @change="height_changed" size="8"/>
       </span>
       <span v-if="this.mode==this.LAYOUT_EDIT">
          {{this.height}}
       </span>
     </span>
     <span class="labelPlusInput">
        <span>
          Columns:
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
          Permissions::
        </span>
       <span>
          <o-radio v-model="permType" name="permType"  native-value="default">
          Open Access
          </o-radio>
          <o-radio v-model="permType" name="permType"  native-value="template">
          Copy Page Permissions (Restricted)
          </o-radio>
       </span>
     </span>
≈
     <span class="labelPlusInput">
          <span>
            Background:
          </span>
       <span class="backgroundPick">
          <background-picker :currentValues="currentValues" :dialogKey="cmdObjectVersion" :pType="backgroundTypePtype" :noTransparent=true @configSelected="configSelected"></background-picker>
      </span>
     </span>
     <span class="labelPlusInput">
        <span>Template:</span>
        <span>
          <o-checkbox v-model="template"></o-checkbox>
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
    this.updatedColor = this.currentValues['backgroundColor'];
    console.log('cmdObjectVersion is', this.cmdObjectVersion);
    this.$emit('childCmd', this.childCmd);
  },
  data(){
    return {
      layoutId:'',
      menu_label:'',
      description:'',
      height:'',
      width:'',
      val:'#dbddb0',
      updatedColor:'',
      template:false,

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
      RETURN_TO_LINKS:3,
      RETURN_TO_EDIT:4,
      mode:0,


      menuOptions: ['Save', 'Cancel' ],
      openMenuOption: 'Save',
      permType: 'default'
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
/*
    cmd: function(){
      console.log('createLayout cmd changed - ', this.cmd);
      switch(this.cmd){
        case 'Save':{
          this.saveData(this.RETURN_TO_LINKS);
          break;
        }

        case 'saveSpace':{
          this.saveData(this.RETURN_TO_LINKS);
          break;
        }

        case 'updateLayout':{
          this.updateLayout();
          break;
        }
      }
    },
 */
    cmdObjectVersion: function(){
      debugger;
        console.log('currentValues is:',this.currentValues);
        console.log('cmd is:', this.cmd);
        switch(this.cmd){
          case'editLayoutParams':{
            this.$emit('setEditLayoutMenu');
            if(typeof(this.currentValues['backgroundDisplay'])!=='undefined'){
              this.backgroundDisplay= this.currentValues['backgroundDisplay'];
            }
            if(typeof(this.currentValues['backgroundColor'])!=='undefined'){
              this.backgroundColor= this.currentValues['backgroundColor'];
              this.updatedColor = this.currentValues['backgroundColor'];
            }
            if(typeof(this.currentValues['backgroundType'])!=='undefined'){
              this.backgroundType = this.currentValues['backgroundType'];
            }
            if(typeof(this.currentValues['backgroundImage'])!=='undefined'){
              this.backgroundImageFile = this.currentValues['backgroundImage'];
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
            if(typeof(this.currentValues['template'])!=='undefined'){
              if(this.currentValues['template']=='Y'){
                this.template=true;
              }else{
                this.template=false
              }
            }
            this.mode=this.LAYOUT_EDIT;
            break;
          }
          case 'saveNewPage':{
            this.saveData(this.RETURN_TO_LINKS);
            break;
          }
          case 'saveSpace':{
            debugger;
            this.saveData(this.RETURN_TO_LINKS);
            break;
          }
          case 'Save':{
            this.saveData(this.RETURN_TO_LINKS);
            break;
          }
          case 'updateLayout':{
            this.updateLayout();
            break;
          }
          case 'AddPageSave':{
            this.saveData(this.RETURN_TO_EDIT);
            break;
          }
        }
    }
  },
  methods:{
    childCmd(parentCmd){
      console.log('childCmd in createLayout - ', parentCmd);
    },
    checkEntry(){
      var errorMsg = '';
      if(this.backgroundType=='C'&&this.updatedColor==''){
        errorMsg = errorMsg + 'backgroundColor, ';
      }
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
        return errorMsg + 'need to be enetered or selected!';
      } else {
        return 'Ok';
      }



    },

    configSelected(msg){
//      debugger;
      console.log('configSelected event:', msg);
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
          this.$emit('layoutDataChanged', ['backgroundType', this.backgroundType]);
          break;
        }
        case "backgroundTypeColor":{
          this.backgroundType="C";
          this.$emit('layoutDataChanged', ['backgroundType', this.backgroundType]);
          break;
        }
        case "backgroundImage":{
          this.backgroundImageFile = msg[1];
          this.$emit('layoutDataChanged', ['backgroundImage', this.backgroundImageFile]);
          break;
        }
        case "backgroundColor":{
          this.updatedColor = msg[1];
          console.log('backgroundColor set', this.updatedColor );
          this.backgroundColor = msg[1];
          this.$emit('layoutDataChanged', ['backgroundColor', this.updatedColor]);
          break;
        }
        case "backgroundDisplay":{
          this.backgroundDisplay = msg[1];
          this.$emit('layoutDataChanged', ['backgroundDisplay', this.backgroundDisplay]);
          break
        }
      }

    },
    menu_label_changed(msg){
      console.log('menu_label_changed', msg);
    },
    description_changed(msg){
      console.log('description_changed', msg)
    },
    height_changed(msg){
      console.log('height_changed', msg);
    },
    width_changed(msg){
      console.log('width_changed', msg);
    },
    newColor(evt){
      console.log(evt.target.value);
      this.updatedColor=evt.target.value;
    },
    getColorVal(){

    },
    saveData(returnMode){
        debugger;
      var err = this.checkEntry();
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      if(err=='Ok'){
        axios.post(apiPath+'api/shan/createLayoutNoBlanks?XDEBUG_SESSION_START=17516', {
//        axios.post('http://localhost:8000/api/shan/createLayoutNoBlanks?XDEBUG_SESSION_START=17516', {
          name: this.menu_label,
          description: this.description,
          height: this.height,
          width: this.width,
          backgroundColor: this.updatedColor,
          backgroundType: this.backgroundType,
          backgroundImage: this.backgroundImageFile,
          backgroundDisplay: this.backgroundDisplay,
          template: this.template,
          userId: this.$store.getters.getLoggedInUserId,
          user: this.$store.getters.getLoggedInUser,
          orgId: this.$store.getters.getOrgId,
          layoutId: this.$store.getters.getCurrentLayoutId,
          permType: this.permType
        }).then(response=>
        {
            debugger;
          this.layoutId=response.data;
          switch(returnMode){
            case(this.RETURN_TO_LINKS):{
              this.$emit('layoutData', [this.layoutId,this.menu_label, this.description, this.height, this.width, this.val, this.updatedColor]);
              break;
            }
            case(this.RETURN_TO_EDIT):{
              this.$emit('editLayoutData', [this.layoutId,this.menu_label, this.description, this.height, this.width, this.val, this.updatedColor]);
              break;
            }
          }

//        this.$emit('layoutSaved', [this.layoutId, this.height, this.width, this.description, this.menu_label, this.val]);
//                this.$refs.editGrid.createBlankLayout(msg[2],msg[3],msg[1],msg[0]);
        }).catch(function(error) {
          console.log(error);
        });

      } else {
        this.$emit('error', err);
      }
    },
    updateLayout(){
      debugger;
      var err = this.checkEntry();
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      if(err=='Ok'){
        axios.post(apiPath+'api/shan/updateLayout?XDEBUG_SESSION_START=17516', {
//          axios.post('http://localhost:8000/api/shan/updateLayout?XDEBUG_SESSION_START=17516', {
          layoutId:this.$store.getters.getCurrentLayoutId,
          name: this.menu_label,
          description: this.description,
          height: this.height,
          width: this.width,
          backgroundColor: this.backgroundColor,
          backgroundType: this.backgroundType,
          backgroundImage: this.backgroundImageFile,
          backgroundDisplay: this.backgroundDisplay,
          template: this.template,
          userId: this.$store.getters.getLoggedInUserId,
          user: this.$store.getters.getLoggedInUser,
          orgId: this.$store.getters.getOrgId
        }).then(response=>
        {
//            debugger;
          this.layoutId=response.data;
          this.$emit('layoutEditSaved', [this.layoutId,this.menu_label, this.description, this.height, this.width, this.val, this.updatedColor]);
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
  margin-left: 4px;
  display:grid;
  grid-template-rows: 10% 10% 10% 10% 10%;

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
