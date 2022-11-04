<template>
  <span>
    <span v-if="selectedMenuOption=='Appearence'">
      <card-appearence-set :currentValues="currentValues" :domElement="mainDomElement" :dialogKey="dialogKey" @configSelected="configSelected"></card-appearence-set>
    </span>
    <span v-if="selectedMenuOption=='Text'">
      <text-set :currentValues="currentValues" :domElement="mainDomElement" :dialogKey="dialogKey" @configSelected="configSelected"></text-set>
    </span>
    <span v-if="selectedMenuOption=='SubText'">
      <LinkMenuConfiguration :currentValues="subElementValues" :domElement="subDomElement" :dialogKey="dialogKey" @configSelected="configSelected"></LinkMenuConfiguration>
    </span>
    <span>
      <layout-list v-if="selectedMenuOption=='imageCardLink'" :cmd="cmd" :selectedRow="selectedLayoutRow" @spaceSelected="spaceSelected"></layout-list>
    </span>
    <span>
      <image-card-headline v-if="selectedMenuOption=='imageCardHeadline'" :currentValues="currentValues" :domElement="mainDomElement" :dialogKey="dialogKey" @configSelected="configSelected"></image-card-headline>
    </span>
  </span>
</template>

<script>
import CardAppearenceSet from "@/components/CardAppearenceSet";
import TextSet from "@/components/TextSet";
import LinkMenuConfiguration from "@/components/LinkMenuConfiguration.vue"
import imageCardHeadline from "./imageCardHeadline";
import layoutList from "../components/layoutList.vue";
  export default {
    name: "cardConfigurationSettings",
    components: {CardAppearenceSet, TextSet, LinkMenuConfiguration, imageCardHeadline, layoutList},
    data() {
      return {
        checkbox: false,
        checkboxCustom: 'Yes',
        isClicked: false,
        mainDomElement: 'main',
        subDomElement: 'sub',
        selectedLayoutRow:{}
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
      },
      subElementValues:{
        type: Object,
        required: false
      },
    },

    watch:{
      selectedMenuOption: function(){
        this.openMenuOption = this.selectedMenuOption;
      },
      cmd: function(){
        console.log('cmd changes in component settings:', this.cmd);
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
        console.log('configSelected in cardConfigurationSettings', msg);
        this.$emit('configSelected', msg);
      },
      spaceSelected(msg){
        debugger;
        console.log('imageLinkSelected', msg);
        this.selectedLayoutRow = msg;
        this.$emit('configSelected', ['imageLinkSelected', msg]);
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
