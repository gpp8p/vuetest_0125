<template>
    <span class="goBackCss">
        <span v-if="this.showBackButton"  class="labelLinkStyle" @click="goBack">Go Back</span>
        <span v-if="this.showBackButton"  class="labelLinkStyle" @click="getOrgHome">Go Home</span>
    </span>

</template>

<script>
    import axios from "axios";
    import store from "@/store";

    export default {
        name: "contextArea",
        data(){
            return {
                showBackButton:false,
                stackNow:''
            }
        },
        props:{
            layout :{
                type:Number,
                required:true
            }
        },
        watch: {
            layout: function(){
//                debugger;
                console.log('contextArea layout changed');
                var thisStringLayoutIdStack = sessionStorage.getItem('layoutIdStack');
                var thisLayoutIdStack = JSON.parse(thisStringLayoutIdStack);
                if(thisLayoutIdStack.length>1){
                    this.showBackButton = true;
                }
            }
        },
        methods: {
            goBack(){
//                debugger;
                sessionStorage.setItem('linkSelected', 0);
                sessionStorage.setItem('searchQuery', '');
                sessionStorage.setItem('searchActive', false);

                console.log('goBack()')
                var thisStringLayoutIdStack = sessionStorage.getItem('layoutIdStack');
//                debugger;
                console.log('in contextArea layoutIdStack -', thisStringLayoutIdStack);
                var nullTop = false;
                if(thisStringLayoutIdStack.includes('null')){
                  nullTop=true;
                }
              if(thisStringLayoutIdStack!=null){
                    var thisLayoutIdStack = JSON.parse(thisStringLayoutIdStack);
                    console.log(thisLayoutIdStack);
                    debugger;
                    if(nullTop){
                      console.log('null removed from layoutIdStack');
                      thisLayoutIdStack.pop();
                    }
                    thisLayoutIdStack.pop();
                    if(thisLayoutIdStack.length>0){
                        thisStringLayoutIdStack = JSON.stringify(thisLayoutIdStack);
                        console.log('setting layoutIdStack:', thisStringLayoutIdStack);
                        sessionStorage.setItem('layoutIdStack', thisStringLayoutIdStack);
                    }else{
                        sessionStorage.removeItem('layoutIdStack');
                    }
                    var stackTop = thisLayoutIdStack.length -1;
                    console.log('stackTop', stackTop);
                    this.stackNow = thisLayoutIdStack;
                    if(stackTop>=0){
                        var nextLayoutId = thisLayoutIdStack[stackTop]
                        thisLayoutIdStack.pop();
                        thisStringLayoutIdStack = JSON.stringify(thisLayoutIdStack);
                        sessionStorage.setItem('layoutIdStack', thisStringLayoutIdStack);
                        this.$router.push({
                            name: 'displayLayout',
                            params: { layoutId: nextLayoutId }
                        });
                        this.$router.go();
                    }else{
                        this.showBackButton=false;
                    }
                }
            },
          getOrgHome(){
            var apiPath = this.$store.getters.getApiBase;
            axios.get(apiPath+'api/shan/getOrgHome?XDEBUG_SESSION_START=14668', {
              params:{
                orgId:this.$store.getters.getOrgId
              }
            })
                .then(response => {
                  console.log('getOrgHome-',response);

                  store.commit('setOrgHome', response.data);
                  store.commit('setCurrentLayoutId', response.data);
                  var thisLayoutIdStack = [];
                  var thisStringLayoutIdStack = JSON.stringify(thisLayoutIdStack);
                  console.log('setting layoutIdStack:', thisStringLayoutIdStack);
                  sessionStorage.setItem('layoutIdStack', thisStringLayoutIdStack);
                  this.$router.push({
                    name: 'displayLayout',
                    params: { layoutId: response.data }
                  });
                  this.$router.go();
                })
                .catch(e => {
                  this.errors.push(e);
                  console.log('getOrgHome failed');
                });
          },



        }
    }
</script>

<style scoped>
    .labelLinkStyle {
        color:blue;
        font-family: Arial;
        margin-right: 15px;
    }
    .labelLinkStyle:hover {
        color:red;
        font-weight: bold;
    }
    .goBackCss {
      display: grid;
      grid-template-rows: 30px 30px;
    }
</style>
