<template>
  <ViewWrapper title="Import restaurant from JSON" backpath="#/restaurants">
    <v-container fluid>
      <v-layout align-center justify-center>
        <v-flex xs10>
          <v-card>
            <v-card-text>
              <errors-component/>

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
  </ViewWrapper>
</template>

<script>
  import ApiConnector from '../../lib/ApiConnector'
  import FileUpload from 'vue-simple-upload/dist/FileUpload'
  import ViewWrapper from "../commons/ViewWrapper";

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
      ViewWrapper,
      'fileupload': FileUpload,
    },
  }
</script>

<style scoped>
  .layout {
    margin-top: 2rem;
  }
</style>
