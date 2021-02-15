<template>
  <ViewWrapper title="Import restaurant from JSON" backpath="#/restaurants">
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">
            <h1></h1>
            <errors-component/>

            <v-layout>
              <a href="/static/example.json" download>Download JSON template</a>
            </v-layout>

            <v-layout>
              Upload file:

              <fileupload
                  :target="this.getUploadUrl()"
                  action="POST"
                  @progress="progress"
                  @start="startUpload"
                  @finish="finishUpload"
              ></fileupload>

              <p>Status: {{ uploadState }}</p>
            </v-layout>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import ApiConnector from "../../lib/ApiConnector";
import FileUpload from "vue-simple-upload/dist/FileUpload.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue"
import LoadingView from "@/views/commons/LoadingView.vue";
import Component from "vue-class-component";
import Vue from "vue";

@Component({
  components: {
    LoadingView,
    ViewWrapper,
    fileupload: FileUpload,
    ErrorsComponent
  }
})
export default class ImportCrawledRestaurantData extends Vue {
  uploadState = ""

  getUploadUrl() {
    return ApiConnector.getBackendUrl() + "/restaurantImport"
  }

  startUpload(e: any) {
    // file upload start event
    console.log("startUpload", e);
    this.uploadState = "Starting upload";
  }

  finishUpload(e: any) {
    // file upload finish event
    console.log("finishUpload", e);
    this.uploadState = "Upload finished";
  }

  progress(e: any) {
    // file upload progress
    // returns false if progress is not computable
    console.log("Progress", e);
    this.uploadState = "Progress = " + e;
  }

  getSwaggerUrl() {
    return ApiConnector.getBackendUrl() + "/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config#/"
  }
};
</script>

<style scoped>
</style>
