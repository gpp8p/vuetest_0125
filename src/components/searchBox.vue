<template>
  <section class="searchBox">
    <span class="inputPlusLabel">
      <span  class="labelStyle"><o-button @click="submitSearch" :size="small">Search</o-button></span>
      <span>
        <input class="inputStyle" type="text" :maxlength="128" size="this.inputSize" v-model="fieldContent" />
      </span>
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
  margin-left: 25%;
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


.labelStyle{
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
  margin-top: 5px;
}
.inputPlusLabel {
  display:grid;
  margin-top: 3px;
  grid-template-columns: 20% 80%;

}
</style>
