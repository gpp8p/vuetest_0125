<template>
  <div>
    <div class="cardStyle">
      <div class="cardHeader" v-if="showOptions==true">
        <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
      </div>
        Please Log In
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "loginLink",
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showOptions:false
    }
  },
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('entryMenu');
    this.currentMenuOpts = mOpts.currentMenuOpts;
  },
  methods: {
    getMenuOpts(menuContext) {
      switch (menuContext) {
        case'entryMenu': {
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
    menuOptSelected(msg) {
      console.log(msg);
      switch (msg) {
        case 'Cancel': {
          this.editStatus = false;
          var mOpts = this.getMenuOpts('entryMenu');
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

          break;
        }
        case 'DelCardFromDb': {
          console.log('remove from db selected');
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

          break;
        }
      }
    },
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
    moveClicked(){
      console.log('moveClicked');
      this.$emit('ghostCard');
    },

  }

}
</script>

<style scoped>

</style>
