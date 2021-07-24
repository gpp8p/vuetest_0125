<template>
  <span class="linkMasterWrapper">
    <span class="labelPlusInput">
      <span>
        Title:
      </span>
      <span class="titleField">
        <input v-model="currentCardData.linkMenuTitle" size="55"/>
      </span>
      <span>
        Orientation:
        <input type="radio" name="orientation" value="vertical" v-model="currentCardData.orient" />-Vertical
        <input type="radio" name="orientation" value="horozontal" v-model="currentCardData.orient" />-Horizontal
      </span>
    </span>
    <span>
    <o-table :data="currentCardData.availableLinks"
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
    },
    cmd:{
      type: String,
      required: true
    },
    cardData:{
      type: String,
      required: true
    }
  },
  mounted(){
//    this.getLinksForCard(this.cardId);
    this.currentCardData= JSON.parse(this.cardData);

  },


  data(){
    return {
      linkMenuTitle:'',
      linkContent:{},
      currentCardData:'',
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
      orient:'vertical'
    }
  },
  watch:{
    cmd: function(){
      console.log('linkMaster cmd changed-', this.cmd);
      debugger;

      var cmdElements = this.cmd.split(':');
      debugger;
      console.log('linkMaster cmd changed - ',cmdElements);
      switch(cmdElements[0]){
        case 'save':{
          this.$emit('saveCardContent', [this.currentCardData, 'linkContent', 'main'] );
          break;
        }
        case 'delete':{
          console.log('cmd - delete', cmdElements[1]);
          this.$emit('clearCmd');
          break;
        }
      }
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
    },
    linkSelected(msg){
      console.log('selected=', msg);
      this.$emit('linkSelected',[msg.id]);
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
    width:100%;
    display:grid;
    margin-top: 3px;
    grid-template-columns: 10% 50% 40%;
    font-family: Arial;
    font-size: medium;
    color: #0a3aff;
  }
  .titleField {
    margin-right: 70%;
  }

</style>
