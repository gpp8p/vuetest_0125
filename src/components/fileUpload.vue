<template>
    <span class="uploadWrapperStyle">
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>

        <span v-if="!uploadStatus">
            File Uploaded Successfully!
        </span>

    </span>
</template>

<script>
    import axios from "axios";

    export default {
        name: "fileUpload",
        props: {
            fileRole:{
                type: String,
                required: true

            }
        },
        data(){
            return {
                file: '',
                user: 'dev',
                returnedData:'',
                uploadStatus:true
            }
        },
        methods :{
            handleFileUpload(){
                console.log('handleFileUpload called');
                this.file = this.$refs.file.files[0];
                this.submitFile();
            },
            submitFile(){
                let formData = new FormData();
                formData.append('file', this.file);
                formData.append('org', this.$store.getters.getOrgId);
                formData.append('fileRole', this.fileRole);
// eslint-disable-next-line no-debugger
//        debugger;

                axios.post( 'http://localhost:8000/api/shan/fileUpload?XDEBUG_SESSION_START=15617',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then(response=>{
// eslint-disable-next-line no-console
                    this.returnedData = response.data;
                    this.$emit('selectedValue', [this.fileRole, this.returnedData]);
                    console.log('SUCCESS!!'+response.data);
                    this.uploadStatus=false;
                }).catch(function(error){
//            debugger;
                    console.log('FAILURE!!'+error);
                });
            },
        }
    }
</script>

<style scoped>
    .uploadWrapperStyle{
        padding-top: 10px;
    }

</style>
