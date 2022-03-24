<template>
  <span>
    <span v-if="selectedMenuOption=='Create New Card'" >
      <span class="labelPlusInput">
        <span>Card Name:</span>
        <input v-model="cardName" size="40" maxlen="80"/>
      </span>
      <span>
        <select-picker :pType="cardPtypeReference" :dialogKey="this.dKey" :label="cardTypeLabel" :options="cardTypeOptions" :currentValues="currentValues" @configSelected="configSelected"></select-picker>
      </span>
      <span class="labelPlusInput">
        <span>Restricted:</span>
        <input v-model="restricted" type="checkbox"/>
      </span>

    </span>
  </span>
</template>

<script>
  import SelectPicker from "@/components/selectPicker";
  import axios from "axios";
  export default {
    name: "newCardCreate",
    components: {SelectPicker},
    data() {
      return {
        checkbox: false,
        checkboxCustom: 'Yes',
        isClicked: false,
        menuOptions: ['Create New Card', 'Cancel' ],
        openMenuOption:'Create New Card',
        cardName:'',
        cardType:'',
        restricted: false,
        rval:' ',
        cardTypeLabel: 'Card Type:',
        cardPtypeReference: 'cardType',
        cardTypeOptions: ['RichText', 'linkMenu','loginLink','youTube','pdf', 'Search', 'Headline'],
        dKey:0,
        newCardParams:{}
      }
    },
    mounted(){
      this.$emit("componentSettingsMounted",[this.menuOptions,this.openMenuOption])
    },
    props:{
      selectedMenuOption: {
        type: String,
        required: true
      },
      currentValues:{
        type: Object,
        required:true
      },
      dialogKey:{
        type: Number,
        required:true
      },
      cmd: {
        type: String,
        required: false
      }
    },
    watch:{
      selectedMenuOption: function(){
        console.log('newCardCreate selectedMenuOption watcher triggered');
      },
      cmd: function(){
        console.log('newCardCreate cmd changed - ', this.cmd);
        this.newCardParams = JSON.parse(this.cmd);
        console.log(this.newCardParams);
        switch(this.newCardParams.cmd){
          case 'createCard':{
            debugger;
            this.insertCard(this.newCardParams.layoutId,
                            this.newCardParams.title,
                            this.newCardParams.restricted,
                            this.newCardParams.cardType,
                            this.newCardParams.tlRow,
                            this.newCardParams.tlCol,
                            this.newCardParams.brRow,
                            this.newCardParams.brCol);
            break;
          }
        }

      }
    },
    methods:{
      configSelected(msg){
        console.log(msg);
          this.cardType=msg[1];
//        this.$emit('configSelected', msg);
      },
      getCardTitle(){
        return this.cardName;
      },
      getCardType(){
        return this.cardType;
      },
      getCardRestriction(){
        if(this.restricted){
          return 'T';
        }else{
          return 'F';
        }
      },
      insertCard(layoutId, title, restricted, cardType, tlrow, tlcol, brrow, brcol){
                debugger;
        var apiPath = this.$store.getters.getApiBase;
        console.log('apiPath - ',apiPath);
        axios.post(apiPath+'api/shan/saveCardOnly?XDEBUG_SESSION_START=12016', {
//        axios.post('http://localhost:8000/api/shan/saveCardOnly?XDEBUG_SESSION_START=12016', {
          layoutId: layoutId,
          cardTitle: title,
          restricted: restricted,
          cardType: cardType,
          topLeftRow: tlrow,
          topLeftCol: tlcol,
          bottomRightRow: brrow,
          bottomRightCol: brcol
        }).then(response=>
        {
          console.log('card saved:',response);
//          debugger;
//          this.$emit('cardSaved', [this.newCardParams.layoutId]);
/*
          this.$router.push({
            name: 'displayLayout',
            params: { layoutId: this.$store.getters.getCurrentLayoutId }
          })
*/
          this.$emit('cardSaved', [this.newCardParams.layoutId]);
        }).catch(function(error) {
          this.$emit('layoutMessage', ['error', 'There was an error saving this card',0 ]);
          console.log(error);
        });
      },
    }


  }
</script>

<style scoped>

  .settings{
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;

  }
  .inp{
    display: grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 100%;
  }
  .labelPlusInput {
    display:grid;
    margin-top: 3px;
    grid-template-columns: 20% 70%;
    font-family: Arial;
    font-size: medium;
    color: #0a3aff;
  }

</style>
