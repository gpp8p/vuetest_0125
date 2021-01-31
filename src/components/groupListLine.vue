<template>
    <span class="plline">
      <perm-list-group :groupId="groupId"  :groupDescription="groupDescription" :displayAsRow="false" @groupClicked="groupClicked"></perm-list-group>
    </span>
</template>

<script>
import permListGroup from '../components/permListGroup.vue';
export default {
name: "groupListLine",
  components: {permListGroup},
  props:{
    groupId: {
      type: String,
      required: true
    },
    selectedId:{
      type: String,
      required: false
    },
    groupDescription:{
      type: String,
      required: true
    }
  },
  methods:{
    groupClicked(msg){
      console.log('group clicked', msg);
      this.$emit('groupClicked', msg[0]);
    }
  }
}
</script>

<style scoped>
.plline {
  width: 100%;
  display: grid;
  grid-template-columns: 50% ;
  font-size: medium;
  font-family: Arial;
}
</style>
