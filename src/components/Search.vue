<template>
  <span class="searchComponent">
    <span>
      <span class="searchBox">
        <text-area-field class="searchBox" :pType="searchTypeReference"  :label="searchLabel" :currentValues="this.cardContent" :backgroundColor = "searchBackground" @configSelected="configSelected"></text-area-field>
      </span>
    </span>
    <span></span>
  <span class="searchButton"><o-button>Search</o-button></span>

  </span>

</template>

<script>
import textAreaField from "@/components/textAreaField"
export default {
name: "Search",
  components:{textAreaField},
  data(){
    return {
      searchTypeReference:'searchQuery',
      searchLabel:'Look For:',
      searchBackground:'#ffffff'
    }
  },
  props:{
    cardContent:{
      type: Object,
      required: true
    },
  },

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
