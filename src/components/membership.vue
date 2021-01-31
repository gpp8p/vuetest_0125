<template>
  <span>
   <o-table :data="members"
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
export default {
  name: "membership",
  props:{
    members :{
      type: Array,
      required: true
    },
    membershipType :{
      type: String,
      required:true
    }
  },
  methods:{
    memberSelected(msg){
      console.log(msg);
      if(this.membershipType=='groups'){
        this.$emit('memberSelected',['groupMemberSelected',msg]);
      }else if(this.membershipType=='org'){
        this.$emit('memberSelected',['orgMemberSelected',msg]);
      }

    }
  },
  data(){
    return {
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
          field: 'name',
          label: 'Name'
        },
        {
          field: 'email',
          label: 'Email'

        }
      ]
    }
  }
}
</script>

<style scoped>
span {
  font-family: Arial;
  font-size: smaller;
  --oruga-table-color: green;
  --oruga-table-background-color: #ab97ff;
  --oruga-table-background: #ab97ff;
  --oruga-table-detail-background: #ab97ff;


}




</style>

