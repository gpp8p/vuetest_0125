<script>
  /* eslint-disable no-debugger,no-console,no-undef */
  import axios from "axios";
  export default {
    name: "CardBase",
    methods: {
      setCardData(cardData, cardDataElement, domElement) {
      debugger;
      console.log('Card Base setCardData -','cardData:',cardData,'cardDataElement:', cardDataElement,'domElement - ',domElement);
      if(domElement=='main'){
        switch (cardDataElement) {
          case "saveConfiguration":
            debugger;
            this.saveCardConfiguration();
            break;
          case "saveCardContent":
            this.saveCardContent(cardData, domElement);
            break;
          case "loadConfiguration":
            this.loadCardConfiguration(cardData);
            break;
          case "title":
            this.cardTitle = cardData;
            this.configurationCurrentValues['title']=cardData;
            this.content.title = "title:"+cardData;
            delete this.styling.title;
            break;
          case "cardText":
            this.cardData=cardData;
            this.content.cardText = "cardText:"+cardData;
            break;
          case "backgroundType":
            this.configurationCurrentValues['backgroundType']="checked";
            this.styling.backgroundType="backgroundType:checked;";
            break;
          case 'backgroundTypeColor':
            this.configurationCurrentValues['backgroundTypeColor']="checked";
            this.styling.backgroundTypeImage="backgroundTypeColor:checked;"
            delete this.styling.backgroundTypeImage;
            break;

          case "backgroundColor":
//            this.$el.style.backgroundColor=cardData;
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            this.configurationCurrentValues['backgroundColor']=cardData;
            this.styling.backgroundColor="background-color:"+cardData+";";
            break
          case "backgroundImage":
            debugger;
            var backGroundImageReference = "url(http://localhost:8000/storage/"+cardData+")";
//            var backGroundImageReference = "url('" + cardData + "')";
//            this.$el.style.backgroundImage = backGroundImageReference;
            this.configurationCurrentValues['backgroundImage']=backGroundImageReference;
            this.styling.backgroundImage = "background-image:"+ backGroundImageReference+";";
//            this.$el.style.backgroundSize="100% 100%";
            this.configurationCurrentValues['backgroundSize']="100% 100%";
            this.styling.backgroundSize="background-size:100% 100%;";
            this.$emit('cardPropertySet',[backGroundImageReference, cardDataElement]);
            break;
          case 'backgroundTypeImage':
            this.configurationCurrentValues['backgroundTypeImage']="checked";
            this.styling.backgroundTypeImage="backgroundTypeImage:checked;"
            delete this.styling.backgroundTypeColor;
            break;
          case "fontFamily":
//            this.$el.style.fontFamily=cardData;
            this.configurationCurrentValues['fontFamily']=cardData;
            this.styling.fontFamily = "font-family:"+cardData+";";
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "fontSize":
//            this.$el.style.fontSize=cardData;
            this.configurationCurrentValues['fontSize']=cardData;
            this.styling.fontSize= "font-size:"+cardData+";";
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "fontWeight":
//            this.$el.style.fontWeight=cardData;
            this.configurationCurrentValues['fontWeight']=cardData;
            this.styling.fontWeight= "font-weight:"+cardData+";";
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "fontStyle":
//            this.$el.style.fontStyle=cardData;
            this.configurationCurrentValues['fontStyle']=cardData;
            this.styling.fontStyle= "font-style:"+cardData+";";
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "color":
//            this.$el.style.color=cardData;
            this.configurationCurrentValues['color']=cardData;
            this.styling.color= "color:"+cardData+";";
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "textAlign":
//            this.$el.style.textAlign=cardData;
            this.configurationCurrentValues['textAlign']=cardData;
            this.styling.textAlign= "text-align:"+cardData+";";
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "roundIncluded":
            if(cardData=="activated") {
              this.configurationCurrentValues['roundIncluded'] = "checked";
//              this.$el.style.borderRadius = "8px";
              this.styling.borderRadius = "border-radius:8px;";
              this.styling.roundIncluded = "roundIncluded:checked;";
            }else{
              this.configurationCurrentValues['roundIncluded'] = "";
//              this.$el.style.borderRadius = "";
              delete this.styling.borderRadius;
              delete this.styling.roundIncluded;
            }
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "shadow":
            if(cardData=="activated"){
              this.configurationCurrentValues['shadow']="checked";
//              this.$el.style.boxShadow="10px 20px 30px black";
              this.configurationCurrentValues['shadowSize']="default"
              this.styling.boxShadow = "box-shadow:10px 20px 30px black;";
              this.styling.shadow="shadow:checked;";
            }else{
//              this.$el.style.boxShadow="";
              delete this.styling.boxShadow;
              delete this.styling.shadow;
              this.configurationCurrentValues['shadowSize']="";
              this.configurationCurrentValues['shadow']="";
            }
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "border":
            if(cardData=='activated'){
              this.configurationCurrentValues['borderInclude']="checked";
              this.styling.borderInclude="borderInclude:checked;";
              this.configurationCurrentValues['borderColor']='#0000FF';
              this.configurationCurrentValues['border']="border:thin solid #0000FF";
//              this.$el.style.border="thin solid #0000FF";
              this.styling.border="border:thin solid #0000FF;";
            }else{
              this.configurationCurrentValues['borderSize']='';
              this.configurationCurrentValues['borderColor']='#0000FF';
              this.configurationCurrentValues['borderInclude']="";
              this.configurationCurrentValues['border']="";
//              this.$el.style.border=null;
//              this.$el.style.borderWidth=null;
//              this.$el.style.borderColor=null;
              delete this.styling.border;
              delete this.styling.borderSize;
              delete this.styling.borderColor;
              delete this.styling.borderInclude;
            }
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "borderSize":
            this.configurationCurrentValues['borderSize']=cardData;
            this.styling.borderSize="border-width:"+cardData+";";

            this.styling.border = "border:"+cardData+" solid "+this.configurationCurrentValues['borderColor']+";";
            var borderSet = cardData+" solid "+this.configurationCurrentValues['borderColor'];
//            this.$el.style.borderWidth = cardData;
            this.$emit('cardPropertySet',[borderSet, 'borderSize']);
            break;
          case "borderColor":
            this.configurationCurrentValues['borderColor']=cardData;
            var borderColorSet = this.configurationCurrentValues['borderSize']+" solid "+this.configurationCurrentValues['borderColor'];
//            this.$el.style.borderColor = cardData;
            this.styling.borderColor="border-color:"+cardData+";";
            this.styling.border = "border:"+borderColorSet+";";
            this.$emit('cardPropertySet',[borderColorSet, 'borderColor']);
            break;
          default:{
            this.content[cardDataElement]=cardData;
          }
        }
      }else {
        console.log('sub element - ', this.subContentConfiguration[domElement]);
//        debugger;
        if (typeof this.subContentConfiguration[domElement] === 'undefined') {
          this.subContentConfiguration[domElement]=Object.create( null );
          this.subContentStyling[domElement]=Object.create( null );
        }
        switch (cardDataElement) {
            /*
          case "saveConfiguration":
            debugger;
            this.saveCardConfiguration();
            break;
          case "saveCardContent":
            this.saveCardContent(cardData);
            break;


          case "loadConfiguration":
            this.loadCardConfiguration(cardData);
            break;

          case "title":
            this.cardTitle = cardData;
            this.configurationValues[domElement]['title']=cardData;
            this.content.title = "title:"+cardData;
            delete this.styling.title;
            break;

          case "cardText":
            this.cardData = cardData;
            this.content.cardText = "cardText:" + cardData;
            break;

          case "backgroundType":
            this.configurationValues[domElement]['backgroundType']="checked";
            this.styling.backgroundType="backgroundType:checked;";
            break;
          case 'backgroundTypeColor':
            this.configurationValues[domElement]['backgroundTypeColor']="checked";
            this.styling.backgroundTypeImage="backgroundTypeColor:checked;"
            delete this.styling.backgroundTypeImage;
            break;

          case "backgroundColor":
//            this.$el.style.backgroundColor=cardData;
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            this.configurationValues[domElement]['backgroundColor']=cardData;
            this.styling.backgroundColor="background-color:"+cardData+";";
            break
          case "backgroundImage":
            debugger;
            var backGroundImageReference = "url(http://localhost:8000/storage/"+cardData+")";
//            var backGroundImageReference = "url('" + cardData + "')";
//            this.$el.style.backgroundImage = backGroundImageReference;
            this.configurationValues[domElement]['backgroundImage']=backGroundImageReference;
            this.styling.backgroundImage = "background-image:"+ backGroundImageReference+";";
//            this.$el.style.backgroundSize="100% 100%";
            this.configurationValues[domElement]['backgroundSize']="100% 100%";
            this.styling.backgroundSize="background-size:100% 100%;";
            this.$emit('cardPropertySet',[backGroundImageReference, cardDataElement]);
            break;
          case 'backgroundTypeImage':
            this.configurationValues[domElement]['backgroundTypeImage']="checked";
            this.styling.backgroundTypeImage="backgroundTypeImage:checked;"
            delete this.styling.backgroundTypeColor;
            break;

 */
          case "fontFamily":
//            this.$el.style.fontFamily=cardData;
            this.subContentConfiguration[domElement]['fontFamily'] = cardData;
            this.subContentStyling[domElement].fontFamily = "font-family:" + cardData + ";";
            this.$emit('cardSubPropertySet', [cardData, cardDataElement]);
            break;
          case "fontSize":
//            this.$el.style.fontSize=cardData;
            this.subContentConfiguration[domElement]['fontSize'] = cardData;
            this.subContentStyling[domElement].fontSize = "font-size:" + cardData + ";";
            this.$emit('cardSubPropertySet', [cardData, cardDataElement, domElement]);
            break;
          case "fontWeight":
//            this.$el.style.fontWeight=cardData;
            this.subContentConfiguration[domElement]['fontWeight'] = cardData;
            this.subContentStyling[domElement].fontWeight = "font-weight:" + cardData + ";";
            this.$emit('cardSubPropertySet', [cardData, cardDataElement, domElement]);
            break;
          case "fontStyle":
//            this.$el.style.fontStyle=cardData;
            this.subContentConfiguration[domElement]['fontStyle'] = cardData;
            this.subContentStyling[domElement].fontStyle = "font-style:" + cardData + ";";
            this.$emit('cardSubPropertySet', [cardData, cardDataElement, domElement]);
            break;
          case "color":
//            this.$el.style.color=cardData;
            this.subContentConfiguration[domElement]['color'] = cardData;
            this.subContentStyling[domElement].color = "color:" + cardData + ";";
            this.$emit('cardSubPropertySet', [cardData, cardDataElement, domElement]);
            break;
          case "textAlign":
//            this.$el.style.textAlign=cardData;
            this.subContentConfiguration[domElement]['textAlign'] = cardData;
            this.subContentStyling[domElement].textAlign = "text-align:" + cardData + ";";
            this.$emit('cardSubPropertySet', [cardData, cardDataElement, domElement]);
            break;
          case "optionDirection":
            this.subContentConfiguration[domElement]['optionDirection'] = cardData;
            this.subContentStyling[domElement].optionDirection  = "option-direction:" + cardData + ";";
            this.$emit('cardSubPropertySet', [cardData, cardDataElement, domElement]);
            break;
            /*
          case "roundIncluded":
            if(cardData=="activated") {
              this.configurationValues[domElement]['roundIncluded'] = "checked";
//              this.$el.style.borderRadius = "8px";
              this.styling.borderRadius = "border-radius:8px;";
              this.styling.roundIncluded = "roundIncluded:checked;";
            }else{
              this.configurationValues[domElement]['roundIncluded'] = "";
//              this.$el.style.borderRadius = "";
              delete this.styling.borderRadius;
              delete this.styling.roundIncluded;
            }
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "shadow":
            if(cardData=="activated"){
              this.configurationValues[domElement]['shadow']="checked";
//              this.$el.style.boxShadow="10px 20px 30px black";
              this.configurationValues[domElement]['shadowSize']="default"
              this.styling.boxShadow = "box-shadow:10px 20px 30px black;";
              this.styling.shadow="shadow:checked;";
            }else{
//              this.$el.style.boxShadow="";
              delete this.styling.boxShadow;
              delete this.styling.shadow;
              this.configurationValues[domElement]['shadowSize']="";
              this.configurationValues[domElement]['shadow']="";
            }
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "border":
            if(cardData=='activated'){
              this.configurationValues[domElement]['borderInclude']="checked";
              this.styling.borderInclude="borderInclude:checked;";
              this.configurationValues[domElement]['borderColor']='#0000FF';
              this.configurationValues[domElement]['border']="border:thin solid #0000FF";
//              this.$el.style.border="thin solid #0000FF";
              this.styling.border="border:thin solid #0000FF;";
            }else{
              this.configurationValues[domElement]['borderSize']='';
              this.configurationValues[domElement]['borderColor']='#0000FF';
              this.configurationValues[domElement]['borderInclude']="";
              this.configurationValues[domElement]['border']="";
//              this.$el.style.border=null;
//              this.$el.style.borderWidth=null;
//              this.$el.style.borderColor=null;
              delete this.styling.border;
              delete this.styling.borderSize;
              delete this.styling.borderColor;
              delete this.styling.borderInclude;
            }
            this.$emit('cardPropertySet',[cardData, cardDataElement]);
            break;
          case "borderSize":
            this.configurationValues[domElement]['borderSize']=cardData;
            this.styling.borderSize="border-width:"+cardData+";";

            this.styling.border = "border:"+cardData+" solid "+this.configurationValues[domElement]['borderColor']+";";
            var borderSet = cardData+" solid "+this.configurationValues[domElement]['borderColor'];
//            this.$el.style.borderWidth = cardData;
            this.$emit('cardPropertySet',[borderSet, 'borderSize']);
            break;
          case "borderColor":
            this.configurationValues[domElement]['borderColor']=cardData;
            var borderColorSet = this.configurationValues[domElement]['borderSize']+" solid "+this.configurationValues[domElement]['borderColor'];
//            this.$el.style.borderColor = cardData;
            this.styling.borderColor="border-color:"+cardData+";";
            this.styling.border = "border:"+borderColorSet+";";
            this.$emit('cardPropertySet',[borderColorSet, 'borderColor']);
            break;
        }

 */
        }
        this.subStyleChange++;
      }

        return this.cardKey;
      },




      reloadCardData(cStyle){
//        console.log(cStyle);
        var cssPropertyArray = cStyle.split(';');
        for(var p=0;p<cssPropertyArray.length;p++){
          switch(cssPropertyArray[p]){
            case "background-color":
              break;
          }
        }
      },
      loadCardConfiguration(cardId){
 //       debugger;
        axios
          .get("http://localhost:8000/api/shan/getCardDataById?cardId=" + cardId+"&&XDEBUG_SESSION_START=15122")
          .then(response => {
            // JSON responses are automatically parsed.
//          debugger;
            console.log('CardBase lodCardConfiguration returns response:', response);
            this.cardConfigParams = response.data[0];
            this.cardContent = response.data[1];
            this.cardSubConfig =response.data[2];

            this.configurationCurrentValues={};
            var cardConfigurationDelimiterAt;
            var configValue;
            for(var c=0;c<this.cardConfigParams.length;c++){
              var thisCarConfigurationKey = this.cardConfigParams[c][0];
              var thisCardConfigurationValue= this.cardConfigParams[c][1];
              this.styling[thisCarConfigurationKey]=thisCardConfigurationValue;
              cardConfigurationDelimiterAt = thisCardConfigurationValue.indexOf(':');
              configValue = thisCardConfigurationValue.substr(cardConfigurationDelimiterAt+1);
              configValue = configValue.replace(';', '');
              this.configurationCurrentValues[thisCarConfigurationKey]= configValue;
            }
            console.log('domElement response-',response.data[2]);
            var domElementKeys = Object.keys(response.data[2]);
            var thisDomElement = response.data[2];
            var thisCardContent= response.data[3];
            console.log(domElementKeys);
            var subElements = {};
            var subStyles = {};
            for(var k = 0;k<domElementKeys.length;k++){
              console.log(thisDomElement[domElementKeys[k]]);
              var subElementDom = thisDomElement[domElementKeys[k]];
              subElements[domElementKeys[k]]={}
              subStyles[domElementKeys[k]]={}
              console.log('subElementDom - ',subElementDom);

              for(var s = 0;s<subElementDom.length;s++){
                var thisRawElement = subElementDom[s];
                var thisRawElementCss = thisRawElement[1].split(':');
//                subElements[thisRawElement[0]]= thisRawElementCss[1];
                var rawElementValue = thisRawElementCss[1].replace(';','');
                subElements[domElementKeys[k]][thisRawElement[0]] = rawElementValue;
                subStyles[domElementKeys[k]][thisRawElement[0]] = thisRawElement[1];
              }
            }
            console.log('subElements - ',subElements);
            this.subContentConfiguration = subElements;
            this.subContentStyling = subStyles;
            this.content={};
//            debugger;
            console.log('cardContent - ',this.cardContent);
            for( c=0;c<this.cardContent.length;c++){
              var thisCarContentKey = this.cardContent[c][0];
              var thisCardContentValue= this.cardContent[c][1];
              this.content[thisCarContentKey]=thisCardContentValue;
              this.configurationCurrentValues[thisCarContentKey]= thisCardContentValue;
            }
//            debugger;
//            this.$emit('cardDataLoaded',[this.styling, this.configurationCurrentValues, response.data[2]]);
            this.$emit('cardDataLoaded',[this.styling, this.configurationCurrentValues, subElements, thisCardContent]);


//            debugger;
          })
          .catch(e => {
            console.log(e);
            this.errors.push(e);
          });

      },

      saveCardConfiguration() {
//        debugger;
        if (typeof this.subContentStyling === 'undefined'){
          var cardConfigurationPackage = [this.cardId, this.styling, this.content, []];
        }else{
          var domElementKeys = Object.keys(this.subContentStyling);
          var subElements = [];
          for(var o=0;o<domElementKeys.length;o++){
            var thisDomElement = {
              elementName: domElementKeys[o],
              elementStyles:this.subContentStyling[domElementKeys[o]],
              elementConfiguration:this.subContentConfiguration[domElementKeys[o]]
            }
            subElements.push(thisDomElement)
          }
          cardConfigurationPackage = [this.cardId, this.styling, this.content, subElements];
        }
        var jsonCardConfigurationPackage = JSON.stringify(cardConfigurationPackage);
        axios.post('http://localhost:8000/api/shan/saveCardParameters?XDEBUG_SESSION_START=14252', {
          cardParams: jsonCardConfigurationPackage,
        }).then(response=>
        {
            console.log(response);
            this.$emit('configurationHasBeenSaved')
        }).catch(function(error) {
          console.log(error);
        });

        console.log(jsonCardConfigurationPackage);
      },
      saveCardContent(cardContent, domElement){
        debugger;
        console.log(cardContent);
        var cardConfigurationPackage = [this.cardId, this.content];
        var jsonCardConfigurationPackage = JSON.stringify(cardConfigurationPackage);
        axios.post('http://localhost:8000/api/shan/saveCardContent?XDEBUG_SESSION_START=14252', {
          cardParams: jsonCardConfigurationPackage,
          domElement: domElement,
          org: this.$store.getters.getOrgId
        }).then(response=>
        {
          console.log(response);
          this.$emit('configurationHasBeenSaved')
        }).catch(function(error) {
          console.log(error);
        });

        console.log(jsonCardConfigurationPackage);
      }

    }
  };
</script>

<style scoped>

</style>
