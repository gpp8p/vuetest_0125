<template>
    <span class="selectDefaults">
      <span>
        <text-field :p-type="inputFieldReference" :dialogKey="this.dKey" :label="inputFieldLabel" :currentValues="this.cardContent" :textStyle="this.cardNameStyling"></text-field>
      </span>
      <span>
        <select-picker :pType="documentTypeReference" :dialogKey="this.dKey" :label="documentTypeLabel" :options="documentTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></select-picker>
      </span>
      <span>
        <select-picker :pType="accessTypeReference" :dialogKey="this.dKey" :label="accessTypeLabel" :options="accessTypeOptions" :currentValues="this.cardContent" @configSelected="configSelected"></select-picker>
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
import textField from "@/components/textField";
import inputCheckbox from "@/components/inputCheckbox"


import selectPicker from "@/components/selectPicker";
import CardBase from "@/components/CardBase";
export default {
name: "MetaDataDialog",
  components: {selectPicker, inputCheckbox, textField},
  extends: CardBase,
  mounted(){
    this.loadOptions();
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
        case 'checkbox': {
          if (msg[1] == 'activated') {
            this.indexFile = 1;
          } else {
            this.indexFile = 0;
          }

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
      this.$emit('currentContent', metaDataEntered);
    }

  },
  data(){
    return {
      documentType:'',
      currentValues:{},
      inputFieldLabel: 'Card Name:',
      inputFieldReference: 'card_name',
      documentTypeReference:'documentType',
      documentTypeLabel: 'Document Type:',
      documentTypeOptions:[],
      accessTypeReference:'accessType',
      accessTypeLabel:'Access:',
      AccessTypeOptions:[],
      accessType:'',
      indexLabel:'Index Document ?',
      indexTypeReference:'indexFile',
      indexFile:false,
      cardNameStyling: 'font-family:Geneva;font-size:12px;font-style:normal;font-weight:bold;',

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

</style>
