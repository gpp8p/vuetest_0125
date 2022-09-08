<template>
    <div class="hdrBarDiv">
        <span class="contextArea"><context-area :layout="nextLayout" :cmd="thisCmd" :cmdVersion="thisCmdVersion" @topLevelPage="topLevelPage"></context-area></span>
        <span class="tabArea">
          <menu-component :items='menuItems' :selected-item="this.selectedMenuItem" @menuSelection="tabSelected"></menu-component>
            <span class="messageArea">{{this.message}}</span>
        </span>
        <span class="loginArea"><login-component @login="login" @logout="logout" :cmd="this.cmd" @register="register" @newLayout="newLayout" @logError="logError"></login-component></span>

    </div>

</template>

<script>
    import menuComponent from "../components/menuComponent.vue";
    import loginComponent  from "./loginComponent";
    import contextArea from "../components/contextArea.vue";
//    import menuItem from "@/components/menuItem";
    export default {
        name: "headerBar",
        props:{
          message:{
            type: String,
            required: true
          },
          cmd:{
            type: String,
            required: true
          }
        },
        data(){
          return {
            menuItems: [],
            selectedMenuItem:-1,
            nextLayout:0,
            topPerm:0,
            VIEW_PERM:1,
            AUTHOR_PERM:2,
            ADMIN_PERM:3,
            layoutPerms:{},
            viewContext:0,
            VIEW_VIEWING:0,
            VIEW_EDITING:1,
            VIEW_NEWCARD:2,
            VIEW_SPACES:10,
            VIEW_DELETES:11,

              WAITINGFORCLICK:0,
              TOPLEFTCLICKED:1,
              BOTTOMRIGHTCLICKED:2,
              SELECTAREAOK:3,
              WAITINGFORNAME:4,
              WAITINGFORTYPE:5,
              WAITINGFORSUBMIT:6,
              WAITINGTOSAVE:8,
              CANCELLAYOUTUPDATE:7,
              CARDBEINGCONFIGED:8,
              thisCmd:'',
              thisCmdVersion:0
          }
        },
        mounted(){
          console.log('header bar has been mounted');
 //         debugger;
          this.menuItems = this.getMenuItems();
          this.$emit('viewStatusChangeFunction', ['headerBar',this.viewStatusChange]);
        },
        watch:{
          cmd: function(){
            var cmdElements = this.cmd.split(':');
//            debugger;
            console.log('headerBar cmd changed - ',cmdElements);
            switch(cmdElements[0]){
              case 'cardSaved':{
                this.viewContext=this.VIEW_VIEWING;
                this.menuItems = this.getMenuItems();
                this.$emit('viewStatusChangeFunction', ['clearCmd']);
                break;
              }
              case 'layoutChanged':{
//                debugger;
                this.viewContext=this.VIEW_VIEWING;
                this.layoutChanged();
                this.nextLayout=cmdElements[1];
                this.$emit('viewStatusChangeFunction', ['clearCmd']);
                break;
              }
              case 'linkToNewLayout':{
//                this.nextLayout = this.$store.getters.getCurrentLayoutId;
                console.log('linkToNextLayout', this.nextLayout);
//                debugger;
                break;
              }
              case 'newCardSetup':{
                debugger;
                this.message = "Please identify top right corner of card by clicking on an empty tile";
                break;
              }
              case 'editLayout':{
//                debugger;
                this.viewContext=this.VIEW_EDITING;
                this.menuItems = this.getMenuItems();
         //       this.$emit('viewStatusChangeFunction', ['clearCmd']);
                break;
              }
              case 'mySpaces':{
                this.viewContext=this.VIEW_SPACES;
                this.menuItems = this.getMenuItems();
                this.$emit('viewStatusChangeFunction', ['clearCmd']);
                break;
              }
              case 'selectLayoutToUnDelete':{
                this.viewContext=this.VIEW_DELETES;
                this.menuItems = this.getMenuItems();
                this.$emit('viewStatusChangeFunction', ['clearCmd']);
                break;
              }
            }
          }
        },
        created() {
            console.log('event hub set up in headerBar');
//            this.$eventHub.$on('layoutChanged', this.layoutChanged);
            this.$eventHub.$on('editStatusChanged', this.editStatusChanged);
        },
        beforeDestroy(){
            console.log('event hub turned off in headerBar');
//            this.$eventHub.$off('layoutChanged');
            this.$eventHub.$off('editStatusChanged');
        },
        components: {menuComponent, loginComponent, contextArea},
        methods:{
            tabSelected(msg){
//                debugger;

                switch(msg[0]){
                  case 'Edit':{
                    this.viewContext=this.VIEW_EDITING;
                    this.menuItems = this.getMenuItems();
                    break;
                  }
                  case 'Cancel Edit':{
                    this.viewContext=this.VIEW_VIEWING;
                    this.menuItems = this.getMenuItems();
                    break;
                  }
                }

              this.$emit('tabSelected', msg[0]);
            },
            login(msg){
//                debugger;
                this.layoutChanged();
                this.$emit('login', [msg[0]]);
            },
            logout(){
//                debugger;
                this.thisCmd = "returnTopLayout";
                this.thisCmdVersion++;
            },
            register(){
                this.$emit('register');
            },
            newLayout(msg){
              console.log('newLayout',msg);
              this.nextLayout=parseInt(msg[0]);
            },
            logError(msg){
                this.$emit('logError', msg);
            },
            testEvtHub(){
              console.log('Event hub caught it');
            },
            viewStatusChange(args){
              console.log('view status change called in headerBar:', args);
              switch(args[0]){
                case 'New Card':{
                  this.message = "Please identify top right corner of card by clicking on an empty tile";
                  break;
                }
                case 'Cancel New Card':{
                  this.message='';
                  break;
                }
              }

            },
            editStatusChanged(msg){
                debugger;
                console.log('edit status called',msg);
                switch(msg[0]){

                    case 'openEdit':{
//                        debugger;
                        this.viewContext=this.VIEW_EDITING;
                        break;
                    }
                    case 'cancelEdit':{
                            this.message = '';
                            this.viewContext=this.VIEW_VIEWING;
                        break;
                    }

                    case 'newCard':
                        switch(msg[1]){
                            case this.WAITINGFORCLICK:
//                                debugger;
                                this.message = "Please identify top right corner of card by clicking on an empty tile";
                                break;
                            case this.TOPLEFTCLICKED:
                                this.message = ""
                        }
                        break;
                }
                this.menuItems=this.getMenuItems();
            },
            getMenuItems(){
                debugger;

                if(this.viewContext==this.VIEW_VIEWING){
                  if(this.$store.getters.getIsAdmin>0){
                    return ['Edit','Delete', 'Publish', 'Create', 'Access','My Spaces', 'Sites'];
                  }else{
                    if(this.topPerm==this.VIEW_PERM){
                      return [];
                    }else if(this.topPerm==this.AUTHOR_PERM){
                      return ['Edit','Delete', 'Publish','Access'];
                    }else if((this.topPerm==this.ADMIN_PERM)){
                      return ['Edit','Delete', 'Publish', 'Create', 'Access','My Spaces', 'Sites'];
                    }
                  }
                }else if(this.viewContext==this.VIEW_EDITING){
                    return ['Change Page Setup', 'Insert Existing Card','Create A New Card', 'Exit'];
                }else if(this.viewContext==this.VIEW_SPACES){
                    return ['Exit', 'Show Deleted'];
                }else if(this.viewContext==this.VIEW_DELETES){
                    return ['Exit'];
                }

            },
            layoutChanged(){
                debugger;
                console.log('layoutChanged');
                this.layoutPerms = this.$store.getters.getPerms;
                if(this.layoutPerms.view) this.topPerm=this.VIEW_PERM;
                if(this.layoutPerms.author) this.topPerm=this.AUTHOR_PERM;
                if(this.layoutPerms.admin) this.topPerm=this.ADMIN_PERM;
                this.menuItems=this.getMenuItems();
/*
                switch(this.topPerm){
                    case this.VIEW_PERM:
                        this.menuItems = this.menuItemsView;
                        break;
                    case this.AUTHOR_PERM:
                        this.menuItems = this.menuItemsAuthor;
                        break;
                    case this.ADMIN_PERM:
                        this.menuItems = this.menuItemsAdmin;
                        break;
                }
*/
            }
        }
    }
</script>

<style scoped>

.hdrBarDiv {
  display: grid;
  grid-template-columns: 18% 59.5% 18%;
  grid-template-rows: 7vh;
  grid-column-gap: 2%;
  height: 100%;
}
.contextArea{
  background-color: #ffcd90;
  color:white;
  height: 100%;
}
.tabArea {
  display:grid;
  grid-template-rows: 50% 50%;
  background-color: #ffcd90;
  color:white;
  height: 100%;
}
.messageArea{
  display: flex;
  justify-content: center;
  color:blue;
}
.loginArea {
  background-color: #ffcd90;
  color:blue;
  height: 100%;
}

</style>
