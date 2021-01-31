<template>
  <span>
    {{msg}} ?
      <o-button size="small" @click="yesClick">
        Yes
      </o-button>
      <o-button size="small" @click="noClick">
        No
      </o-button>
  </span>
</template>

<script>
export default {
  name: "AreYouSure",
  props:{
    msg:{
      type: String,
      required: true
    }
  },
  methods:{
    yesClick(){
      this.$emit('rusureClick',true);
    },
    noClick(){
      this.$emit('rusureClick', false);
    }
  }
}
</script>

<style scoped>


</style>
