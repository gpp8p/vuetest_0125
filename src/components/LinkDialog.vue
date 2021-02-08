<template>
    <div class="dialogComponent" ref="drg"  draggable="true"  @dragstart="handleDragStart"   @dragend="handleDragEnd" >
      <div class="dialogComponentHeader" v-if="dialogContext==this.DIALOG_TITLE">
        <span class="headingText">{{this.titleMsg}}</span>
      </div>
      <div class="dialogComponentHeader" v-if="dialogContext==this.DIALOG_RUSURE">
            <span class="sure">
              <are-you-sure :msg="sureMsg" @rusureClick="rusure"></are-you-sure>
            </span>
      </div>
        <br/>

      <div class="dialogComponentBody">


        <new-layout
            ref="newl"
            v-if = "linkType==this.NEW_LAYOUT"
            @componentSettingsMounted="componentSettingsMounted"
            @layoutData="layoutData"
            :cmd="cmd"
        ></new-layout>
        <layout-list v-if="LinkType==this.LAYOUT_LIST"
                     :cmd="cmd"
                     @spaceSelected="spaceSelected"
        ></layout-list>
      </div>
      <div class="dialogComponentFooter">
          <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
      </div>
    </div>

</template>

<script>
//    import greenComponentSettings from "../components/greenComponentSettings.vue";
    import menuOpt from "../components/menuOpt.vue";
    import newLayout from "../components/createLayout.vue";
    import AreYouSure from "../components/AreYouSure.vue";
    import layoutList from "../components/layoutList.vue";


 //   import store from "@/store";

    export default {
        name: "LinkDialog",
        components :{menuOpt,  newLayout, AreYouSure, layoutList},
        props:{
          cmd:{
            type: String,
            required: true
          }
        },
        mounted(){
          this.getTitle();
          if(this.linkType==this.LAYOUT_LIST){
            this.currentMenuOpts = ['Cancel', 'Create Linked Space', 'Back'];
          }else if(this.linkType==this.NEW_LAYOUT){
            this.currentManuOpts = ['Cancel', 'Save this Space', 'Back'];
          }

        },
        watch:{
          cmd: function(){
            console.log('Dialog cmd changed:',this.cmd);
          },
        },
        methods: {

            cancelClicked(){
                this.$emit('configSelected',['cancel']);
            },

            saveClicked(){
                //        debugger;
                this.$emit('configSelected', ['save']);
            },
            configSelected(msg){
                this.dialogDataChanged = true;
                this.$emit('configSelected', msg);
            },
            handleDragStart(evt){
//                debugger;
                this.$emit('dragStart',[evt.screenX, evt.screenY])
            },
            layoutData(msg){
 //             debugger;
              console.log('layoutData',msg);
              this.$emit('configSelected',['layoutSaved', msg[0]]);
            },
            menuOptSelected(msg){
              console.log(msg);
              this.cmd='';
              debugger;
              switch(msg){
                case 'Cancel':{
                  if(this.dialogDataChanged){
                    this.freezeEvent('configSelected',['cancel']);
                    this.sureMsg = 'Unsaved changes - are you sure you want to cancel ?';
                    this.dialogContext=this.DIALOG_RUSURE
                  }else{
                    this.currentSelectedMenuOption = msg;
                    this.$emit('configSelected',['cancel']);
                  }
//                  store.commit('setRegister', false);
                  break;
                }

                case 'Save This Space':{
                  this.cmd='Save';
                  break;
                }


                default:{
                  this.currentSelectedMenuOption = msg;
                  this.cmd = msg;
                  break;
                }
              }
            },
            spaceSelected(msg){
              console.log(msg);
            },
            rusure(msg){
//              debugger;
              if(msg){
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;
                this.releaseFrozenEvent();
              }else{
                this.sureMsg = '';
                this.dialogContext=this.DIALOG_TITLE;
                this.freezeEvent('',[]);
              }
            },
            handleDragEnd(evt){
                this.lastMouseX = evt.screenX;
                this.lastMouseY = evt.screenY;
                this.$emit('moved', [evt.screenY , evt.screenX]);
            },
            componentSettingsMounted(msg){
              debugger;
              console.log("register=", this.$store.getters.getRegister);
              console.log(msg);
              this.currentMenuOpts = msg[0];
              this.currentSelectedMenuOption = msg[1];

            },
            freezeEvent(eventType, eventArgs){
                this.frozenEvent.eventType = eventType;
                this.frozenEvent.eventArgs = eventArgs;
            },
            releaseFrozenEvent(){
              this.$emit(this.frozenEvent.eventType, this.frozenEvent.eventArgs);
            },
            getTitle(){
              switch(this.linkType){
                case this.NEW_LAYOUT:{
                  this.titleMsg = "Create New Layout";
                  break;
                }
                case this.LAYOUT_LIST:{
                  this.titleMsg = "Select Existing Layout";
                  break;
                }
              }
            },

            setTitle(msg){
              this.titleMsg = msg;
            },
            clearCmd(){
              this.cmd='';
              this.$emit('clearCmd');
            }
        },


        data(){
            return {
                styleObject: {
                    top: '-600px',
                    left: '400px'
                },
                lastMouseX:0,
                lastMouseY:0,
                currentMenuOpts:[],
                currentSelectedMenuOption:'',

                titleMsg:'Select Existing Layout',
                LAYOUT_LIST:0,
                NEW_LAYOUT:1,
                linkType:0,


                sureMsg:'',

                dialogContext:0,

                frozenEvent:{
                  eventType:'',
                  eventArgs:[]
                },
                dialogDataChanged: false





            }
        }
    }
</script>

<style scoped>
    .dialogComponent {
        height:325px;
        width:650px;
        position: relative;
        background-color: #ab97ff;
        border: 2px solid blue;
        border-radius: 8px;
        box-shadow: 10px 10px 5px grey;
        z-index: 10;
    }
    .dialogComponentHeader {
        height:10%;
        background-color: #fff722;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-align: center;
        color: blue;
        font-family: Geneva;
        font-size: 12px;
        font-style: normal;
        font-weight: bold;
        padding-top: 5px;
    }
    .headingText{
        margin-top: 5px;
    }
    .dialogComponentBody {
        height: 72%;
        width: 90%;
        margin-left: 10px;
        margin-right: 10px;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100%


    }
    .dialogComponentFooter {
      height: 10%;
      width:100%;
      margin-left: auto;
      margin-right: auto;
      text-align: center
    }
    .linkStyle{
        font-family: Arial;
        font-size: medium;
        color: #0a3aff;
        margin-left: 10%;
        margin-right: 10%;
    }
    .field{
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
    }
    .sure {
      margin-top: 5px;
    }
</style>
