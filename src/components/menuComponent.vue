<template>
        <span class="layoutMenu">
                <menu-item v-for="(label, index) in items"
                           :itemLabel="label"
                           :key="index"
                           :itemIndex="index"
                           :selectedItemIndex="selectedItem"
                           @menuSelection="itemSelected"
                ></menu-item>
        </span>
</template>

<script>
    import menuItem from "./menuItem.vue";
//    import menuItemSelected from "./menuItemSelected.vue"
    export default {
        name: "menuComponent",
        components: { menuItem },
        mounted(){

        },
        props:{
            items:{
                type: Array,
                required: true
            },
            selectedItem:{
                type: Number,
                required: true
            }

        },
        methods:{
            itemSelected(msg){
                this.$emit('menuSelection', [msg[0]]);
            },
        },
        data(){
            return {
                useMenuItemSelected: false
            }
        }
    }
</script>

<style scoped>
    .layoutMenu {
        display: flex;
        justify-content: space-evenly;
        height: 100%;
        width:100%;
        align-items: baseline;
        margin-top: 6px;
        color: blue;
    }
</style>
