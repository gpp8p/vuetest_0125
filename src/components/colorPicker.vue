<template>
        <span class="colorSpan">
            <input   type="color" @change="newColor" :value="val"/>
            <span class="colorSpanLabel">Click to select </span>
        </span>
</template>

<script>
    export default {
        name: "colorPicker",
        props: {
            currentValues:{
                type: Object,
                required: true
            },
            pType:{
                type:String,
                required: true
            },
            setColorVal:{
                type: String,
                required:false
            }

        },
        data(){
            return{
                val:this.getCurrentValue(),
                selectedValue:'',
            }
        },
        watch:{
            currentValues: function(){
 //               debugger;
              this.val = this.getCurrentValue();
            }
        },
        mounted(){
          if(this.setColorVal.length>1){
            this.val=this.setColorVal;
          }
        },

        methods:{
            newColor(evt){
                console.log(evt.target.value);
                this.$emit('selectedValue', [this.pType, evt.target.value]);
            },
            getCurrentValue(){
                //debugger;
                if(typeof(this.currentValues[this.pType])=='undefined'){
                    return '#0509f5';
                }else{
                    return this.currentValues[this.pType];
                }
            }
        }

    }
</script>

<style scoped>
    .input-color-container {
        position: relative;
        overflow: hidden;
        width: 30px;
        height: 20px;
        top: 15px;
        margin-right: 5px;
        margin-top: 20px;
        border: solid 2px #ddd;
        border-radius: 40px;
    }

    .input-color {

        right: -8px;
        top: -5px;
        width: 45px;
        height: 26px;
        border: none;
      align-content: first;
    }

    .input-color-label {
        cursor: pointer;
        text-decoration: underline;
        color: #dbd50c;
        margin-right: 30px;
    }
    .colorSpan{
        width: 200px;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 25% 40%;
        font-family: Helvetica;
        font-size: smaller;
    }
    .colorSpanLabel {
      width: 150Px;
      margin-top: 10px;
      margin-left: 10px;
    }
</style>
