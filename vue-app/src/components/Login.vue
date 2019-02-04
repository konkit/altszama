<template>
  <div  class="lunch-bg-img">
    <nav class="navbar navbar-expand-sm navbar-light bg-light rounded">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <a class="navbar-brand" href="#"><i class="fa fa-cutlery" aria-hidden="true"></i> Alt Szama</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <ul class="navbar-nav mr-auto">
          <li class="nav-item"></li>
          <li class="nav-item"></li>
          <li class="nav-item"></li>
        </ul>

      </div>
    </nav>

    <div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 login-box">
            <h1>Altszama</h1>

            <p>Yes! Finally a place, which will help order your lovely foody-foody!</p>

            <p>The button below will use your business Google Account to log in</p>

            <div v-if="loginPending == true">
              <v-btn color="success">Loggin in ... wait plox.</v-btn>
            </div>

            <div v-if="loginPending == false">
              <v-btn color="success" type="submit" :disabled = "loginLoaded == false"  @click="googleSignIn">Login using Google</v-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div>
              <div v-for="(error, i) in errors" :key="i">
                <b-alert variant="danger" show dismissible>
                  <p>{{error}}</p>
                </b-alert>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiConnector from '../lib/ApiConnector'
import router from '../router'
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
    background-image: url('./../assets/lunch2.png'); 
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
