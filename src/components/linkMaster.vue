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
        <o-radio v-model="currentCardData.orient" name="orientation" native-value="vertical">Vertical</o-radio>
        <o-radio v-model="currentCardData.orient" name="orientation" native-value="horozontal">Horozontal</o-radio>
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
             :iconPack="mdi"
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
    if(typeof this.currentCardData.orient != 'undefined'){
      this.$emit('orientSelected');
    }else{
      this.currentCardData.orient = 'vertical';
    }

  },


  data(){
    return {
      linkMenuTitle:'',
      linkContent:{},
      currentCardData:{},
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
  },
  watch:{
    cmd: function(){
      console.log('linkMaster cmd changed-', this.cmd);
      debugger;

      var cmdElements = this.cmd.split(':');
      debugger;
      console.log('linkMaster cmd changed - ',cmdElements);
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      switch(cmdElements[0]){
        case 'save':{
          debugger;
          if(typeof this.currentCardData.orient === 'undefined'){
            alert('You must select an orientation and save!');
          }else{
            console.log('this.currentCardData=',this.currentCardData);

            console.log(jsonCardConfigurationPackage);
            var cardConfigurationPackage = [this.cardId, this.currentCardData];
            var domElement = 'main';
            var jsonCardConfigurationPackage = JSON.stringify(cardConfigurationPackage);


            axios.post(apiPath+'api/shan/saveCardContent?XDEBUG_SESSION_START=14252', {
//              axios.post('http://localhost:8000/api/shan/saveCardContent?XDEBUG_SESSION_START=14252', {
              cardParams: jsonCardConfigurationPackage,
              domElement: domElement,
              org: this.$store.getters.getOrgId,
              layoutId: this.$store.getters.getCurrentLayoutId
            }).then(response=>
            {
              console.log(response);
//              alert('card saved');
              this.$emit('configurationHasBeenSaved')
            }).catch(function(error) {
              console.log(error);
            });

          }

            debugger;
//            this.$emit('saveCardContent', [this.currentCardData, 'linkContent', 'main'] );


          break;
        }
        case 'delete':{
          console.log('cmd - delete', cmdElements[1]);
          this.deleteThisLink(cmdElements[1]);
//          this.$emit('clearCmd');
          break;
        }
      }
    }
  },
  methods:{
    getLinksForCard(cardId){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      axios.get(apiPath+'api/shan/getLinks?XDEBUG_SESSION_START=15122"', {
//            axios.get('http://localhost:8000/api/shan/getLinks?XDEBUG_SESSION_START=15122"', {
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
    orientClicked(){
      this.$emit('orientSelected');
    },
    cardSave(){
      this.$emit('saveCardContent', [this.currentCardData, 'linkContent', 'main'] );
    },
    deleteThisLink(linkId){
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);


      axios.get(apiPath+'api/shan/deleteLink?XDEBUG_SESSION_START=15122"', {
//            axios.get('http://localhost:8000/api/shan/deleteLink?XDEBUG_SESSION_START=15122"', {
        params:{
          linkId:linkId,
        }
      }).then(response=> {
        console.log('deleteLink',response);
        this.$emit('linkDeleted');
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
