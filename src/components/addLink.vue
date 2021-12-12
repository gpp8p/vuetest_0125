<template>
<span class="addLinkWrapper">
    <span class="labelPlusInput">
      <span>
        Title:
      </span>
      <span class="titleField">
        <input v-model="currentCardData.linkMenuTitle" size="45"/>
      </span>
      <span>
        Orient:
        <o-radio v-model="orient" name="orientation" native-value="vertical">Vertical</o-radio>
        <o-radio v-model="orient" name="orientation" native-value="horozontal">Horozontal</o-radio>
      </span>
    </span>
  <div class="extLinkArea">
    <span class="extLinkRow1">
      <span>
        <input type="radio" name="linkType" value="extSelected" v-model="linkChoice" @change="linkChoiceMade" />
      </span>
      <span>
        External Link - Description:
      </span>
      <span>
        <input type="text" v-model="extLinkDescription" size="100" />
      </span>
    </span>
    <span class="extLinkRow2">
      <span>

      </span>
      <span>Link Url:</span>
      <span>
        <input type="text" v-model="extLinkUrl" size="75" />
      </span>
    </span>
  </div>
  <div class="intLinkArea">
    <span class="intLinkHeader">
      <span>
        <input type="radio" name="linkType" value="intSelected" v-model="linkChoice" @change="linkChoiceMade" />
      </span>
      <span>
        Internal Space:
      </span>
      <span>
      </span>
    </span>
    <span class="intLinkBody" >
      <layout-list :cmd="cmd" @layoutSelected="layoutSelected" v-if="this.showInternalLinks==true"></layout-list>
    </span>
  </div>

</span>
</template>

<script>
import layoutList from "../components/layoutList.vue";
export default {
  name: "addLink",
  components: {layoutList},
  props:{
    cmd:{
      type: String,
      required: true
    },
    cardData:{
      type: String,
      required: true
    }
  },
  data() {
    return {
      extLinkDescription: '',
      extLinkUrl: '',
      linkChoice: '',
      showInternalLinks: false,
      extSelected: 'external',
      intSelected: 'internal',
      extEntry:false,
      orient:'vertical',
      linkMenuTitle:'',
      currentCardData:'',
    }
  },
  watch:{
    extLinkDescription: function(){
      if(!this.extEntry){
        this.$emit('showSave');
        this.extEntry = true;
      }

    },
    linkMenuTitle: function(){
      this.$emit('showSave');
    },
    extLinkUrl: function(){
      if(!this.extEntry){
        this.$emit('showSave');
        this.extEntry = true;
      }
    },
    cmd: function(){
      console.log('linkMaster cmd changed-', this.cmd);
      debugger;
      switch(this.cmd){
        case 'save':{
          debugger;
          var currentCardData = {};
          currentCardData.orient = this.orient;
          currentCardData.linkMenuTitle = this.linkMenuTitle;
          this.$emit('saveCardContent', [currentCardData, 'linkContent', 'main'] );
          break;
        }
      }
    },

  },
  mounted(){
    this.currentCardData= JSON.parse(this.cardData);
    this.orient = this.currentCardData.orient;
  },

  methods: {
    linkChoiceMade() {
      console.log(this.linkChoice);
      if (this.linkChoice == 'intSelected') {
        this.$emit('showSave');
        this.showInternalLinks = true;
        this.extEntry=false;

      } else {
        this.$emit('noShowSave');
        this.showInternalLinks = false;
      }
    },
    layoutSelected(msg){
      console.log('layoutSelected in addLink',msg);
      this.extLinkDescription='';
      this.extLinkUrl='';
      this.$emit('targetLayoutSelected',msg);
      console.log(msg);
    },
    is_url(str) {
      let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      if (regexp.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    saveOrientation(){
      this.$emit('saveCardContent', [this.currentCardData, 'linkContent', 'main'] );
    }
  }
}
</script>

<style scoped>
  .addLinkWrapper {
    display:grid;
    grid-template-rows: 15% 15% 70%;
    grid-template-columns: 100%;
  }
  .extLinkArea {
    display : grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 100%;
  }
  .extLinkRow1 {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 5% 20% 75%;
  }
  .extLinkRow2 {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 5% 20% 75%;
  }
  .intLinkArea {
    display: grid;
    grid-template-rows: 15% 85%;
    grid-template-columns: 100%;
  }
  .intLinkHeader {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 5% 20% 75%;
    margin-top: 3px;
  }
  .intLinkBody {
    display:grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
  }
  .labelPlusInput {
    width:100%;
    display:grid;
    margin-top: 3px;
    grid-template-columns: 10% 50% 40%;
    font-family: Arial;
    font-size: medium;
    color: #0a3aff;
  }


</style>
