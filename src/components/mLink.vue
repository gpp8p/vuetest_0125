<template>
  <span >
    <span v-if="this.is_external==0" @click="linkSelected">
      <span v-if="this.linkIsSelected==true" class="selectedColor">
              <li >{{description}}</li>
      </span>
      <span v-if="this.linkIsSelected==false" >
              <li >{{description}}</li>
      </span>
    </span>
    <span v-if="this.is_external==1">
      <li><a v-bind:href="extLink" target="_blank" >{{description}}</a></li>
    </span>

  </span>
</template>

<script>
import store from "@/store";


export default {
name: "mLink",
mounted(){
  var selectedLink = 0;
  console.log('mlink mounted linkSelected-', sessionStorage.getItem('linkSelected'));
  if(typeof (sessionStorage.getItem('linkSelected'))!='undefined'){
    selectedLink =  sessionStorage.getItem('linkSelected');
  }
  let root = document.documentElement;
  console.log('mlink currentLayoutId - ', this.$store.getters.getCurrentLayoutId);
  if(selectedLink==this.target){
    console.log('setting to green');
    this.linkIsSelected=true;
    root.style.setProperty('--liColor', 'color:green;' );
  }else{
    console.log('setting to blue');
    this.linkIsSelected=false;
    root.style.setProperty('--liColor', 'color:blue;' );
  }
  if(typeof(link_url)!=undefined){
    this.extLink='http://'+this.link_url;
  }

},
  props:{
    description:{
      type: String,
      required: true
    },
    target:{
      type: Number,
      required: true
    },
    is_external:{
      type: Number,
      required: true
    },
    link_url:{
      type: String,
      required: false
    }
  },
  data(){
    return {
      linkIsSelected:false,
      displayStyle:'color:green;',
      extLink:''
    }
  },
  methods:{
    linkSelected(){
      debugger;
      sessionStorage.setItem('linkSelected', this.target);
      store.commit('setLinkSelected', this.target);
      console.log('linkSelected - ', this.$store.getters.getLinkSelected);
      this.$emit('linkSelected',this.target);
    }
  }

}
</script>

<style scoped>
li:hover {
  color:red;
}
.selectedColor {
  color: green;
}
.blueColor {
  color:blue;
}
a {
  text-decoration: none;
  color: var(--liColor);
}
a:hover {
  color:red;
}


</style>
