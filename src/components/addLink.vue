<template>
<span class="addLinkWrapper">
    <span class="labelPlusInput">
      <span>
        Title:
      </span>
      <span class="titleField">
        <input v-model="linkMenuTitle" size="65"/>
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
      <layout-list :cmd="cmd" @spaceSelected="spaceSelected" v-if="this.showInternalLinks==true"></layout-list>
    </span>
  </div>

</span>
</template>

<script>
import layoutList from "../components/layoutList.vue";
export default {
  name: "addLink",
  components: {layoutList},
  data() {
    return {
      extLinkDescription: '',
      extLinkUrl: '',
      linkChoice: '',
      showInternalLinks: false,
      extSelected: 'external',
      intSelected: 'internal',
      extEntry:false
    }
  },
  watch:{
    extLinkDescription: function(){
      if(!this.extEntry){
        this.$emit('showSave');
        this.extEntry = true;
      }

    },
    extLinkUrl: function(){
      if(!this.extEntry){
        this.$emit('showSave');
        this.extEntry = true;
      }
    }

  },
  methods: {
    linkChoiceMade() {
      console.log(this.linkChoice);
      if (this.linkChoice == 'intSelected') {
        this.$emit('noShowSave');
        this.showInternalLinks = true;
        this.extEntry=false;

      } else {
        this.$emit('noShowSave');
        this.showInternalLinks = false;
      }
    },
    spaceSelected(msg){
      this.extLinkDescription='';
      this.extLinkUrl='';
      this.$emit('showSave');
      console.log(msg);
    },
    is_url(str) {
      let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      if (regexp.test(str)) {
        return true;
      } else {
        return false;
      }
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


</style>
