<template>
  <span>
       <o-table :data="orgs"
                :columns="orgColumns"
                :selected.sync="selected"
                :paginated="isPaginated"
                :per-page="perPage"
                :current-page.sync="currentPage"
                :pagination-simple="isPaginationSimple"
                :pagination-position="paginationPosition"
                :icon-prev="prevIcon"
                :icon-next="nextIcon"
                aria-next-label="Next page"
                aria-previous-label="Previous page"
                aria-page-label="Page"
                aria-current-label="Current page"
                @update:selected="orgSelected"
                focusable
       >
       </o-table>
    </span>
</template>


<script>
import axios from "axios";

export default {
name: "orgList",
  data(){
    return {
      ORG_LIST:0,
      ORG_MEMBERS:1,
      orgView:0,
      orgs:[],
      orgUsers:[],
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      currentOrgUserPage: 1,
      perPage: 4,
      nxtPage: 'Next Page',
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      selected: '',
      selectedUser:'',
      orgColumns: [
        {
          field: 'org_label',
          label: 'Name',
          width: '20',
        },
        {
          field: 'description',
          label: 'Description',
          width: '40'
        },
        {
          field: 'top_layout_id',
          label: 'Home Space',
          width: '10',
          numeric: true,
          visible: false
        }
      ]
    }
  },
  props:{
    cmd:{
      type: String,
      required: false
    }
  },
  watch:{
    cmd: function(){
      console.log('orgList cmd changed - ', this.cmd);
    }
  },
  mounted(){
    this.orgView = this.ORG_LIST;
    this.getOrgs();
  },
  methods:{
    getOrgs(){
      axios.get('http://localhost:8000/api/shan/orgList?XDEBUG_SESSION_START=14668', {
      })
          .then(response => {
// eslint-disable-next-line no-debugger
            // JSON responses are automatically parsed.
//            debugger;
            console.log(response);
            this.orgs=response.data;
            this.$emit('componentSettingsMounted',[['Done', 'Add New Organization'],'Done']);
            this.$emit('setTitle','Click on Organization to See Members');

          })
          .catch(e => {
            this.errors.push(e);
            console.log('orgMembers failed');
          });
    },
    orgSelected(msg){
      console.log(msg.id);
      this.$emit('orgSelected', msg.id);
    },
  }
}
</script>

<style scoped>
span {
  font-family: Arial;
  font-size: medium;
  --oruga-table-color: green;
  --oruga-table-background-color: #ab97ff;
  --oruga-table-background: #ab97ff;
  --oruga-table-detail-background: #ab97ff;
  --oruga-pagination-link-current-background-color: green;
  --oruga-pagination-link-current-color:white;

}
</style>
