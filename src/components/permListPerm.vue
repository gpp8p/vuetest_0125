<template>
    <span><input type="checkbox" @click="this.clicked" :checked="checked" value="on" /></span>
</template>

<script>
    export default {
        name: "permListPerm",
        props:{
            permType:{
                type: String,
                required: true
            },
            permValue:{
                type: Number,
                required:true
            }
        },
        mounted(){
          if(this.permValue>0){
              this.checked=true;
          }else{
              this.checked=false;
          }
        },
        data(){
          return{
              checked: false
          }
        },
        methods:{
            clicked(event){
                if (event.target.checked){
                    this.checked=true;
                    this.$emit('permChanged', [this.permType, 1]);
                }else{
                    this.checked=false;
                    this.$emit('permChanged', [this.permType,0]);
                }
            },
        }
    }
</script>

<style scoped>

</style>
