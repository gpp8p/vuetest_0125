<template>
  <div>
    <div class="cardStyle">
      <div class="cardHeader" v-if="this.showOptions==true">
        <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
      </div>
      Please Log In
    </div>
  </div>
</template>

<script>
//import axios from "axios";
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";

export default {
  name: "loginLink",
  components: {menuOpt},
  extends: CardBase,
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      showOptions:false,
      currentMenuOpts:[],
      styling: {},
      configurationCurrentValues:{},
    }
  },
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    console.log('showOptions =',this.showOptions);
    console.log('displayStatus=',this.displayStatus);
    var mOpts = this.getMenuOpts('entryMenu_loginLink');
    this.currentMenuOpts = mOpts.currentMenuOpts;
  },
  methods: {
/*
    getMenuOpts(menuContext) {
      switch (menuContext) {
        case'entryMenu_loginLink': {
          return {
            currentMenuOpts: [
              ['Configure', 'Configure'],
              ['Resize/Move', 'Resize'],
              ['Del', 'DeleteCard'],
            ],
            currentMenuSelection: 'Configure'
          }
        }
        case 'deleteChoice': {
          return {
            currentMenuOpts: [
              ['Remove from Layout', 'RmvLay'],
              ['Delete Card', 'DelCardFromDb'],
              ['Cancel', 'Cancel']
            ],
            currentMenuSelection: 'Cancel'
          }
        }
      }
    },
*/
    menuOptSelected(msg) {
      console.log(msg);
      switch (msg) {
        case 'Cancel': {
          this.editStatus = false;
          var mOpts = this.getMenuOpts('entryMenu_loginLink');
          this.currentMenuOpts = mOpts.currentMenuOpts;

          break;
        }
        case 'Configure': {
          this.configureClicked();
          break;
        }
        case 'Resize': {
          this.moveClicked();
          break;
        }
        case 'DeleteCard': {
          mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay': {
          console.log('remove from layout selected');
          this.removeCardFromLayout(this.cardId);
/*
          axios.get('http://localhost:8000/api/shan/rmvlay?XDEBUG_SESSION_START=14668', {
            params: {
              layoutId: this.$store.getters.getCurrentLayoutId,
              cardId: this.cardId,
              orgId: this.$store.getters.getOrgId
            }
          })
              .then(response => {
                console.log(response);
                this.$emit('configurationHasBeenSaved');
              })
              .catch(e => {
                this.errors.push(e);
                console.log('remove card from layout failed');
              });
*/
          break;
        }
        case 'DelCardFromDb': {
          console.log('remove from db selected');
          this.deleteCardFromDb(this.cardId);
/*
          axios.get('http://localhost:8000/api/shan/deleteCard?XDEBUG_SESSION_START=14668', {
            params: {
              layoutId: this.$store.getters.getCurrentLayoutId,
              cardId: this.cardId,
              orgId: this.$store.getters.getOrgId
            }
          })
              .then(response => {
                console.log(response);
                this.$emit('configurationHasBeenSaved');
              })
              .catch(e => {
                this.errors.push(e);
                console.log('remove card from layout failed');
              });
*/
          break;
        }
      }
    },
/*
    configureClicked() {
//      debugger;
      this.styling={};
      this.loadCardConfiguration(this.cardId);
      this.dialog=true;
      this.testProp=true;
      this.tdialogMsg='message recieved'
//      debugger;

      this.$emit("cardClick", [
        "cardClicked",
        this.cardKey,
        "greenComponent",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues,
      ]);



    },

 */
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },



  }

}
</script>

<style scoped>
.cardStyle {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.cardHeader {
  display: flex;
  justify-content: space-evenly;
  width:100%;
  align-items: baseline;
  color: blue;
  height: 10%;
  background-color: #fff722;
  font-family: Geneva;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
.cardBody {
  height: 90%;
  margin:10px;
}

</style>
