<template>
  <section class="myspaceWrapper" >
    <span v-if="this.rowHasBeenSelected==false">
    <o-table :data="data"
             :columns="columns"
             :selected.sync="selectedRow"
             :paginated="isPaginated"
             :per-page="perPage"
             :current-page.sync="currentPage"
             :pagination-simple="isPaginationSimple"
             :pagination-position="paginationPosition"
             aria-next-label="Next page"
             aria-previous-label="Previous page"
             aria-page-label="Page"
             aria-current-label="Current page"
             @update:selected="spaceSelected"
             focusable> </o-table>
    </span>
    <span v-if="this.rowHasBeenSelected==true" class="alreadySelected">
      <span>Layout AlreadySelected</span><span>{{selectedRow.description}}</span><span><button @click="selectAgain">Select Another</button></span>
    </span>

  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "layoutList",
  props:{
    cmd:{
      type: String,
      required: true
    },
    linesPerPage:{
      type: Number,
      required: false
    },
    selectedRow:{
      type: Object,
      required: false
    }
  },
  mounted(){
    console.log('mounted runs in layoutLinks');
    console.log('orgId - according vuex:', this.$store.getters.getOrgId );
    if(typeof(this.linesPerPage)=='undefined'){
      this.perPage = 4;
    }else{
      this.perPage = this.linesPerPage;
    }
    debugger;
    if(this.isEmpty(this.selectedRow)){
      this.loadLayouts();
    }else{
      this.rowHasBeenSelected=true;
    }


  },
  methods:{
    spaceSelected(msg){
      debugger;
      console.log('selected-', msg);
      this.$emit('spaceSelected', msg);
      this.$emit('layoutSelected', msg);
    },
    isEmpty(obj){
      return JSON.stringify(obj) === '{}';
    },
    selectAgain(){
      this.rowHasBeenSelected=false;
      this.loadLayouts();
    },
    loadLayouts(){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      axios.get(apiPath+'api/shan/getMySpaces?XDEBUG_SESSION_START=15122"', {
//    axios.get('http://localhost:8000/api/shan/getMySpaces?XDEBUG_SESSION_START=15122"', {
        params:{
          orgId:this.$store.getters.getOrgId,
          userId: this.$store.getters.getLoggedInUserId,
        }
      }).then(response=> {
        console.log('getMySpaces',response);
        this.data=response.data;
      }).catch(e=>{
        console.log(e);
      });
    }
  },
  data(){
    return {
      data:[],
      rowHasBeenSelected:false,
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      perPage: 0,
      nxtPage: 'Next Page',
      selected:'',
      columns: [
        {
          field: 'id',
          label: 'ID',
          numeric: true,
          visible: false
        },
        {
          field: 'menu_label',
          label: 'Name'
        },
        {
          field: 'description',
          label: 'Description'

        }
      ],
    }
  }

}
</script>

<style scoped>
.myspaceWrapper {
  width:100%;
  color: blue;
  font-family: Geneva;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
}
.alreadySelected {
  display:grid;
  grid-template-columns: 30% 40% 30%;
}
</style>
