<template>
  <v-img
      :height="height"
      :src="require('@/assets/lunch2.png')"
      class="black--text"
  >
    <v-container class="fill-height px-4 py-12">
      <v-responsive class="d-flex align-center" height="100%" width="100%">

        <v-row class="d-flex justify-center align-content-center">
          <v-col cols="12" sm="8" lg="6">
            <v-card class="pa-8">
              <h1 class="text-h4 font-weight-bold pb-5 text-align-center">Login using Google Account</h1>

              <v-alert v-if="$store.state.errors.length === 0" outlined type="info" class="pt-5">
                Remember to use your company's Google account to access your colleauges' orders.
              </v-alert>

              <errors-component></errors-component>

              <div class="d-flex justify-center">
              <GoogleLoginButton class="py-5"></GoogleLoginButton>
              </div>

            </v-card>
          </v-col>
        </v-row>
      </v-responsive>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import GoogleLoginButton from "@/views/login/GoogleLoginButton.vue";

@Component({
  components: {
    ErrorsComponent,
    GoogleLoginButton
  }
})
export default class LoginView extends Vue {
  get height() {
    return "calc(100vh - 64px)"
  }
}
</script>

<style scoped>

.text-align-center {
  text-align: center;
}

</style>
