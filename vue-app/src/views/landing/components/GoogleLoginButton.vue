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

<script>
import GoogleLogin from "@/lib/GoogleLogin";
import JsApiConnector from "@/lib/JsApiConnector";

export default {
  name: "GoogleLoginButton",

  data() {
    return {
      loginLoaded: false,
      loginPending: false,
      errors: []
    };
  },

  mounted() {
    GoogleLogin.load().then(() => (this.loginLoaded = true));
  },

  methods: {
    googleSignIn() {
      if (this.loginLoaded === true) {
        this.loginPending = true;

        let returnPath = "";
        if (this.$route.query.returnPath) {
          returnPath = this.$route.query.returnPath;
        }

        JsApiConnector.loginWithGoogle(returnPath).catch(e => {
          this.errors.push(e);
          this.loginPending = false;
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
