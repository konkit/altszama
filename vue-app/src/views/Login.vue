<template>
  <div>
  <v-toolbar>
    <v-toolbar-title>
      <i class="fa fa-cutlery" aria-hidden="true"></i> Alt Szama
    </v-toolbar-title>
  </v-toolbar>

  <div  class="lunch-bg-img">
    <v-container>
      <v-layout justify-center>
        <v-flex xs12 sm8 lg6 class="login-box">
          <h1>Alt Szama</h1>

          <p>Yes! Finally a place, which will help order your lovely foody-foody!</p>

          <p>The button below will use your business Google Account to log in</p>

          <div v-if="loginPending == true">
            <v-btn color="success">Loggin in ... wait plox.</v-btn>
          </div>

          <div v-if="loginPending == false">
            <v-btn color="success" type="submit" :disabled = "loginLoaded == false"  @click="googleSignIn">Login using Google</v-btn>
          </div>

          <div v-for="(error, i) in errors" :key="i">
            <v-alert color="error">
              <p>{{error}}</p>
            </v-alert>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
  </div>
</template>

<script>
import ApiConnector from '../lib/ApiConnector'
import GoogleLogin from '../lib/GoogleLogin.js'

export default {
  data () {
    return {
      loginLoaded: false,
      loginPending: false,
      errors: []
    }
  },
  mounted () {
    GoogleLogin.load().then(() => this.loginLoaded = true)
  },
  methods: {
    googleSignIn () {
      if (this.loginLoaded === true) {
        this.loginPending = true;

        var returnPath = "";
        if(this.$route.query.returnPath) {
          returnPath = this.$route.query.returnPath
        }

        ApiConnector.loginWithGoogle(returnPath)
          .catch(e => {
            this.errors.push(e);
            this.loginPending = false
          })
      }
    }
  }
}
</script>

<style scoped>
  .lunch-bg-img {
    background-image: url('../assets/lunch2.png');
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 100vh;
  }

  .login-box {
    margin-top: 20px;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.6);
    background-image: none;
  }
</style>
