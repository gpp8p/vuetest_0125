<template>
<span>
    <section class="groupsTable">
    <o-table :data="groups"
             :columns="columns"
             :selected.sync="selected"
             :paginated="isPaginated"
             :per-page="perPage"
             :current-page.sync="currentPage"
             :pagination-simple="isPaginationSimple"
             :pagination-position="paginationPosition"
             :tableClass="linkTable"
             aria-next-label="Next page"
             aria-previous-label="Previous page"
             aria-page-label="Page"
             aria-current-label="Current page"
             @update:selected="groupSelected"
             focusable> </o-table>
    </section>

</span>
</template>

<script>
export default {
name: "groupList",
  props:{
    groups :{
      type: Array,
      required: true
    },
    cmd: {
      type: String,
      required: false
    },
  },
  watch:{
    cmd: function() {
      console.log('linkMenu cmd changed-', this.cmd);
      switch(this.cmd){
        case 'clear':{
          this.selected=null;
          this.$emit('clearCmd');
          break;
        }
      }
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
          field: 'group_label',
          label: 'Name'
        },
        {
          field: 'description',
          label: 'Description'
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

    }
  }
}
</script>

<style scoped>
section {
  --oruga-table-background-color: #ab97ff;
  --oruga-table-background: #ab97ff;
}

.groupsTable{
  width: 100%;
  color: blue;
  font-family: Geneva;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
}
</style>
