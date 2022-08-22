<template>
  <span>
   <o-table :data="approvedReg"
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
            @update:selected="memberSelected"
            focusable> </o-table>
  </span>
</template>

<script>
import axios from "axios";

export default {
name: "registerRestrictShow",
  props:{
    org:{
      type: Number,
      required: true
    },
    cmd:{
      type: String,
      required: false
    },
    cmdVersion:{
      type: Number,
      required: true
    }
  },
  mounted(){
    this.getAllowedRegistrants();
  },
  methods:{
    getAllowedRegistrants(){
      var orgToUse;
      if(this.org===null){
        orgToUse = this.$store.getters.getOrgId;
      }else{
        orgToUse = this.org;
      }
      debugger;
      var apiPath = this.$store.getters.getApiBase;
      axios.get(apiPath+'api/shan/getAllowedRegistrants?XDEBUG_SESSION_START=14668', {
        params: {
          orgId: orgToUse
        }
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
            debugger;
            this.approvedReg = response.data;
            console.log(response);
          })
          .catch(e => {
            this.errors.push(e);
            console.log('getRestrictedRegistrants failed');
          });
    }
  },
  data(){
    return {
      approvedReg:[],
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      perPage: 5,
      nxtPage: 'Next Page',
      selected:'',
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '5',
          visible: false
        },
        {
          field: 'email',
          label: 'Email'
        },
        {
          field: 'name',
          label: 'Name'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
