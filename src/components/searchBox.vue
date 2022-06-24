<template>
  <section class="searchBox">
    <span class="inputPlusLabel">
      <span  class="labelStyle"><a @click="submitSearch" >Search:</a></span>
      <span >
        <input class="inputStyle"  type="text"  v-on:keyup.enter="submitSearch"  size="25" v-model="fieldContent" />
      </span>
      <span class="labelStyle" @click="clearSearch">Clear</span>
    </span>
    <span>
      <span class="radioItem">
          <o-radio v-model="this.currentSearchMode" name="searchType" @input="searchTypeSelected" native-value="search">
            Search Rslts.
          </o-radio>
          <o-radio v-model="this.currentSearchMode" name="searchType" @input="searchTypeSelected" native-value="links">
            Links
          </o-radio>

        </span>
    </span>
    <span class="advancedSearchCss" @click = "advancedSearchSelected" v-if="this.advancedSearchShowing==false">
      Advanced Search
    </span>
    <span class="advancedSearchCss" @click = "returnToLinksSelected" v-if="this.advancedSearchShowing==true">
      Show Links
    </span>

  </section>

</template>

<script>
export default {
name: "searchBox",
  props:{
    inputSize:{
      type: Number,
      required: true
    },
    displayMode:{
      type: String,
      required: true
    },
    existingQuery:{
      type: String,
      required: true
    }
  },
  mounted(){
    debugger;
    console.log('searchBox existingQuery-', this.existingQuery, this.existingQuery.length);
    this.currentSearchMode = this.displayMode;
    if(this.existingQuery.length>0){
      this.fieldContent=this.existingQuery;
    }else{
      this.fieldContent='';
    }
  },
  watch :{
    displayMode: function(){
      this.currentSearchMode = this.displayMode;
    },
    existingQuery: function(){
      this.fieldContent = this.existingQuery;
      this.$emit('search',this.fieldContent);
    }
  },
  data(){
    return {
      fieldContent:'',
      currentSearchMode:'',
      advancedSearchShowing:false
    }
  },
  methods:{
    submitSearch(){
      this.$emit('search',this.fieldContent);
    },
    clearSearch(){
      this.fieldContent ="";
      this.$emit('clearSearch');
    },
    searchTypeSelected(msg){
      console.log(msg);
      this.currentSearchMode = msg;
      this.$emit('searchTypeSelected', this.currentSearchMode);
    },
    advancedSearchSelected(){
      console.log('advanced search selected');
      this.advancedSearchShowing = true;
      this.$emit('advancedSearchSelected','advancedSearch');
    },
    returnToLinksSelected(){
      this.advancedSearchShowing = false;
      this.$emit('advancedSearchSelected','links');
    }
  }
}
</script>

<style scoped>
.searchBox {
  display:grid;
  grid-template-rows: 40% 40% 20%;
}

.inputStyle {
  background: #DBAA6E;
  color: blue;
  font-weight: bold;
  font-size: 12px;
  margin-left: 10%;
  width: 80%;

}
.radioItem {
  font-size: 12px;
  margin-right: 5px;
  font-weight: normal;
  display:grid;
  grid-template-columns: 50% 50%;
}
.advancedSearchCss {
  font-size: 12px;
  margin-right: 5px;
  font-weight: normal;
  color:blue;
}
.advancedSearchCss:hover {
  color: red;
}

.labelStyle:hover {
  background-color: yellow;
}
.labelStyle{
  font-family: Arial;
  font-size: medium;
  text-align: center;
  color: #0a3aff;
  background-color: #d3d4cd;
  border: 3px solid red;
  border-radius: 5px;
  padding-right: 4px;
  padding-left: 3px;

}
.inputPlusLabel {
  display:grid;
  margin-bottom:4px;
  grid-template-columns: 25% 55% 20%;

}
</style>
