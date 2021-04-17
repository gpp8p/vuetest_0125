<template>
  <div id="app" class="editorDialog">
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor>
  </div>
</template>

<script>
// ⚠️ NOTE: We don't use @ckeditor/ckeditor5-build-classic any more!
// Since we're building CKEditor from source, we use the source version of ClassicEditor.
import CKEditor from '@ckeditor/ckeditor5-vue2';
import Vue from 'vue';
Vue.use( CKEditor );

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
//    import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

import Font from '@ckeditor/ckeditor5-font/src/font'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import List from '@ckeditor/ckeditor5-list/src/list'
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'

//import CKEditorInspector from '@ckeditor/ckeditor5-inspector';


export default {
  name: 'editorCk',
  props:{
    cardData:{
      type: String,
      required: true
    },
    cmd:{
      type: String,
      required: true
    }
  },
  mounted(){
    this.editorData = this.cardData;
  },
  watch:{
    cmd:function(){
      debugger;
      switch(this.cmd){
        case 'Save':{
          this.$emit('saveContent', this.editorData);
          break;
        }
        case 'cacheCurrentContent':{
          debugger;
          const selection = this.editorInstance.model.document.selection;
          const range = selection.getFirstRange();
          this.$emit('currentContent', [this.editorData, range, selection]);
          break;
        }

      }
    }
  },
  methods:{
    onEditorReady(editor){
      this.editorInstance = editor;
      this.$emit('editorReady',editor);
    }
  },
  data() {
    return {
      editorInstance:{},
      editor: ClassicEditor,
      editorData: this.cardData,
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          Image,
          ImageToolbar,
//                        ImageCaption,
          ImageStyle,
          ImageResize,
          EasyImage,
          SimpleUploadAdapter,
          Font,
          Alignment,
          List,
          TodoList,
          Table,
          TableToolbar,
          PasteFromOffice
        ],

        toolbar: {
          items: [
            'bold',
            'italic',
            'link',
            'undo',
            'redo',
            'imageUpload',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            'alignment',
            'bulletedList',
            'numberedList',
            'todoList',
            'insertTable'


          ]
        },
        image: {
          toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],

          styles: [
            // This option is equal to a situation where no style is applied.
            'full',

            // This represents an image aligned to the left.
            'alignLeft',

            // This represents an image aligned to the right.
            'alignRight'
          ]
        },
        simpleUpload: {
          uploadUrl: 'http://localhost:8000/api/shan/imageUploadCk?XDEBUG_SESSION_START=19403'
        },
        fontFamily: {
          options: [
            'default', 'Helvetica', 'Times', 'Verdana', 'Arial Narrow', 'Candara', 'Geneva', 'Calibri', 'Optima', 'Cambria', 'Garamond', 'Perpetua', 'Monaco', 'Didot', 'Brush Script MT', 'Lucida Bright', 'Copperplate',
            'Ubuntu, Arial, sans-serif',
            'Ubuntu Mono, Courier New, Courier, monospace'
          ]
        },
        alignment: {
          options: [ 'left', 'right', 'center', 'justify' ]
        },
        table: {
          contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
        }

      },




    };
  }
};
</script>
<style>
.ck-editor__editable {
  min-height: var(--ck-height);
  max-height: var(--ck-height);
  min-width:  var(--ck-width);
}
.image {
  display: table;
  clear: both;
  text-align: center;
}
.image-style-side {
  float: right;

}
.image-style-side > img {
  max-width: 100%;
  height: auto;
}
.image-style-align-right {
  float: right;
}
.image-style-align-left {
  float: left;
}
</style>

<style scoped>


.editorDialog{
  top:250px;
  height:530px;
  width:1000px;


}

</style>

