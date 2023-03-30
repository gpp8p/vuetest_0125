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
    },
    cmd: {
      type: String,
      required: false
    },
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
      perPage: 5,
      nxtPage: 'Next Page',
      selected:'',
      orient:''
    }
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
  methods:{
    linkSelected(msg){
      console.log(msg);
      this.$emit('linkSelected', msg);
    }
  }

}
</script>

<style scoped>

section {
  --oruga-table-background-color: #ab97ff;
  --oruga-table-background: #ab97ff;
}

.linkTable{
  width: 100%;
  color: blue;
  font-family: Geneva;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
  background-color: #ab97ff;
}

</style>
