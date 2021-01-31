<template>
    <h2>Sorry...there was a problem reaching your page:{{this.problemDescription}}</h2>
</template>

<script>
    export default {
        name: "errorPage",
        mounted(){
          this.problemDescription=this.$route.params.errorMessage;
        },
        data(){
            return {
                problemDescription:''
            }
        }
    }
</script>

<style scoped>

</style>
