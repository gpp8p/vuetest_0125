<template>
  <span >
    <span @click="linkSelected">
      <span v-if="this.linkIsSelected==true" class="selectedColor">
              <li >{{description}}</li>
      </span>
      <span v-if="this.linkIsSelected==false" class="blueColor">
              <li >{{description}}</li>
      </span>
    </span>
  </span>
</template>

<script>
import store from "@/store";

export default {
name: "searchResultLink",
  props:{
    description:{
      type: String,
      required: true
    },
    target:{
      type: Number,
      required: true
    },

  },
  mounted(){
    var selectedLink = 0;
    console.log('mlink mounted linkSelected-', sessionStorage.getItem('linkSelected'));
    if(typeof (sessionStorage.getItem('linkSelected'))!='undefined'){
      selectedLink =  sessionStorage.getItem('linkSelected');
    }
    console.log('session currentLayoutId - ', this.$store.getters.getCurrentLayoutId);
    if(selectedLink==this.target){
      console.log('setting to green');
      this.linkIsSelected=true;
    }else{
      console.log('setting to blue');
      this.linkIsSelected=false;
    }

  },
  data(){
    return {
      linkIsSelected:false,
    }
  },
  methods:{
    linkSelected(){
      store.commit('setLinkSelected', this.target);
      this.$emit('linkSelected',this.target);
    }
  }

}
</script>

<style scoped>
li:hover {
  color:green;
}
.selectedColor {
  color: red;
}
.blueColor {
  color:blue;
}
a {
  text-decoration: none;
  color:blue;
}
a:hover {
  color:red;
}


</style>
