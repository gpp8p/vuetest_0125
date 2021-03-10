<template>
    <span>


             <div v-bind:style="gridParamDefinition" >
                        <generic-card
                                v-for="(instance, index) in cardInstances"
                                :key="index"
                                :cardType="instance.card_component"
                                :card-style="instance.card_parameters.style"
                                :card-id="instance.id"
                                :card-key="index"
                                :card-position="instance.card_position"
                                :gridCss="gridParamDefinition"
                                :cardProperties="instance.card_parameters.properties"
                                :displayStatus="displayStatus"
                                :elementStyles="instance.elementStyles"
                                :cmd = "cardCmd"
                                @configSelected="configSelected"
                                @storeValue="processClick"
                                @editClick="editClick"
                                @cardClick="cardClick"
                                @textEditor="textEditor"
                                @configurationHasBeenSaved="cardSaved"
                                @cardDataLoaded="cardDataLoaded"
                                @linkHelperRequested="linkHelperRequested"
                                ref="key"
                        ></generic-card>


              </div>
        <Dialog v-if="this.dialogType>0"
                 :dialog-type="dialogType"
                 :key="dialogKey"
                 :currentValues=this.cardCurrentConfigurationValues
                 :subElementValues=this.subElementValues
                 :selectedCardConfigurationValues = this.selectedCardConfigurationValues
                 :dialogKey = "this.dialogKey"
                 @dragStart="dragStart"
                 @moved="dialogMoved"
                 @configSelected = "configSelected"
                 @cardSaved="cardSaved"
                 :cmd="dialogCmd"
                 v-bind:style='this.dialogStyleObject'
        ></Dialog>

              <rt-editor-dialog v-if="this.RICH_TEXT_EDITOR==true"
                                :dialog-type="dialogType"
                                :key="dialogKey"
                                :currentValues=this.cardCurrentConfigurationValues
                                :selectedCardConfigurationValues = this.selectedCardConfigurationValues
                                :dialogKey = "this.dialogKey"
                                :cardData = "cardData"
                                @dragStart="dragStart"
                                @moved="dialogMoved"
                                @configSelected = "configSelected"
                                @saveCardData="saveCardData"
                                @clearCmd="clearRtCmd"
                                :cmd="rtCmd"
                                v-bind:style='this.styleObject'
              ></rt-editor-dialog>



    </span>

</template>

<script>
    import axios from "axios";
    import genericCard from '../components/genericCard.vue';
    import Dialog from "../components/DialogV2.vue";
    import rtEditorDialog from "./rtEditorDialog.vue";

//    import simpleCkDialog from "../components/simpleCk.vue";
    export default {
        name: "editLayout",
        components:{ genericCard, Dialog, rtEditorDialog},
        props:{
          cmd:{
            type: String,
            required: false
          }
        },
        data(){
            return {
                cardInstances: [],
                gridParamDefinition: "",
                layoutGrid:[],
                selectedColor: '#66bb6a',
                unSelectedColor: 'rgb(219, 170, 110)',
                layoutConfigurationValues: {},
                LayoutPermissions:{},

                dialogType:0,
                DIALOG_CONFIGURE_GREEN_CARD:1,
                DIALOG_CONFIGURE_TEXT_CARD:2,
                DIALOG_CONFIGURE_CARD:10,
                DIALOG_CREATE_CARD:3,
                 DIALOG_LAYOUT_LIST:11,

                displayStatus:true,
                dialogKey:0,
                dragStartX:0,
                dragStartY:0,
                dialogStyleObject:{
                  top: '-400px',
                  left: '300px',

                },
                styleObject: {
                    top: '-800px',
                    left: '400px',

                },
                cardDataFunction: null,

                dialogCmd:'',
                cardCmd:'',
                rtCmd:'',

                cardCurrentConfigurationValues:{},
                selectedCardConfigurationValues:{},
                subElementValues:{},
                newCardBeingAdded:false,
                topLeftClicked: 0,
                bottomRightClicked: 0,
                cstatus: 0,
                topLeftRow:0,
                topLeftCol:0,
                bottomRightRow:0,
                bottomRightCol:0,
                WAITINGFORCLICK:0,
                TOPLEFTCLICKED:1,
                BOTTOMRIGHTCLICKED:2,
                SELECTAREAOK:3,
                WAITINGFORNAME:4,
                WAITINGFORTYPE:5,
                WAITINGFORSUBMIT:6,
                WAITINGTOSAVE:8,
                CANCELLAYOUTUPDATE:7,
                CARDBEINGCONFIGED:8,

                newCardCoords: [],
                updateCallback: null,
                cardData: '',
                selectedCardId:0,
                layoutLink:'',
                RICH_TEXT_EDITOR: false



            }
        },
        created() {
            this.$eventHub.$on('editStatusChanged', this.editStatusChanged);
        },
        beforeDestroy(){
            this.$eventHub.$off('editStatusChanged');
        },

        mounted(){
//            debugger;
            this.reloadLayout(this.$route.params.layoutId);
            this.displayStatus=false;
            this.$emit('viewStatusChangeFunction',['editLayout', this.viewStatusChangeFunction]);
            this.$eventHub.$emit('editStatusChanged',['openEdit',0]);
        },
        watch:{
          cmd: function(){
            switch(this.cmd){
              case 'cancelDialog':{
                this.RICH_TEXT_EDITOR=false;
                this.$emit('viewStatusChangeFunction', ['clearCmd'])
                break;
              }
            }
          }
        },
        methods: {
          textEditor(msg){
            console.log('editLayout.textEditor -',msg);
            debugger;
            this.updateCallback = msg[0][1];
            this.cardData = msg[0][3];
            this.selectedCardId = msg[0][4];
            this.RICH_TEXT_EDITOR=true;
          },
            cardSaved(msg){
              debugger;
              this.dialogType=0;
              this.$emit('cardSaved', msg);
            },
            saveCardData(msg){
              debugger;
              this.updateCallback(msg, 'cardText');
              this.updateCallback(msg, 'saveCardContent');
              console.log('editLayout.saveCardData', msg);

//              this.cardDataFunction(msg, "saveCardContent");
            },
            layoutGridParameters(height, width, backgroundColor) {
                var heightSize = (95 / height).toFixed(2);
                var widthSize = (98 / width).toFixed(2);
                var gridHeightCss = "grid-template-rows: ";
                var gridWidthCss = "grid-template-columns: ";
                var x = 0;
                for (x = 0; x < height; x++) {
                    gridHeightCss = gridHeightCss + heightSize + "% ";
                }
                for (x = 0; x < width; x++) {
                    gridWidthCss = gridWidthCss + widthSize + "% ";
                }
                var gridCss =
                    "display: grid; grid-gap: 3px; background-color: " + backgroundColor + "; height: 90vh; color: #ffcd90; " +
                    gridHeightCss +
                    ";" +
                    gridWidthCss +
                    ";";
                return gridCss;
            },
            viewStatusChangeFunction(args){
              console.log('editLayout recieved a view status change');
              switch(args[0]){
                case 'New Card':{
                  this.newCardBeingAdded = true;
                  this.cstatus=this.WAITINGFORCLICK;
                  break;
                }
              }
            },
            configSelected(msg){
//                debugger;
                console.log('editLayout configSelected - ', msg);
                switch(msg[0]){
                    case 'cancel':{
                        this.dialogType=0;
                        this.cardCurrentConfigurationValues={};
                      this.RICH_TEXT_EDITOR=false;
                        this.$emit('tabSelected', msg[0]);
                        this.cancelLayoutEdit();

                        break;
                    }
                    case 'Cancel Linking':{
                      this.styleObject = {
                        top: '-800px',
                        left: '400px',
                      },
                      this.dialogType = 0;
                      break;
                    }
                    case 'layoutSelected':{
                      this.styleObject = {
                        top: '-800px',
                        left: '400px',
                      },
                      this.dialogType = 0;
                      this.rtCmd = 'layoutSelected:'+msg[1];

                      break;
                    }
                    case 'layoutSaved':{
                      this.styleObject = {
                        top: '-800px',
                        left: '400px',
                      },
                      this.dialogType = 0;
                      this.rtCmd = 'layoutSelected:'+msg[1];

                      break;
                    }

                    case 'save':{
                      this.dialogType=0;
                      this.cardDataFunction("", "saveConfiguration","main");
                      break;
                    }
                    case 'layoutList':{
                      this.dialogType = this.DIALOG_LAYOUT_LIST;
                      break;
                    }
                    case 'link':{
                      console.log('configSelected - link');
                      this.styleObject = {
                        top: '-1063px',
                        left: '269px'
                      }
                      this.dialogCmd = 'layoutListLink';
                      this.dialogType = this.DIALOG_LAYOUT_LIST;
                      break;
                    }
                    case 'Create New Card':{
//                      debugger;
                      var currentLayoutId = this.$store.getters.getCurrentLayoutId;
                      console.log(msg);
                      console.log(currentLayoutId, msg[1], msg[2], this.topLeftRow, this.topLeftCol, this.bottomRightRow, this.bottomRightCol);
                      if(msg[1].length==0 | msg[2].length==0){
                        this.$emit('layoutMessage', ['error', 'You must include both a card name and a card type',0 ]);
                      }else{
                        this.$emit('layoutMessage', ['clear', '',0 ]);
                      }
                      var newCardParams = {
                        cmd:'createCard',
                        layoutId: currentLayoutId,
                        title: msg[1],
                        cardType: msg[2],
                        tlRow: this.topLeftRow,
                        tlCol:this.topLeftCol,
                        brRow:this.bottomRightRow,
                        brCol:this.bottomRightCol

                      }
                      this.dialogCmd = JSON.stringify(newCardParams);
                      console.log(currentLayoutId, msg[1], msg[2], this.topLeftRow, this.topLeftCol, this.bottomRightRow, this.bottomRightCol);
//                      this.insertCard(currentLayoutId, msg[1], msg[2], this.topLeftRow, this.topLeftCol, this.bottomRightRow, this.bottomRightCol);
                      break;

                    }
                    default:{
                      console.log('configSelected in editLayout- default-',msg);
//                      debugger;
                      var cdElement = msg[0];
                      var cData = msg[1];
                      var domElement = msg[2];
                      this.cardDataFunction(cData, cdElement, domElement);

                    }
                }
            },
            dragStart(msg){
//                debugger;
                this.dragStartX=msg[1];
                this.dragStartY=msg[0];
                console.log('dragStart-',this.dragStartX,this.dragStartY );
            },
            dialogMoved(msg){
              console.log('dragEnd',msg);
              var leftDelta = msg[1]-this.dragStartY;
              var topDelta= msg[0]-this.dragStartX;
              console.log('deltas:',topDelta, leftDelta);
              var newTop = parseInt(this.styleObject.top)+topDelta;
              var newLeft = parseInt(this.styleObject.left)+leftDelta;
              console.log('new values', newTop, newLeft);

              this.styleObject.top = newTop+'px';
              this.styleObject.left = newLeft+'px';

              console.log(topDelta, leftDelta);

  //            this.styleObject.left = msg[1].toString()+'px';
              console.log(msg);
              this.dialogKey=this.dialogKey+1;

            },
            cardDataLoaded(msg){
              console.log('cardDataLoaded',msg);
              this.cardCurrentConfigurationValues = msg[1];
              this.subElementValues = msg[2];
            },
            editClick(msg){
              debugger;
              this.cardDataFunction = msg[0][3];
              this.selectedCardConfigurationValues ={
                cardTypeBeingConfigured: msg[0][2],
                instancePositionBeingConfigured: msg[0][1],
                screenElementBeingConfigured: msg[0][4],
                cardDataFunction: msg[0][3],
                cardConfigurationElements:msg[0][4],
                cardCurrentConfigurationValues:msg[0][5]
              }
            },

            cardClick(msg){
//              debugger;
              console.log('cardClick', msg);
              switch(msg[0][2]){
/*
                  case 'greenComponent':{
//                      debugger;
                      this.cardDataFunction = msg[0][3];
//                      this.cardCurrentConfigurationValues = msg[0][5];
                      this.dialogType=this.DIALOG_CONFIGURE_GREEN_CARD;
                      this.$emit("layoutChanged");
                      break;
                  }
*/
                  default:{
                    this.cardDataFunction = msg[0][3];
                    this.selectedCardConfigurationValues ={
                      cardTypeBeingConfigured: msg[0][2],
                      instancePositionBeingConfigured: msg[0][1],
                      screenElementBeingConfigured: msg[0][4],
                      cardDataFunction: msg[0][3],
                      cardConfigurationElements:msg[0][4],
                      cardCurrentConfigurationValues:msg[0][5]
                    }
                    this.dialogType=this.DIALOG_CONFIGURE_CARD;
                    this.dialogCmd=msg[0][2];
                  }
              }
            },
            reloadLayout: function (layoutId) {
//                debugger;
                this.cardInstances = [];
                this.displayGrid = true;
//                this.layoutId = msg;

//      console.log("reloading" + msg);
//                debugger;
                axios
                    .get("http://localhost:8000/api/shan/getLayout?layoutId=XDEBUG_SESSION_START=15122", {
                        params: {
                            orgId: this.$store.getters.getOrgId,
                            userId: this.$store.getters.getLoggedInUserId,
                            layoutId: layoutId
                        }
                    })
                    .then(response => {
                        // JSON responses are automatically parsed.
//          debugger;
                        this.cardInstances = response.data.cards;
                        this.gridParamDefinition = this.layoutGridParameters(
                            response.data.layout.height,
                            response.data.layout.width,
                            response.data.layout.backgroundColor
                        );
// build a blank layout using the dimensions of the layout loaded

                        var newBlankLayout = this.makeBlankLayout(response.data.layout.height, response.data.layout.width, response.data.layout.description, response.data.layout.menu_label, response.data.layout.backgroundColor)
//          console.log(newBlankLayout);
                        var layoutGrid = newBlankLayout[3];
                        var cardsToDelete = [];

                        for (var thisCardIndex = 0; thisCardIndex < this.cardInstances.length; thisCardIndex++) {
                            var thisCard = this.cardInstances[thisCardIndex];
//                  console.log('thisCard', thisCard);
                            var cardTopLeftRow = thisCard.card_position[0] - 1;
                            var cardTopLeftColumn = thisCard.card_position[1] - 1;
                            var cardBottomRightRow = (cardTopLeftRow + thisCard.card_position[2]);
                            var cardBottomRightColumn = (cardTopLeftColumn + thisCard.card_position[3]);
//                  console.log('cardId:'+thisCard.id+' cardTopLeftRow:'+cardTopLeftRow+' cardTopLeftColumn:'+cardTopLeftColumn+' cardBottomRightRow:'+cardBottomRightRow+' cardBottomRightColumn:'+cardBottomRightColumn)
// build cardsToDelete by taking it from indexes in layoutGrid within the dimensions of the card to show
                            for (var r = cardTopLeftRow; r < cardBottomRightRow; r++) {
                                for (var c = cardTopLeftColumn; c < cardBottomRightColumn; c++) {
                                    cardsToDelete.push(layoutGrid[r][c]);
                                }
                            }
//            console.log(thisCard);
//            debugger;
                        }
//          debugger;

// set the toDelete flag in the blank cards for everything in the cardsToDelete list
                        var blankLayout = newBlankLayout[1].cards;
//          debugger;
                        for (var d = 0; d < cardsToDelete.length; d++) {
                            var indexOfCardToDelete = cardsToDelete[d];
//                            console.log(indexOfCardToDelete);
                            blankLayout[indexOfCardToDelete].toDelete = true;
                        }
// copy all the cards in blankLayout that are not to be deleted
                        var newCardInstances = [];
                        for (c = 0; c < blankLayout.length; c++) {
                            if (!blankLayout[c].toDelete) {
                                newCardInstances.push(blankLayout[c]);
                            }
                        }
// add the cards coming from the db
                        for (thisCardIndex = 0; thisCardIndex < this.cardInstances.length; thisCardIndex++) {
                            newCardInstances.push(this.cardInstances[thisCardIndex]);
                        }
// make cardInstances equal to newCardInstances
                        this.cardInstances = newCardInstances;

                    })
                    .catch(e => {
//                        debugger;
                        console.log(e);
                        this.errors.push(e);
                    });
            },


            makeBlankLayout(height, width, description, menu_label, backgroundColor) {
//      debugger;

                this.layoutGrid = [];
                var newCards = [];
//      var newCardId=1;
                var newCardId = 0;
                height++;
                width++;
                for (var h = 1; h < height; h++) {
                    var gridRow = [];
                    for (var w = 1; w < width; w++) {
                        var c = this.createBlankCardInstance(h, w, 1, 1, newCardId);
                        newCards.push(c);
                        gridRow.push(newCardId);
                        newCardId++;
                    }
                    this.layoutGrid.push(gridRow);
                }

                var newLayout = {
                    cards: newCards,
                    layout: {description: description, menu_label: menu_label, height: (height - 1), width: (width - 1)}
                };
                var newGridParameters = this.layoutGridParameters(height, width, backgroundColor);

//      this.reloadBlankLayout(newLayout);

                return ['newBlankGrid', newLayout, newGridParameters, this.layoutGrid];
            },
            createBlankCardInstance(row, col, height, width, id){
//      console.log('createBlankCardInstance:'+row+' '+col+' '+height+' '+width+ ' '+id);
                var thisGridCss = this.computeGridCss(row, col, height, width);
                var thisCardStyle = thisGridCss+";"+"background-color:#DBAA6E;color:blue;";
                var thisInstance = {card_component: 'simpleCard', card_position: [row,col,height,width], id:id, toDelete: false, card_parameters: {style: thisCardStyle}};
                return thisInstance;

            },
            computeGridCss(row, col, height, width){
//        debugger;
                var startRow = row;
                var startColumn = col;
                var endRow=0;
                var endCol=0;
                if(height==1){
                    endRow = row;
                }else{
                    endRow = row+height;
                }
                endCol=startColumn+width;
                var thisCss = "grid-area:"+startRow+"/"+startColumn+"/"+endRow+"/"+endCol;
                return thisCss;

            },
            processClick(msg) {
                if(!this.newCardBeingAdded){
                    return;
                }
                console.log('editLayout gets storeValue -' + msg);
  //              debugger;
                var cardThatWasClicked = this.findCard(msg[0]);
                console.log('cardThatWasClicked:'+cardThatWasClicked);
                switch(this.cstatus){
                    case this.CARDBEINGCONFIGED:
                        break;
                    case this.WAITINGFORCLICK:
                        this.topLeftClicked=msg[0];
                        this.topLeftRow = this.cardInstances[cardThatWasClicked].card_position[0];
                        this.topLeftCol = this.cardInstances[cardThatWasClicked].card_position[1];
//          debugger;
                        this.cstatus=this.TOPLEFTCLICKED;
                        this.$refs.key[cardThatWasClicked].$el.style.backgroundColor='#66bb6a';
                        this.$emit('LayoutMessage', ['topLeft', this.topLeftRow,this.topLeftCol ]);
                        break;
                    case this.TOPLEFTCLICKED:
                        this.bottomRightClicked = msg[0];
                        var brClickRow = this.cardInstances[cardThatWasClicked].card_position[0];
                        var brClickCol = this.cardInstances[cardThatWasClicked].card_position[1];
                        if(this.checkClickPos(brClickRow, brClickCol, this.topLeftRow, this.topLeftCol)){
                            this.bottomRightRow = this.cardInstances[cardThatWasClicked].card_position[0];
                            this.bottomRightCol = this.cardInstances[cardThatWasClicked].card_position[1];
                            this.cstatus=this.BOTTOMRIGHTCLICKED;
                            this.$refs.key[cardThatWasClicked].$el.style.backgroundColor='#66bb6a';
                            this.scolor = this.selectedColor;
//            this.cardInstances.forEach(this.fillInCell);
                            this.fillSelectedCells(this.cardInstances,this.topLeftCol,this.topLeftRow,this.bottomRightCol,this.bottomRightRow, '#66bb6a');
 //                           this.$emit('layoutMessage', ['bottomRight', this.bottomRightRow,this.bottomRightCol ]);
                            this.dialogCmd = 'newCard';
                            this.dialogType=this.DIALOG_CREATE_CARD;
                        }else{
                            this.$emit('layoutMessage', ['error', 'You must click and to the right',0 ]);
                        }
                        break;
                    case this.BOTTOMRIGHTCLICKED:
                        console.log('status is WAITINGFORNAME');
                        this.cstatus = this.WAITINGFORNAME;
                        break;
                    case this.WAITINGFORNAME:
                        this.cstatus = this.WAITINGFORTYPE;
                        break;
                }
                this.$eventHub.$emit('editStatusChanged', ['newCard',this.cstatus]);

            },
            findCard(cardId){
                for(var i=0;i<this.cardInstances.length;i++){
                    if(this.cardInstances[i].id == cardId){
                        return i;
                    }
                }
            },
            checkClickPos(brClickRow, brClickCol, tlSelectRow, tlSelectCol){
//      debugger;
                if((brClickRow<tlSelectRow)||(brClickCol<tlSelectCol)){
                    return false;
                }else{
                    return true;
                }


            },
            fillSelectedCells(arr,tlCol,tlRow,brCol,brRow, colorToFill){
                var topLeftCol = tlCol;
                var topLeftRow = tlRow;
                var bottomRightCol = brCol;
                var bottomRightRow = brRow;
                for(var i = 0; i<arr.length; i++){
                    var thisCardCol = arr[i].card_position[1];
                    var thisCardRow = arr[i].card_position[0];
//        console.log('thisCardCol:'+thisCardCol+'topLeftCol:'+topLeftCol+'thisCardRow:'+thisCardRow+'topLeftRow:'+topLeftRow);
//        console.log('thisCardCol:'+thisCardCol+'bottomRightCol:'+bottomRightCol+'thisCardRow:'+thisCardRow+'bottomRightRow:'+bottomRightRow);
//        console.log(arr[i].id);
//        console.log('-----------------------------')
                    if(thisCardCol >= topLeftCol && thisCardRow >= topLeftRow && thisCardCol <= bottomRightCol && thisCardRow <= bottomRightRow){
//          console.log('card matched');
                        this.$refs.key[i].$el.style.backgroundColor=colorToFill;
                    }

                }
//      console.log('done');
            },
            editStatusChanged(msg){
                console.log('editStatusChange',msg);
                switch(msg[0]){
                    case 'newCard':
                        switch(msg[1]){
                            case this.WAITINGFORCLICK:
                                this.newCardBeingAdded = true;
                                this.cstatus=this.WAITINGFORCLICK;
                                break;
                        }
                    break;
                    case 'openEdit':
                      this.cancelLayoutEdit();
                      break;
                }
            },
/*
            dialogMenuSelected(msg){
               switch(msg[0]){
                   case 'Cancel':
                       debugger;
                       if(this.newCardBeingAdded){
                           this.cancelLayoutEdit();
                       }
                       this.newCardBeingAdded=false;
                       this.openDialog=false;
                       this.$refs.conf.closeDialog();
                       break;
                   case 'Create New Card':
                        var currentLayoutId = this.$store.getters.getCurrentLayoutId;
                        console.log(currentLayoutId, msg[2], msg[1], this.topLeftRow, this.topLeftCol, this.bottomRightRow, this.bottomRightCol);
//                        debugger;
//                        this.insertCard(currentLayoutId, msg[2], msg[1], this.topLeftRow, this.topLeftCol, this.bottomRightRow, this.bottomRightCol);
                       break;
               }
            },
 */
            insertCard(layoutId, title, cardType, tlrow, tlcol, brrow, brcol){
//                debugger;
                axios.post('http://localhost:8000/saveCardOnly?XDEBUG_SESSION_START=12016', {
                    layoutId: layoutId,
                    cardTitle: title,
                    cardType: cardType,
                    topLeftRow: tlrow,
                    topLeftCol: tlcol,
                    bottomRightRow: brrow,
                    bottomRightCol: brcol
                }).then(response=>
                {
                    console.log('card saved:'+response);
                    this.$router.push({
                        name: 'displayLayout',
                        params: { layoutId: this.$store.getters.getCurrentLayoutId }
                    })
                }).catch(function(error) {
                    this.$emit('layoutMessage', ['error', 'There was an error saving this card',0 ]);
                    console.log(error);
                });
            },
            clearRtCmd(){
              this.rtCmd = '';
            },
            cancelLayoutEdit(){
//      console.log('noButton clicked');
                this.cstatus = this.WAITINGFORCLICK;
                this.scolor = this.unSelectedColor;
//      debugger;
                if(this.bottomRightCol==0 && this.bottomRightRow==0){
                    this.fillInOneCell(this.cardInstances, this.topLeftRow, this.topLeftCol, this.unSelectedColor);
                }else{
                    this.fillSelectedCells(this.cardInstances,this.topLeftCol,this.topLeftRow,this.bottomRightCol,this.bottomRightRow, this.unSelectedColor);
                }

            },


// end of methods
        },




    }
</script>

<style scoped>



</style>
