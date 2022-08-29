<template>
        <span class="layoutMenu">
                <menu-item v-for="(label, index) in items"
                           :itemLabel="label"
                           :key="index"
                           :itemIndex="index"
                           :selectedItemIndex="selectedItem"
                           @menuSelection="itemSelected"
                ></menu-item><a v-bind:href="helpUrl" class="help" target="_blank">Help</a>
        </span>
</template>

<script>
    import menuItem from "./menuItem.vue";
//    import store from './store';
//    import menuItemSelected from "./menuItemSelected.vue"
    export default {
        name: "menuComponent",
        components: { menuItem },
        mounted(){
          this.helpUrl = this.$store.getters.getHelpUrl;
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
                useMenuItemSelected: false,
                helpUrl:''
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
    .help {
      text-decoration: none;
      background-color: #ffcd90;
      font-family: Arial;
      font-size: 17px;
      padding: 1px;
    }
    .help:hover {
      background-color: #fff722;
      color: #1132ff;
    }

</style>
