<template>
  <span>
    <span :class="deleteActive ? 'pllineDelete' :'plline' ">
        <span v-if="deleteActive">
          Rmv. ?
        </span>
        <span>User or Group</span>
        <span>View</span>
        <span>Author</span>
      <span>Administer</span>
    </span>
    <hr/>
  </span>

</template>

<script>
    export default {
      name: "permListHeader",
      props:{
        deleteActive:{
          type: Boolean,
          required: true
        }
      }
    }
</script>

<style scoped>
    hr {
      border-top: 2px solid #dbdbdb;
    }
    .plline {
        margin-top: 2%;
        width: 100%;
        display: grid;
        grid-template-columns: 50% 13% 13% 13% 13%;
        font-size: smaller;
        font-family: Arial;
        font-weight: bold;
        background-color: #ab97ff;
        color: black;
    }
    .pllineDelete {
      margin-top: 2%;
      width: 100%;
      display: grid;
      grid-template-columns: 10% 40% 13% 13% 13% 13%;
      font-size: smaller;
      font-family: Arial;
      font-weight: bold;
      background-color: #ab97ff;
      color: black;
    }
</style>
