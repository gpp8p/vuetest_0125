<template>
  <o-table :data="cards"
           :columns="cardColumns"
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
           @update:selected="cardSelected"
           focusable
  >
  </o-table>
</template>

<script>
import axios from "axios";

export default {
name: "insertCardSelect",
  props:{
    cmd:{
      type: String,
      required: true
    }
  },

  mounted(){
    console.log('insertCardSelect has been mounted');
    axios.get('http://localhost:8000/api/shan/cardList?XDEBUG_SESSION_START=14668', {
      params:{
        orgId: this.$store.getters.getOrgId
      }
    })
        .then(response => {
          console.log(response);
          this.cards = response.data;
        })
        .catch(e => {
          console.log(e,'test failed');
        });

  },
  methods:{
      cardSelected(msg){
        console.log(msg);
        axios.post('http://localhost:8000/api/shan/cardInsert?XDEBUG_SESSION_START=14668', {
          params:{
            cardId: msg.id,
            toLayout: this.$store.getters.getCurrentLayoutId
          }
        })
            .then(response => {
              console.log(response);
              this.$emit('cardSaved');

            })
            .catch(e => {
              console.log(e,'test failed');
            });

      }
  },
  data(){
    return {
      cards:[],
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'small',
      currentPage: 1,
      perPage: 5,
      nxtPage: 'Next Page',
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right',
      selected: '',
      cardColumns:[
        {
          field: 'id',
          label: 'ID',
          numeric: true,
          visible: false
        },
        {
          field: 'card_name',
          label: 'Card',
          width:30,
        },
        {
          field: 'card_component',
          label: 'Type',
          width: 30
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
