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
    orgId:{
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
    var apiPath = this.$store.getters.getApiBase;
    axios.get(apiPath+'api/shan/getRestrictedRegistrants?XDEBUG_SESSION_START=14668', {
//          axios.get('http://localhost:8000/api/shan/removeUserFromOrg?XDEBUG_SESSION_START=14668', {
      params: {
        orgId: this.orgId
      }
    })
        .then(response => {
// eslint-disable-next-line no-debugger
          // JSON responses are automatically parsed.
          debugger;
          if(response.data=="ok"){
            this.approvedReg = response.data;
          }
          console.log(response);
        })
        .catch(e => {
          this.errors.push(e);
          console.log('getRestrictedRegistrants failed');
        });

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
