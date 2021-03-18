<template>
  <span class="linkMasterWrapper">
    <span class="labelPlusInput">
      <span>
        Title:
      </span>
      <span>
        <input v-model="linMenuTitle" size="45"/>
      </span>
    </span>
    <span>
    <o-table :data="linkData"
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
             @update:selected="linkSelected"
             focusable> </o-table>
    </span>

  </span>
</template>

<script>
export default {
name: "linkMaster",
  data(){
    return {
      linkMenuTitle:''
    }
  }
}
</script>

<style scoped>
  .linkMasterWrapper {
    display:grid;
    grid-template-rows: 25% 75%;
  }
  .labelPlusInput {
    display:grid;
    margin-top: 3px;
    grid-template-columns: 30% 70%;
    font-family: Arial;
    font-size: medium;
    color: #0a3aff;
  }

</style>
