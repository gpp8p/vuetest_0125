<template>
  <section class="myspaceWrapper">
    <o-table :data="data"
             :columns="columns"
             :selected.sync="selected"
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
  },
  methods:{
    spaceSelected(msg){
//      debugger;
      this.$emit('spaceSelected', msg.id);
      this.$emit('layoutSelected', msg);
    }
  },
  data(){
    return {
      data:[],
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
</style>
