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
                                :cardContent="instance.card_parameters.content"
                                :cmd = "cardCmd"
                                :cmdObject="cmdObject"
                                :cmdObjectVersion="cmdObjectVersion"
                                @configSelected="configSelected"
                                @storeValue="processClick"
                                @editClick="editClick"
                                @cardClick="cardClick"
                                @textEditor="textEditor"
                                @configurationHasBeenSaved="cardSaved"
                                @cardDataLoaded="cardDataLoaded"
                                @linkHelperRequested="linkHelperRequested"
                                @ghostCard="ghostCard"
                                @registerCard = "registerCard"
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
                                :cardToEditType = "cardToEditType"
                                :cardId = "this.selectedCardId"
                                @dragStart="dragStart"
                                @moved="dialogMoved"
                                @configSelected = "configSelected"
                                @saveCardData="saveCardData"
                                @saveCardContent="saveCardContent"
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
                cardBeingResized:false,
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
                CARDBEINGRESIZEDCLICK1:9,
                CARDBEINGRESIZEDCLICK2:10,

                newCardCoords: [],
                updateCallback: null,
                cardData: '',
                selectedCardId:0,
                layoutLink:'',
                RICH_TEXT_EDITOR: false,
                cardToEditType:'',
                cmdObject:{},
                cmdObjectVersion:0,
                ghostArea:{},
                genericCardMethods:[],
                layoutHeight:0,
                layoutWidth:0,
                resizeCardId:0



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
              case 'newCardSetup':{
                this.newCardBeingAdded = true;
                this.cstatus=this.WAITINGFORCLICK;

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
            this.selectedCardId = msg[0][4];
            this.cardToEditType = msg[0][5];
            switch(this.cardToEditType){
              case 'linkMenu':{
                this.cardData = JSON.stringify(msg[0][6]);
                break;
              }
              case 'textShow':{
                this.cardData = msg[0][3];
                break;
              }
              case 'rtLink':{
                this.cardData = JSON.stringify(msg[0][6]);
                console.log('rtLink');
                break;
              }
            }
//            currentCardData:msg[0][6]
            this.RICH_TEXT_EDITOR=true;

          },
            cardSaved(msg){
//              debugger;
              this.dialogType=0;
              this.$emit('cardSaved', msg);
            },
            saveCardData(msg){
              debugger;
              this.updateCallback(msg, 'cardText', 'main');
              this.updateCallback(msg, 'saveCardContent', 'main');
              console.log('editLayout.saveCardData', msg);

//              this.cardDataFunction(msg, "saveCardContent");
            },
//          A substitute for saveCardData with greater flexability
            saveCardContent(msg){
              debugger;
              var updateContent = msg[0];
              Object.keys(updateContent).forEach(key => {
                this.updateCallback(updateContent[key], key, msg[2]);
                console.log('updating ',updateContent[key]);
              });
              this.updateCallback(msg[0], 'saveCardContent', msg[2]);
              console.log('editLayout.saveCardContent', msg);
            },
            layoutGridParameters(height, width, backgroundColor) {
                var widthFactor;
                if(width<11){
                  widthFactor = 98.5;
                }else if(width<21){
                  widthFactor = 97
                }
                var heightSize = (95 / height).toFixed(2);
                var widthSize = (widthFactor / width).toFixed(4);
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
                debugger;
                console.log('editLayout configSelected - ', msg);
                switch(msg[0]){
                    case 'cancel':{
                        debugger;
                        this.dialogType=0;
                        this.cardCurrentConfigurationValues={};
                        this.RICH_TEXT_EDITOR=false;
                        this.$emit('tabSelected', msg[0]);
//                        this.cancelLayoutEdit();
//                        this.cardCmd = 'restore';
                      this.newCardBeingAdded = false;
                      this.cardBeingResized = false;
                      this.reloadLayout(this.$route.params.layoutId);
                      this.displayStatus=false;
                      this.$emit('viewStatusChangeFunction',['editLayout', this.viewStatusChangeFunction]);
                      this.$eventHub.$emit('editStatusChanged',['openEdit',0]);

                        break;
                    }
                    case 'reload':{
                      debugger;
                      this.dialogType=0;
                      this.cardCurrentConfigurationValues={};
                      this.RICH_TEXT_EDITOR=false;
                      this.$emit('tabSelected', msg[0]);
//                      this.cancelLayoutEdit();
                      this.reloadLayout(this.$route.params.layoutId);
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
                      debugger;
/*
                      this.styleObject = {
                        top: '-800px',
                        left: '400px',
                      },
                      this.dialogType = 0;
                      this.rtCmd = 'layoutSelected:'+msg[1];
*/
                      this.cmdObject = {};
                      this.cmdObject.action = 'addLink';
                      this.cmdObject.linkedLayoutId = msg[1];
                      this.cmdObjectVersion+=1;
                      this.dialogType = 0;
//                      this.cardCmd = JSON.stringify(cmdObject);
//                      this.dialogType=0;
//                      this.cmdObject.action='addLink'
                      break;
                    }
                    case 'layoutSaved':{
/*
                      this.styleObject = {
                        top: '-800px',
                        left: '400px',
                      },
                      this.dialogType = 0;
                      this.rtCmd = 'layoutSelected:'+msg[1];
*/
                      debugger;
                      this.cmdObject = {};
                      this.cmdObject.action = 'addLink';
                      this.cmdObject.linkedLayoutId = msg[1];
                      this.cmdObjectVersion+=1;
                      this.dialogType = 0;
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
                    case 'rtLink':{
                      this.dialogCmd = 'layoutListLink';
                      this.dialogType = this.DIALOG_LAYOUT_LIST;
                      break;
                    }
                    case 'Create New Card':{
                      debugger;
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
 //             debugger;
              console.log('cardDataLoaded',msg);
              this.cardCurrentConfigurationValues = msg[1];
              this.subElementValues = msg[2];
              this.cardCmd = 'loadContent';
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
                cardCurrentConfigurationValues:msg[0][5],
              }
            },

            cardClick(msg){
              debugger;
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
                        this.layoutHeight = response.data.layout.height;
                        this.layoutWidth= response.data.layout.width;
                        this.genericCardMethods = Array.from(Array(this.layoutHeight), ()=> Array(this.layoutWidth));
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
//                debugger;

                this.layoutGrid = [];
                var newCards = [];
//      var newCardId=1;
                var newCardId = 0;
                height++;
                width++;
                for (var h = 1; h < height; h++) {
                    var gridRow = [];
                    for (var w = 1; w < width; w++) {
                        var c = this.createBlankCardInstance(h, w, 1, 1, newCardId,'#DBAA6E');
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
            ghostCard(msg){
              console.log('ghostCard', msg);
              this.fillInBlankedCard(msg[0][0], msg[0][1], msg[0][0]+msg[0][2], msg[0][1]+msg[0][3]);
              this.ghostArea.topleftY = msg[0][0];
              this.ghostArea.topleftX = msg[0][1];
              this.ghostArea.bottomRightY= msg[0][0]+msg[0][2]-1;
              this.ghostArea.bottomRightX= msg[0][1]+msg[0][3]-1;
              this.cardBeingResized=true;
              this.resizeCardId = msg[1];
              this.cstatus=this.CARDBEINGRESIZEDCLICK1;
            },

            inGhostArea(y,x){
              if(x>=this.ghostArea.topleftX && x<=this.ghostArea.bottomRightX && y>=this.ghostArea.topleftY && y<=this.ghostArea.bottomRightY){
                return true;
              }else{
                return false;
              }
            },

            adjustBlankIndex(y,x, index){
              if(JSON.stringify(this.ghostArea)==='{}') {
                return index;
              }else{
                if(this.inGhostArea(y, x)){
                  return index-1;
                }else{
                  return index;
                }
              }
            },

            fillInBlankedCard(topLeftY, topLeftX, bottomRightY, bottomRightX){
              debugger;
              var newCardId = this.cardInstances.length+1;
              for (var h = topLeftY; h < bottomRightY; h++) {
                for (var w = topLeftX; w < bottomRightX; w++){
                  var c = this.createBlankCardInstance(h, w, 1, 1, newCardId,'#DAA2E7');
                  this.cardInstances.push(c);
                  newCardId++;
                }
              }
              debugger;
            },


            createBlankCardInstance(row, col, height, width, id, background){
//      console.log('createBlankCardInstance:'+row+' '+col+' '+height+' '+width+ ' '+id);
                var thisGridCss = this.computeGridCss(row, col, height, width);
                var thisCardStyle = thisGridCss+";"+"background-color:"+background+";color:blue;";
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
                if(!this.newCardBeingAdded && !this.cardBeingResized){
                    return;
                }
                console.log('editLayout gets storeValue -' + msg);
                debugger;
                var cardThatWasClicked = this.findCard(msg[0]);
                var cardThatWasClicked1 = this.findCard1(msg);
                debugger;
                this.fillThisCell(msg[3], msg[4], '66bb6a');
/*
                var thisCardY = msg[3]-1;
                var thisCardX = msg[4]-1;
                this.genericCardMethods[thisCardY][thisCardX]();
*/
//                var thisCardKey = this.adjustBlankIndex(thisCardY, thisCardX, msg[2]);
/*
                if(JSON.stringify(this.ghostArea)==='{}') {
                  thisCardKey = msg[2];
                }else{
                  if(this.inGhostArea(thisCardY, thisCardX)){
                    var thisCardKey = msg[2]-1
                  }else{
                    thisCardKey = msg[2]
                  }
                }

 */
                console.log('cardThatWasClicked1-',cardThatWasClicked1);
                console.log('cardThatWasClicked:'+cardThatWasClicked);
                switch(this.cstatus) {
                  case this.CARDBEINGCONFIGED:
                    break;
                  case this.WAITINGFORCLICK:
                    this.topLeftClicked = msg[0];
                    this.topLeftRow = msg[3];
                    this.topLeftCol = msg[4];
                    console.log('topLeftRow-', this.topLeftRow);
                    console.log('topLeftCol-', this.topLeftCol);
//          debugger;
                    this.cstatus = this.TOPLEFTCLICKED;
                    this.$emit('LayoutMessage', ['topLeft', this.topLeftRow, this.topLeftCol]);
                    break;
                  case this.TOPLEFTCLICKED:
                    this.bottomRightClicked = msg[0];
//                      var brClickRow = this.cardInstances[thisCardKey].card_position[0];
//                        var brClickCol = this.cardInstances[thisCardKey].card_position[1];
                    var brClickRow = msg[3];
                    var brClickCol = msg[4];
                    if (this.checkClickPos(brClickRow, brClickCol, this.topLeftRow, this.topLeftCol)) {
//                            this.bottomRightRow = this.cardInstances[thisCardKey].card_position[0];
//                            this.bottomRightCol = this.cardInstances[thisCardKey].card_position[1];
                      this.bottomRightRow = msg[3];
                      this.bottomRightCol = msg[4];
//                              this.bottomRightRow = cardThatWasClicked1.card_position[0];
//                              this.bottomRightCol = cardThatWasClicked1.card_position[1];

                      this.cstatus = this.BOTTOMRIGHTCLICKED;
//                            cardIndex = cardThatWasClicked1.id;
//                              this.$refs.key[thisCardKey].$el.style.backgroundColor='#66bb6a';

//                            this.$refs.key[cardThatWasClicked].$el.style.backgroundColor='#66bb6a';
                      this.scolor = this.selectedColor;
//            this.cardInstances.forEach(this.fillInCell);
//                            debugger;

                      this.fillSelectedArea(this.genericCardMethods, this.topLeftRow, this.topLeftCol, this.bottomRightRow, this.bottomRightCol, '66BB6A');

//                            this.fillSelectedCells(this.cardInstances,this.topLeftCol,this.topLeftRow,this.bottomRightCol,this.bottomRightRow, '#66bb6a');
                      //                           this.$emit('layoutMessage', ['bottomRight', this.bottomRightRow,this.bottomRightCol ]);
                      this.dialogCmd = 'newCard';
                      this.dialogType = this.DIALOG_CREATE_CARD;
                    } else {
                      this.$emit('layoutMessage', ['error', 'You must click and to the right', 0]);
                    }
                    break;
                  case this.BOTTOMRIGHTCLICKED:
                    console.log('status is WAITINGFORNAME');
                    this.cstatus = this.WAITINGFORNAME;
                    break;
                  case this.WAITINGFORNAME:
                    this.cstatus = this.WAITINGFORTYPE;
                    break;
                  case this.CARDBEINGRESIZEDCLICK1:
                    this.topLeftClicked = msg[0];
                    this.topLeftRow = msg[3];
                    this.topLeftCol = msg[4];
                    console.log('topLeftRow-', this.topLeftRow);
                    console.log('topLeftCol-', this.topLeftCol);
//          debugger;
                    this.cstatus = this.CARDBEINGRESIZEDCLICK2;
                    this.$emit('LayoutMessage', ['topLeft', this.topLeftRow, this.topLeftCol]);

                    break;
                  case this.CARDBEINGRESIZEDCLICK2:
                    this.bottomRightClicked = msg[0];
                    brClickRow = msg[3];
                    brClickCol = msg[4];
                    if (this.checkClickPos(brClickRow, brClickCol, this.topLeftRow, this.topLeftCol)) {
                      this.bottomRightRow = msg[3];
                      this.bottomRightCol = msg[4];
                      this.scolor = this.selectedColor;
                      var newWidth = this.bottomRightCol - this.topLeftCol;
                      var newHeight = this.bottomRightRow - this.topLeftRow;
//                            debugger;
                      this.fillSelectedArea(this.genericCardMethods, this.topLeftRow, this.topLeftCol, this.bottomRightRow, this.bottomRightCol, '66BB6A');
                      axios.post('http://localhost:8000/api/shan/resizeCard?XDEBUG_SESSION_START=12016', {
                          cardId: this.resizeCardId,
                          row: this.topLeftRow,
                          col: this.topLeftCol,
                          height: newHeight+1,
                          width: newWidth+1
                      }).then(response=>
                      {
                        console.log('card resized:'+response);
                        this.newCardBeingAdded = false;
                        this.cardBeingResized = false;
                        this.reloadLayout(this.$route.params.layoutId);
                        this.displayStatus=false;
                        this.$emit('viewStatusChangeFunction',['editLayout', this.viewStatusChangeFunction]);
                        this.$eventHub.$emit('editStatusChanged',['openEdit',0]);



                      }).catch(function(error) {
                        this.$emit('layoutMessage', ['error', 'There was an error saving this card',0 ]);
                        console.log(error);
                      });

                    } else {
                      this.$emit('layoutMessage', ['error', 'You must click and to the right', 0]);
                    }
                    break;
                }

                this.$eventHub.$emit('editStatusChanged', ['newCard',this.cstatus]);

            },
            findCard(cardId){
//                debugger;
                for(var i=0;i<this.cardInstances.length;i++){
                    if(this.cardInstances[i].id == cardId){
                        return i;
                    }
                }
            },
          findCard1(msg){
 //           debugger;
            for(var i=0;i<this.cardInstances.length;i++){
              if(this.cardInstances[i].cardKey == msg[1].cardKey){
                return this.cardInstances[i];
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
//                        this.$refs.key[i].$el.style.backgroundColor=colorToFill;
                      this.$refs.key[i].$el.style.backgroundColor=colorToFill;
                    }

                }
//      console.log('done');
            },

          fillSelectedArea(cellFunctionArray,tlRow,tlCol,brRow,brCol, colorToFill){
            debugger;
            var areaTlY  =  tlRow -1;
            var areaTlX =   tlCol -1;
            var areaBrY = brRow;
            var areaBrX = brCol;
            for(var py = areaTlY; py<areaBrY; py++ ){
              for(var px = areaTlX; px < areaBrX; px++){
                console.log('filling-', py, '-', px, colorToFill);
                cellFunctionArray[py][px](colorToFill);
              }
            }
          },



          fillThisCell(thisCardY, thisCardX, backgroundColor){

            var y = thisCardY-1;
            var x = thisCardX-1;
            console.log('fillThisCell called-', y,x);
            this.genericCardMethods[y][x](backgroundColor);
          },
          fillInOneCell(arr, cellRow, cellColumn, colorToFill){
            for(var i = 0; i<arr.length; i++){
              var thisCardCol = arr[i].card_position[1];
              var thisCardRow = arr[i].card_position[0];
              if(thisCardCol==cellColumn && thisCardRow == cellRow){
//          console.log('card matched');
                this.$refs.key[i].$el.style.backgroundColor=colorToFill;
              }

            }
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
          registerCard(msg){
              var cardY = msg[1]-1;
              var cardX = msg[2]-1;
              this.genericCardMethods[cardY][cardX]=msg[0];
          }


// end of methods
        },




    }
</script>

<style scoped>
.editSpan {
  width:100%;
}


</style>
