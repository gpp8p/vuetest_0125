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
name: "MySpaces",
  mounted(){
    console.log('mounted runs in layoutLinks');
    console.log('orgId - according vuex:', this.$store.getters.getOrgId );
//    debugger;
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
      console.log(msg.id);
      this.$emit('layoutSelected',msg['id']);
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
      perPage: 15,
      nxtPage: 'Next Page',
      selected:'',
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '10',
          numeric: true
        },
        {
          field: 'menu_label',
          label: 'Name'
        },
        {
          field: 'description',
          label: 'Description'

        },

        {
          field: 'height',
          label: 'Height'
        },
        {
          field: 'width',
          label: 'Width'
        }
      ],
    }
  }
}
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css";
.myspaceWrapper {
  font-family: Arial;
  width: 100%;
}

</style>
