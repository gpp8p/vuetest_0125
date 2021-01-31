<template>
    <span :class="deleteActive ? 'pllineDelete' :'plline' ">
        <span v-if="deleteActive">
          <input type="radio" name="deleteGroup" @click="deleteClicked"/>
        </span>
        <perm-list-group :groupId="groupId" :currentlySelectedGroupId="selectedId" :groupDescription="groupDescription" :displayAsRow="false" @groupClicked="groupClicked"></perm-list-group>
        <perm-list-perm :perm-type="this.VIEW_TYPE" :permValue="viewValue" @permChanged="permChanged"></perm-list-perm>
        <perm-list-perm :perm-type="this.AUTHOR_TYPE" :permValue="authorValue" @permChanged="permChanged"></perm-list-perm>
        <perm-list-perm :perm-type="this.ADMIN_TYPE" :permValue="adminValue" @permChanged="permChanged"></perm-list-perm>
    </span>
</template>

<script>
    import permListPerm from '../components/permListPerm.vue';
    import permListGroup from '../components/permListGroup.vue';
    import axios from "axios";
    export default {
        name: "permListLine",
        props:{
          groupId:{
              type: Number,
              required: true
          },
          layoutId:{
              type: Number,
              required: true
          },
          groupDescription:{
              type: String,
              required: true
          },

          viewValue:{
              type: Number,
              required: true
          },
          authorValue:{
              type: Number,
              required: true
          },
          adminValue:{
              type: Number,
              required:true
          },
          opt1Value:{
              type: Number,
              required: true
          },
          opt2Value:{
              type: Number,
              required: true
          },
          opt3Value:{
              type: Number,
              required: true
          },
          selectedId:{
              type: Number,
              required: true
          },
          deleteActive:{
              type: Boolean,
              required: true
          }
        },
        components: {permListPerm, permListGroup},
        data(){
            return {
                VIEW_TYPE: 'view',
                AUTHOR_TYPE: 'author',
                ADMIN_TYPE: 'admin',
                OPT1_TYPE: 'opt1',
                OPT2_TYPE: 'opt2',
                OPT3_TYPE: 'opt3'
            }
        },
        methods: {
            deleteClicked(){
              this.$emit('deleteClicked', this.groupId);
            },
            permChanged(msg){
                console.log(msg);
                debugger;
                axios.post('http://localhost:8000/api/shan/setLayoutPerms?XDEBUG_SESSION_START=14668', {
                    params:{
                        groupId: this.groupId,
                        permType: msg[0],
                        permValue: msg[1],
                        layoutId:this.layoutId
                    }
                })
                    .then(response => {
// eslint-disable-next-line no-debugger
                        // JSON responses are automatically parsed.
                        console.log(response);
                    })
                    .catch(e => {
                        this.errors.push(e);
                        console.log('viewableLayouts failed');
                    });
            },
            groupClicked(msg){
                console.log('groupClicked - ', msg);
                this.$emit('groupClicked',[msg]);
            }
        }
    }
</script>

<style scoped>

    .plline {
        width: 100%;
        display: grid;
        grid-template-columns: 50% 13% 13% 13% 13%;
        font-size: smaller;
        font-family: Arial;
    }

    .pllineDelete {
      width: 100%;
      display: grid;
      grid-template-columns: 10% 40% 13% 13% 13% 13%;
      font-size: smaller;
      font-family: Arial;
    }

</style>
