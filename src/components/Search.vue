<template>
  <span class="searchComponent">
    <div class="cardHeader" v-if="showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <div>
      <span >
        <search-box class="searchBox" :label="searchLabel" :inputSize="searchBoxSize" @search="submitQuery"  ></search-box>
      </span>
    </div>



  </span>

</template>

<script>
//import textAreaField from "@/components/textAreaField"
import axios from "axios";
import CardBase from "@/components/CardBase";
import menuOpt from "../components/menuOptV2.vue";
import SearchBox from "@/components/searchBox";
export default {
name: "Search",
  components:{SearchBox, menuOpt},
  extends: CardBase,
  mounted(){
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    this.cardData=this.cardContent.cardText;
    var mOpts = this.getMenuOpts('entryMenuSearch');
    this.currentMenuOpts = mOpts.currentMenuOpts;
  },
  data(){
    return {
      searchTypeReference:'searchQuery',
      searchLabel:'Look For:',
      searchBackground:'#ffffff',
      searchQuery:'',
      showOptions: false,
      searchBoxSize:30
    }
  },
  props:{
    cardContent:{
      type: Object,
      required: true
    },
    displayStatus: {
      type: Boolean,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
  },
  methods:{
    submitQuery(msg){
      axios.get('http://localhost:8000/api/shan/solrSimpleQuery?XDEBUG_SESSION_START=14668', {
        params:{
          orgId:this.$store.getters.getOrgId,
          query:msg
        }
      })
      .then(response => {
        console.log(response);
      })
      .catch(e => {
        console.log(e,'search query failed');
      });

    },

    menuOptSelected(msg){
      console.log(msg);
      switch(msg){
        case 'exitEdit':{
          this.$router.push({
            name: 'displayLayout',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
          break;
        }
        case 'Configure':{
          this.configureClicked('textShow');
          break;
        }
        case 'Resize':{
          this.$emit('ghostCard');
          break;
        }

      }
    }
  }

}
</script>

<style scoped>
.searchBox{
  padding: 10px;
}
.searchButton {
  margin-left: 22%;
}
.searchComponent {
  width:100%;
  display:grid;
  grid-template-rows: 10% 20% 80%;
}
.cardHeader {
  color: blue;
  height: 100%;
  background-color: #fff722;
  font-family: Geneva;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
</style>
