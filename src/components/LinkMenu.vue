<template>
  <div >
    <div class="cardStyle" v-if="this.displayStatus==false">
      <div class="cardHeader" v-if="displayStatus==false">
        <span class="textLeft">
          <a href="#" v-on:click="configureClicked" >Configure</a>
        </span>
        <span class="textRight">
          <a href="#"  v-on:click="editClicked" >Edit</a>
        </span>
      </div>
      <div class="cardBody"  v-html="this.cardData">
      </div>
    </div>
  </div>
</template>

<script>
import CardBase from "../components/CardBase.vue";
export default {
name: "LinkMenu",
  extends: CardBase,
  props:{
    displayStatus:{
      type: Boolean,
      required: false
    },
  },
  methods:{
    configureClicked() {
//      debugger;
      this.styling={};
      this.loadCardConfiguration(this.cardId);
      this.dialog=true;
      this.testProp=true;
      this.tdialogMsg='message recieved'
//      debugger;

      this.$emit("cardClick", [
        "cardClicked",
        this.cardKey,
        "linkMenu",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues,
      ]);



    },
    editClicked(){
      this.editStatus = true;
      this.$emit("editClick", [
        "cardClicked",
        this.cardKey,
        "linkMenu",
        this.setCardData,
        this.cardConfiguration,
        this.configurationCurrentValues,
      ]);
    },
  }

}
</script>

<style scoped>
.cardStyle {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.cardHeader {
  height: 10%;
  background-color: #fff722;
  color: blue;
  font-family: Geneva;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
.cardBody {
  height: 90%;
  margin:10px;
}
.textLeft {
  margin-left: 5px;
}

.textRight {
  margin-left: 70%;
}

.textCenter {
  text-align: center;
}

textarea {
  width: 100%;
  height: 70%;
  border: 3px solid #cccccc;
  padding: 5px;
  font-family: Tahoma, sans-serif;
}

</style>
