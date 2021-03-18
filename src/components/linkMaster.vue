<template>
  <span class="linkMasterWrapper">
    <span class="labelPlusInput">
      <span>
        Title:
      </span>
      <span class="titleField">
        <input v-model="linkMenuTitle" size="65"/>
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
import axios from "axios";

export default {
name: "linkMaster",
  props:{
    cardId:{
      type: Number,
      required: true
    }
  },
  mounted(){
    this.getLinksForCard(this.cardId);
  },
  data(){
    return {
      linkMenuTitle:'',
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
    }
  },
  methods:{
    getLinksForCard(cardId){
      axios.get('http://localhost:8000/api/shan/getLinks?XDEBUG_SESSION_START=15122"', {
        params:{
          cardId:cardId,
        }
      }).then(response=> {
        console.log('getMySpaces',response);
        this.linkData=response.data;
      }).catch(e=>{
        console.log(e);
      });
    }
  }
}
</script>

<style scoped>
  .linkMasterWrapper {
    display:grid;
    grid-template-rows: 10% 90%;
  }
  .labelPlusInput {
    display:grid;
    margin-top: 3px;
    grid-template-columns: 10% 90%;
    font-family: Arial;
    font-size: medium;
    color: #0a3aff;
  }
  .titleField {
    margin-right: 70%;
  }

</style>
