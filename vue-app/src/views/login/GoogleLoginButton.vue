<template>
  <div>
    <div v-if="loginPending === true">Loggin in ... please wait.</div>

    <div>
      <div ref="googleSignInButtonDiv"></div>
    </div>
  </div>

</template>

<script lang="ts">
import GoogleLogin from "@/lib/GoogleLogin";
import Vue from "vue";
import Component from "vue-class-component";
import AuthApiConnector from "@/lib/api/AuthApiConnector";
import {GooglePayload} from "@/frontend-client";
import {getConfig} from "@/lib/config";


@Component({})
export default class GoogleLoginButton extends Vue {

  loginLoaded = false
  loginPending = false

  connector: AuthApiConnector = new AuthApiConnector()

  mounted() {
    const googleClientId = getConfig().googleClientId

    GoogleLogin.load().then(() => {
      this.loginLoaded = true;

      GoogleLogin.initializeGoogleLogin(googleClientId, (payload) => this.doSignin(payload));
      GoogleLogin.renderGoogleLoginButton(this.$refs.googleSignInButtonDiv);
    });
  }

  doSignin(payload: GooglePayload) {
    this.loginPending = true;

    let returnPath = "";
    if (this.$route.query.returnPath) {
      returnPath = this.$route.query.returnPath as string;
    }

    this.connector?.loginWithGoogle(payload, returnPath)
      .catch(e => {
        if (e) {
          this.$store.commit("replaceError", e);
        }
        this.loginPending = false;
      });
  }
}
</script>

<style scoped>

</style>
