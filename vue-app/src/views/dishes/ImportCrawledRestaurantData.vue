<template>
  <div>
    <v-toolbar>
      <back-button2 href="#/restaurants"></back-button2>

      <v-toolbar-title>
        Import restaurant from JSON
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <errors-component />

                <v-layout>
                  <a href="/static/example.json" download>Download JSON template</a>
                </v-layout>

                <v-layout>
                  Upload file:

                  <fileupload :target="this.getUploadUrl()" action="POST" @progress="progress" @start="startUpload"
                              @finish="finishUpload"></fileupload>

                  <p>Status: {{uploadState}}</p>
                </v-layout>

              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
  import ApiConnector from '../../lib/ApiConnector.js'
  import FileUpload from 'vue-simple-upload/dist/FileUpload'
  import BackButton2 from '../commons/BackButton2'

  export default {
    data() {
      return {
        uploadState: ""
      }
    },
    methods: {
      getUploadUrl: () => ApiConnector.getBackendUrl() + '/restaurantImport',
      startUpload: (e) => {
        // file upload start event
        console.log("startUpload", e);
        this.uploadState = "Starting upload"
      },
      finishUpload: (e) => {
        // file upload finish event
        console.log("finishUpload", e);
        this.uploadState = "Upload finished"
      },
      progress: (e) => {
        // file upload progress
        // returns false if progress is not computable
        console.log("Progress", e);
        this.uploadState = "Progress = " + e
      }
    },
    components: {
      'fileupload': FileUpload,
      BackButton2,
    },
  }
</script>

<style scoped>
  .layout {
    margin-top: 2rem;
  }
</style>
