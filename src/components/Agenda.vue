<template>
  <span>
    <div class="cardHeader" v-if="this.showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <span v-if="this.mode==this.ARCHIVE_SELECT_DEFAULTS" class="selectDefaults">
      <o-field label="Title">
        <o-input v-model="title"></o-input>
      </o-field>
      <select-picker></select-picker>
    </span>

  </span>
</template>

<script>
import menuOpt from "../components/menuOptV2.vue";
import CardBase from "@/components/CardBase";
import selectPicker from "@/components/selectPicker";
import axios from "axios";


export default {
  name: "Agenda",
  extends: CardBase,
  components: {menuOpt, selectPicker},
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('archive_entry');
    this.currentMenuOpts = mOpts.currentMenuOpts;
    this.loadCardConfiguration(this.cardId);
    this.mode = this.ARCHIVE_BLANK;
  },
  data(){
    return {
      showOptions:false,
      styling: {},
      currentMenuOpts:[],
      configurationCurrentValues:{},
      title:'',
      mode:0,
      ARCHIVE_BLANK:0,
      ARCHIVE_SELECT_DEFAULTS:1


    }
  },
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    },
    cmd: {
      type: String,
      required: false
    },
    cardId: {
      type: String,
      required: true
    },
    cardKey: {
      type: String,
      required: true
    },
    cardPosition: {
      type: Array,
      required: true
    },
  },
  methods: {
    menuOptSelected(msg) {
      console.log(msg);
      switch (msg) {
        case 'Cancel': {
          this.editStatus = false;
          var mOpts = this.getMenuOpts('archive_entry');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'Configure':{
          this.configureClicked('archive');
          break;
        }
        case 'Resize': {
          debugger;
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
          break;
        }
        case 'DelCardFromDb': {
          console.log('remove from db selected');
          this.deleteCardFromDb(this.cardId);
          break;
        }
        case 'NewDoc':{
          axios.get('http://localhost:8000/api/shan/documentDefaults?XDEBUG_SESSION_START=14668', {
          })
              .then(response => {
                console.log(response);
                this.mode=this.ARCHIVE_SELECT_DEFAULTS;

              })
              .catch(e => {
                this.errors.push(e);
                console.log('orgMembers failed');
              });

          break;
        }
      }
    },
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
