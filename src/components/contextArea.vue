<template>
    <span>
        <span v-if="this.showBackButton"  class="labelLinkStyle" @click="goBack">Back</span>
    </span>

</template>

<script>
    export default {
        name: "contextArea",
        data(){
            return {
                showBackButton:false
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
                console.log('goBack()')
                var thisStringLayoutIdStack = sessionStorage.getItem('layoutIdStack');
                if(thisStringLayoutIdStack!=null){
                    var thisLayoutIdStack = JSON.parse(thisStringLayoutIdStack);
                    thisLayoutIdStack.pop();
                    if(thisLayoutIdStack.length>0){
                        thisStringLayoutIdStack = JSON.stringify(thisLayoutIdStack);
                        sessionStorage.setItem('layoutIdStack', thisStringLayoutIdStack);
                    }else{
                        sessionStorage.removeItem('layoutIdStack');
                    }
                    var stackTop = thisLayoutIdStack.length -1;
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
            }
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
</style>
