<template>
    <section class="linkTable">
    <o-table :data="currentCardData.availableLinks"
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
             @update:selected="linkSelected"
             focusable> </o-table>
    </section>
</template>

<script>
export default {
name: "linkMenuList",
  mounted(){
    this.linkData = this.currentCardData.availableLinks;
  },
  props:{
    currentCardData: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      linkData:[],
      columns: [
        {
          field: 'id',
          label: 'ID',
          numeric: true,
          visible: false
        },
        {
          field: 'description',
          label: 'Link To'
        },
        {
          field: 'isExternal',
          label: 'External ?',
          numeric: true,
        },
        {
          field:  'link_url',
          label:  'Target'
        },
        {
          field: 'layout_link_to',
          label: '',
          numeric: true,
          visible: false
        }

      ],
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      perPage: 8,
      nxtPage: 'Next Page',
      selected:'',
      orient:''
    }
  }
}
</script>

<style scoped>

section {
  --oruga-table-background-color: #81e7cb;
  --oruga-table-background: #81e7cb;
}

.linkTable{
  width: 100%;
  color: blue;
  font-family: Geneva;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
  background-color: #81e7cb;
}

</style>
