<template>
<span class="addLinkWrapper">
    <hr/>
    <span class="linkRow">
      <span>
        <o-radio v-model="linkChoice" name="linkType" @input="linkChoiceMade" native-value="extSelected">External Link</o-radio>
      </span>
      <span v-if="this.mode==this.SHOW_EXTERNAL_LINK">
        Menu Label:
      </span>
      <span v-if="this.mode==this.SHOW_EXTERNAL_LINK">
        <input type="text" v-model="extLinkMenuLabel" size="30" />
      </span>
      <span v-if="this.mode==this.SHOW_EXTERNAL_LINK">
        Url:
      </span>
      <span v-if="this.mode==this.SHOW_EXTERNAL_LINK">
        <input type="text" v-model="extLinkDescription" size="50" />
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
      SHOW_EXTERNAL_LINK:2,
      layoutListCmd:'',
      extLinkDescription:'',
      extLinkMenuLabel:''
    }
  },
  props:{
    cmd:{
      type: String,
      required: false
    }
  },
  watch:{
    cmd: function(){
      console.log('createLayout cmd changed - ', this.cmd);
      switch(this.cmd){
        case 'addExtToMenu':{
          var newLink = {};
          newLink.description = this.extLinkDescription;
          newLink.isExternal = 1;
          newLink.id=-1;
          newLink.menu_label=this.extLinkMenuLabel;
          console.log('newLink-', newLink);
          this.$emit('newExtLink', newLink);
          break;
        }
      }
    },
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
          this.mode=this.SHOW_EXTERNAL_LINK;
          break;
        }
      }
    },
    layoutSelected(msg){
      console.log('layoutSelected - ', msg);
      var newLink = {};
      newLink.description = msg.description;
      newLink.height = msg.height;
      newLink.isExternal = 0;
      newLink.id=-1;
      newLink.layout_link_to = msg.id;
      newLink.menu_label=msg.menu_label;
      newLink.width=msg.width;
      console.log('newLink-', newLink);
      this.$emit('layoutSelected', newLink);
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
  grid-template-columns: 10% 10% 30% 5% 5% 30%;
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
