<template>
    <span>
        <span @click="itemClicked" class="layoutMenuItem" v-if="itemIndex!=selectedItemIndex">
            {{itemLabel}}
        </span>
        <span @click="itemClicked" class="layoutMenuItem selectedItem" v-if="itemIndex===selectedItemIndex">
            {{itemLabel}}
        </span>

    </span>

</template>

<script>
    export default {
        name: "menuItem",
        props:{
            itemLabel:{
                type: String,
                required: true
            },
            itemIndex:{
                type: Number,
                required: true
            },
            selectedItemIndex:{
                type: Number,
                required: true
            }
        },
        methods: {
            itemClicked() {
                this.$emit('menuSelection', [this.itemLabel]);
            },
            menuItemSelectedClass(){
                console.log('menuItemSelectedClass');
                if(this.itemIndex==this.selectedItemIndex){
                    return 'layoutMenuItem';
                }else{
                    return 'layoutMenuItem';
                }
            }
        },

    }
</script>

<style scoped>
    .layoutMenuItem {
        background-color: #ffcd90;
        font-family: Arial;
        font-size: 17px;
        padding: 1px;
    }
    .layoutMenuItem:hover {
        background-color: #fff722;
        color: #1132ff;
    }
    .selectedItem {
        color: red;
    }




</style>
