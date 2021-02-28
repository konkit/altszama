<template>
  <div>
    <v-btn v-if="loginPending === true" x-large disabled>Loggin in ... please wait.</v-btn>

    <v-btn v-if="loginPending === false"
           color="success"
           type="submit"
           :disabled="loginLoaded === false"
           @click="googleSignIn"
           x-large>
      Login using Google Account
    </v-btn>
  </div>
</template>

<script lang="ts">
import GoogleLogin from "@/lib/GoogleLogin";
import Vue from "vue";
import Component from "vue-class-component";
import AuthApiConnector from "@/lib/api/AuthApiConnector";

@Component({})
export default class GoogleLoginButton extends Vue {

  loginLoaded = false
  loginPending = false

  connector: AuthApiConnector = new AuthApiConnector()

  mounted() {
    GoogleLogin.load().then(() => (this.loginLoaded = true));
  }

  googleSignIn() {
    if (this.loginLoaded) {
      this.loginPending = true;

      let returnPath = "";
      if (this.$route.query.returnPath) {
        returnPath = this.$route.query.returnPath as string;
      }

      this.connector?.loginWithGoogle(returnPath).catch(e => {
        this.$store.commit("clearErrors");
        if (e) {
          this.$store.commit("addError", e);
        }
        this.loginPending = false;
      });
    }
  }
}
</script>

<style scoped>

</style>
