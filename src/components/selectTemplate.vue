<template>
  <section>
    <o-table :data="availableTemplates"
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
             @update:selected="templateSelected"
             focusable> </o-table>
  </section>


</template>

<script>
import axios from "axios";

export default {
name: "selectTemplate",
  mounted(){
//    debugger;
    var apiPath = this.$store.getters.getApiBase;
    console.log('apiPath - ',apiPath);
    axios.get(apiPath+'api/shan/availableTemplates?XDEBUG_SESSION_START=15122"', {
//    axios.get('http://localhost:8000/api/shan/availableTemplates?XDEBUG_SESSION_START=15122"', {
      params:{
        orgId:this.$store.getters.getOrgId,
      }
    }).then(response=> {
      console.log('getAvailableTemplates',response);
      this.availableTemplates=response.data;
    }).catch(e=>{
      console.log(e);
    });
  },
  props:{
    cmd:{
      type: String,
      required: true
    },
  },
  data(){
    return {
      columns: [
        {
          field: 'id',
          label: 'ID',
          numeric: true,
          visible: false
        },
        {
          field: 'description',
          label: 'Template'
        }
      ],
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      perPage: 6,
      nxtPage: 'Next Page',
      selected:'',
      availableTemplates:[]
    }
  },
  methods:{
    templateSelected(msg){
      console.log(msg);
      this.$emit('templateSelected', msg);
    }
  }
}
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css";
section {
  --oruga-table-background-color: #ab97ff;
  --oruga-table-background: #ab97ff;
  width: 100%;
  color: blue;
  font-family: Geneva;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
}


</style>
