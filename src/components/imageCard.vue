<template>
  <span class="carWrapper" >
    <div class="cardHeader" v-if="this.showOptions==true">
      <menu-opt :mOpts="currentMenuOpts" @menuOptSelected="menuOptSelected"></menu-opt>
    </div>
    <div class="center">
      {{this.cardContent.imageTitle}}
    </div>
  </span>
</template>

<script>
import CardBase from "@/components/CardBase";
import menuOpt from "../components/menuOptV2.vue";
import axios from "axios";

export default {
  name: "imageCard",
  extends: CardBase,
  components :{menuOpt},
  mounted(){
    this.$emit('childCmd', this.childCmd);
    if(this.displayStatus==true){
      this.showOptions=false;
    }else{
      this.showOptions=true;
    }
    var mOpts = this.getMenuOpts('imageEntry');
    this.currentMenuOpts = mOpts.currentMenuOpts;
//    console.log('image card mounted');
    this.cardLinkUrl = '';
    console.log('cardContent imageCard-', this.cardContent);

  },
  props:{
    displayStatus: {
      type: Boolean,
      required: true
    },
    cardId: {
      type: String,
      required: true
    },
    cardContent:{
      type: Object,
      required:true
    },
    cmdObject:{
      type:Object,
      required: false
    },
    cmdObjectVersion:{
      type: Number,
      required:false
    }
  },
  watch :{
    cmdObjectVersion: function(){
//      debugger;
      console.log('wach triggered -  cmdObjectVersion -',this.cmdObject.action);
      switch(this.cmdObject.action){
        case 'addLink':{
 //         var mOpts = this.getMenuOpts('insertLink');
 //         this.currentMenuOpts = mOpts.currentMenuOpts;
          if(this.cmdObject.imageCardId == this.cardId){
            debugger;
            this.layoutLink = this.cmdObject.linkedLayoutId;
            this.setCardData(this.layoutLink, 'imageLink', 'main');
            this.setCardData(this.cmdObject.imageLinkDescription, 'imageLinkDescription', 'main')
          }

          break;
        }
        case 'saveImageEdit':{
          debugger;
          if(this.cmdObject.imageCardId == this.cardId){
            debugger;
            console.log('cmdObjectVersion changed in image card -saveImageEdit', this.cmdObjectVersion);
            console.log('content-', this.content);
            console.log('cardContent-', this.cardContent);
            console.log('cmdObject-',this.cmdObject);
            debugger;
            this.cardContent.imageTitle = this.cmdObject.imageTitle;
            this.content.imageTitle = this.cardContent.imageTitle;
//            this.content.imageTitle = this.cmdObject.imageTitle;
            this.content.cardType = "imageCard";
            this.content.layoutLink = this.cmdObject.layoutLink;
            this.content.imageLink = this.cmdObject.imageLink;
            var linkReference = 'Link from:'+this.content.imageTitle;
            console.log('saving imageCard-', this.content);
            this.setCardData(this.content, 'saveCardContent', 'main');
            this.$emit('configSelected', ['save']);
            this.saveLayoutLink(this.layoutLink, linkReference);
          }
          break;
        }
      }
    },
  },
  data(){
    return {
      mode:0,
      configurationCurrentValues:{},
      showOptions:false,
      currentMenuOpts:[],
      fileRole:'imageCardImage',
      cardTitle:'',
      styling: {},
      layoutLink:0,
      content:{},
      subContentStyling:{
        sub:{}
      },
      imagePresent: false,
      imgKey:0,
      cardLinkUrl:''
    }
  },
  computed: {
    getImageUrl: function() {
      return this.content.imageUrl;
    }
  },
  methods:{
    imageHasBeenClicked(){
      console.log('image has been clicked in imageLink has been run');
      if(this.showOptions!=true){
        debugger;
        this.$emit('linkSelected', this.cardContent.imageLink);
      }

    },
/*
    childCmd(parentCommand){
      console.log('parentCommand = ', parentCommand);
      debugger;
      switch(parentCommand){
        case 'test':{
          console.log('child cmd in imageCard');
        }
      }
    },

 */
    editClicked(){
      debugger;
      this.loadCardConfiguration(this.cardId);
      this.$emit('textEditor', [this.cardKey, this.setCardData,this.configurationCurrentValues, this.cardData, this.cardId, 'imageCard', this.cardContent, this.cardId]);
    },
    linkSelected(msg){
      console.log('link selected', msg);
      debugger;
      this.$emit('linkSelected', msg);
    },
    imageClicked(){
      console.log('image has been clicked');
    },
    menuOptSelected(msg){
      console.log('menuOptSelected in imageCard -', msg);
      switch(msg){
        case 'Resize':{
          console.log('moveClicked');
          this.$emit('ghostCard');
          break;
        }
        case 'Configure':{
          this.configureClicked('imageCard');
          break;
        }
        case 'DeleteCard':{
          var mOpts = this.getMenuOpts('deleteChoice');
          this.currentMenuOpts = mOpts.currentMenuOpts;
          break;
        }
        case 'RmvLay':{
          this.removeCardFromLayout(this.cardId);
          break;
        }
        case 'DelCardFromDb':{
          this.deleteCardFromDb(this.cardId);
          break;
        }
        case 'Cancel':{
          this.$emit('configSelected',['cancel']);
          break;
        }
        case 'editImage':{
          this.editClicked();
          break;
        }
        case 'linkImage':{
          this.$emit('configSelected',['rtLink']);
          break;
        }
      }
    },
    saveLayoutLink(targetId, linkDescription){
      debugger;
      var urlBase = this.$store.getters.getUrlBase;
      var targetUrl = urlBase+targetId;
      var apiPath = this.$store.getters.getApiBase;
      console.log('apiPath - ',apiPath);
      axios.post(apiPath+'api/shan/addUpdateLink?XDEBUG_SESSION_START=17516', {
        org_id: this.$store.getters.getOrgId,
        layout_id: this.$store.getters.getCurrentLayoutId,
        card_instance_id:this.cardId,
        is_external:0,
        layout_link_to:targetId,
        description: linkDescription,
        linkUrl:targetUrl,
        type:'U',
        cardType:'imageCard'
      }).then(response=>
      {
        debugger;
        console.log('response imageCard saved', response);
        if(response.data=='ok'){
          debugger;
          console.log('link added',this.content);


        }
      }).catch(function(error) {
        console.log(error);
      });

    }



  }
}
</script>

<style scoped>
.imageOnly{
  max-width: 100%;
  max-height:100%;
}
.cardHeader {
  display: flex;
  justify-content: space-evenly;
  width:100%;
  align-items: baseline;
  color: blue;
  height: 10%;
  background-color: #fff722;
  font-family: Geneva;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
.center {
  display:grid;
  grid-template-columns: 100%;
  grid-template-rows: auto auto;
}
.cardWrapper {
  height: 100%;
  width:100%;
}


</style>
