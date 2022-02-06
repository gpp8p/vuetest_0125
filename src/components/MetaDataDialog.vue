<template>
    <span class="selectDefaults">
      <span class="labelPlusInput">
        <span>{{this.inputFieldLabel}}</span><input type="text" v-model="cardName" size="40" maxlen="80" />
      </span>
      <span>
        <date-field field :pType="dateTypeReference" :dialogKey="this.dKey" :label="dateLabel" :currentValues="this.cardContent" :backgroundColor = "metaBackgrouond" @configSelected="configSelected"></date-field>
      </span>
      <span>
        <select-picker :pType="documentTypeReference" :dialogKey="this.dKey" :label="documentTypeLabel" :options="documentTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></select-picker>
      </span>
      <span>
        <select-picker :pType="accessTypeReference" :dialogKey="this.dKey" :label="accessTypeLabel" :options="accessTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></select-picker>
      </span>
      <span>
        <text-area-field :pType="keywordTypeReference" :dialogKey="this.dKey" :label="keywordLabelLabel" :currentValues="this.cardContent" :backgroundColor = "metaBackgrouond" @configSelected="configSelected"></text-area-field>
      </span>
      <span>
        <input-checkbox :pType="indexTypeReference" :dialogKey="this.dKey" :label="indexLabel" :options="accessTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></input-checkbox>
      </span>
      <span class="submitButton">
          <o-button @click="done">Done</o-button>
      </span>
    </span>
</template>

<script>
//mport textField from "@/components/textField";
import inputCheckbox from "@/components/inputCheckbox"
import textAreaField from "@/components/textAreaField"
import dateField from "@/components/dateField"


import selectPicker from "@/components/selectPicker";
import CardBase from "@/components/CardBase";
export default {
name: "MetaDataDialog",
  components: {selectPicker, inputCheckbox, textAreaField, dateField},
  extends: CardBase,
  mounted(){
    this.loadOptions();
    if(typeof(this.cardContent['documentType'])!=='undefined'){
      this.documentType= this.cardContent['documentType'];
    }
    if(typeof(this.cardContent['indexFile'])!=='undefined'){
      if(this.cardContent['indexFile']==1){
        this.indexFile=true;
      }else{
        this.indexFile=false;
      }
    }
    if(typeof(this.cardContent['accessType'])!=='undefined'){
      this.accessType= this.cardContent['accessType'];
    }
    if(typeof(this.cardContent.card_name)!='undefined'){
      this.cardName = this.cardContent.card_name;
    }
    console.log('metaDataDialog mounted');
  },
  props:{
    cardContent:{
      type: Object,
      required: true
    },
    cmdObject:{
      type: Object,
      required: false
    },
    cmdObjectVersion:{
      type: Number,
      required: false
    }
  },
  methods:{
    configSelected(msg) {
      console.log('configSelected', msg);
      switch (msg[0]) {
        case 'documentType': {
          this.documentType = msg[1];
          break;
        }
        case 'accessType': {
          this.accessType = msg[1];
          break;
        }
        case 'keyWords':{
          this.keyWords = msg[1];
          break;
        }
        case 'checkbox': {
          if (msg[1] == 'activated') {
            this.indexFile = 1;
          } else {
            this.indexFile = 0;
          }
          break;
        }
        case 'createDate':{
          this.createDate = msg[1];
          break;
        }
      }
      console.log(msg);
    },
    done(){
      var metaDataEntered={};
      metaDataEntered['done']=true;
      metaDataEntered['documentType']= this.documentType;
      metaDataEntered['accessType']=this.accessType;
      metaDataEntered['indexFile']=this.indexFile;
      metaDataEntered['keyWords']=this.keyWords;
      metaDataEntered['createDate']=this.createDate;
      metaDataEntered['cardName']=this.cardName;
      this.$emit('metaDataEntered', metaDataEntered);
    }

  },
  data(){
    return {
      documentType:'',
      currentValues:{},
      inputFieldLabel: 'Card Name:',
      inputFieldReference: 'card_name',
      documentTypeReference:'documentType',
      keywordTypeReference: 'keyWords',
      documentTypeLabel: 'Document Type:',
      keywordLabelLabel: 'Key Words:',
      keyWords:'',
      dateLabel:'Created On:',
      dateTypeReference:'createDate',
      createDate:'',

      documentTypeOptions:[],
      accessTypeReference:'accessType',
      accessTypeLabel:'Access:',
      AccessTypeOptions:[],
      accessType:'',
      indexLabel:'Index Document ?',
      indexTypeReference:'indexFile',
      indexFile:false,
      cardNameStyling: 'font-family:Geneva;font-size:12px;font-style:normal;font-weight:bold;',
      metaBackgrouond: '#DBAA6E',
      cardName:''

    }
  }
}
</script>

<style scoped>
.selectDefaults{
  display:grid;
  grid-template-rows: 20% 20% 20% 20%;
  margin-left: 60px;
  margin-top: 30px;
}
.submitButton {
  margin-left: 60%;
}

.labelPlusInput {
  display:grid;
  grid-template-columns: 20% 80%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}

</style>
