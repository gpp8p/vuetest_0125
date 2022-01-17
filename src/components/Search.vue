<template>
  <span class="searchComponent">
    <span>
      <span class="searchBox">
        <text-area-field class="searchBox" :pType="searchTypeReference"  :label="searchLabel" :currentValues="this.cardContent" :backgroundColor = "searchBackground" @configSelected="entry"></text-area-field>
      </span>
    </span>
    <span></span>
  <span class="searchButton"><o-button @click="submitQuery">Search</o-button></span>

  </span>

</template>

<script>
import textAreaField from "@/components/textAreaField"
import axios from "axios";
export default {
name: "Search",
  components:{textAreaField},
  data(){
    return {
      searchTypeReference:'searchQuery',
      searchLabel:'Look For:',
      searchBackground:'#ffffff',
      searchQuery:''
    }
  },
  props:{
    cardContent:{
      type: Object,
      required: true
    },
  },
  methods:{
    entry(msg){
      console.log('search:', msg);
      this.searchQuery = msg[1];
    },
    submitQuery(){
      axios.get('http://localhost:8000/api/shan/solrSimpleQuery?XDEBUG_SESSION_START=14668', {
        params:{
          orgId:this.$store.getters.getOrgId,
          query:this.searchQuery
        }
      })
      .then(response => {
        console.log(response);
      })
      .catch(e => {
        console.log(e,'search query failed');
      });

    }
  }

}
</script>

<style scoped>
.searchBox{
  padding: 10px;
}
.searchButton {
  margin-left: 20%;
}
.searchComponent {
  width:100%;
  display:grid;
  grid-template-rows: 20% 80%;

}
</style>
