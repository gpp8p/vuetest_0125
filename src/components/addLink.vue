<template>
<span class="addLinkWrapper">
  <div class="extLinkArea">
    <span class="extLinkRow1">
      <span>
        <input type="radio" name="linkType" value="extSelected" @click="externalLinkClicked" />
      </span>
      <span>
        External Link - Description:
      </span>
      <span>
        <input type="text" v-model="extLinkDescription" size="100" />
      </span>
    </span>
    <span class="extLinkRow2">
      <span>

      </span>
      <span>Link Url:</span>
      <span>
        <input type="text" v-model="extLinkUrl" size="75" />
      </span>
    </span>
  </div>
  <div>
    <hr/>
  </div>
  <div class="intLinkArea">
    <span class="intLinkHeader">
      <span>
        <input type="radio" name="linkType" value="intSelected" @click="internalLinkClicked" />
      </span>
      <span>
        Internal Space:
      </span>
      <span>
      </span>
    </span>
    <span class="intLinkBody">
      <layout-list :cmd="cmd" @spaceSelected="spaceSelected"></layout-list>
    </span>
  </div>

</span>
</template>

<script>
import layoutList from "../components/layoutList.vue";
export default {
name: "addLink",
  components: {layoutList},
  data(){
    return {
      extLinkDescription:'',
      extLinkUrl:''
    }
  }
}
</script>

<style scoped>
  .addLinkWrapper {
    display:grid;
    grid-template-rows: 15% 5% 80%;
    grid-template-columns: 100%;
  }
  .extLinkArea {
    display : grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 100%;
  }
  .extLinkRow1 {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 5% 20% 75%;
  }
  .extLinkRow2 {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 5% 20% 75%;
  }
  .intLinkArea {
    display: grid;
    grid-template-rows: 15% 85%;
    grid-template-columns: 100%;
  }
  .intLinkHeader {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 5% 20% 75%;
    margin-top: 3px;
  }
  .intLinkBody {
    display:grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
  }


</style>
