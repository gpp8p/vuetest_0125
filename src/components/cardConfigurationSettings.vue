<template>
  <span class="settings">
    <span v-if="selectedMenuOption=='Appearence'">
      <card-appearence-set :currentValues="currentValues" :dialogKey="dialogKey" @configSelected="configSelected"></card-appearence-set>
    </span>
    <span v-if="selectedMenuOption=='Text'">
      <text-set :currentValues="currentValues" :dialogKey="dialogKey" @configSelected="configSelected"></text-set>
    </span>
  </span>
</template>

<script>
import CardAppearenceSet from "@/components/CardAppearenceSet";
import TextSet from "@/components/TextSet";
  export default {
    name: "cardConfigurationSettings",
    components: {CardAppearenceSet, TextSet},
    data() {
      return {
        checkbox: false,
        checkboxCustom: 'Yes',
        isClicked: false,
//        menuOptions: ['Appearence', 'Text', 'Save', 'Cancel' ],
//        openMenuOption:'Appearence'
      }
    },
    mounted(){
      console.log('cardConfigurationSettings mounted',this.currentValues);
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
      cmd:{
        type: String,
        required: false
      },
      menuOptions:{
        type: Array,
        required: true
      },
      openMenuOption:{
        type: String,
        required: true
      },
      selectedCardConfigurationValues:{
        type: Object,
        required: true
      }
    },
    watch:{
      selectedMenuOption: function(){
        this.openMenuOption = this.selectedMenuOption;
      },
      cmd: function(){
        console.log('cmd changes in green component settings:', this.cmd);
        switch(this.cmd){
          case 'Save':{
            this.$emit('configSelected',['save']);
          }
        }
      }
    },
    methods:{
      cbClicked(msg){
        console.log('basic checkbox clicked', msg);
      },
      configSelected(msg){
        this.$emit('configSelected', msg);
      }
    }


  }
</script>

<style scoped>

  .settings{
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;

  }

</style>
