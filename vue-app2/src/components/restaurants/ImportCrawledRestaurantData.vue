<template>
  <div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <back-button href="#/restaurants"></back-button>

          <h1>Import restaurant from JSON</h1>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <a href="/static/example.json" download>Download JSON template</a>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          Upload file:

          <fileupload :target="this.getUploadUrl()" action="POST" v-on:progress="progress" v-on:start="startUpload" v-on:finish="finishUpload"></fileupload>

          <p>Status: {{uploadState}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiConnector from '../../ApiConnector.js'
import FileUpload from 'vue-simple-upload/dist/FileUpload'
import BackButton from '../commons/backButton'

export default {
  data () {
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
    BackButton
  },
}
</script>

<style scoped>
  .container {
    max-width: 1200px;
  }

  .row {
    margin-top: 2rem;
  }
</style>
