<template>
<span class="addLinkWrapper">
    <hr/>
    <span class="linkRow">
      <span>
        <o-radio v-model="linkChoice" name="linkType" @input="linkChoiceMade" native-value="extSelected">External Link</o-radio>
      </span>
      <span>
        Url:
      </span>
      <span>
        <input type="text" v-model="extLinkDescription" size="70" />
      </span>
    </span>
    <span class="linkRow">
      <span>
        <o-radio v-model="linkChoice" name="linkType" @input="linkChoiceMade" native-value="intSelected">Internal Link</o-radio>
      </span>
      <span>
      </span>
      <span>
      </span>
    </span>
    <span v-if="this.mode==this.SHOW_INTERNAL_LINKS" class=".linkTable">
      <layout-list :cmd="this.layoutListCmd" @layoutSelected="layoutSelected" :linesPerPage="6" ></layout-list>
    </span>
</span>
</template>

<script>
import layoutList from "../components/layoutList.vue";
export default {
name: "linkMenuAdd",
  components:{layoutList},
  data(){
    return {
      linkChoice:'',
      mode:0,
      LINK_CHOICE:0,
      SHOW_INTERNAL_LINKS:1,
      layoutListCmd:''
    }
  },
  methods:{
    linkChoiceMade(msg){
      console.log(msg);
      switch(msg){
        case 'intSelected':{
          this.$emit('internalLinkOption');
          this.mode=this.SHOW_INTERNAL_LINKS;
          break;
        }
        case 'extSelected':{
          this.$emit('externalLinkOption');
          this.mode=this.LINK_CHOICE;
          break;
        }
      }
    },
    layoutSelected(msg){
      console.log('layoutSelected - ', msg);
      this.$emit('layoutSelected', msg);
    }
  }
}
</script>

<style scoped>
.addLinkWrapper {
  display:grid;
  grid-template-rows: 15% 15% 70%;
  grid-template-columns: 100%;
}
.extLinkArea {
  display : grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 100%;
}
.linkRow {
  margin-left: 10px;
  display: grid;
  grid-template-columns: 20% 10% 50%;
  font-family: Arial;
  font-size: medium;
  color: #0a3aff;
}
section {
  --oruga-table-background-color: #81e7cb;
  --oruga-table-background: #81e7cb;
}

.linkTable{
  width: 100%;
  color: blue;
  font-family: Geneva;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
  background-color: #81e7cb;
}

</style>
