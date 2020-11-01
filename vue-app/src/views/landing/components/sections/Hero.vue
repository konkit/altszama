<template>
  <section id="hero">
    <v-img
      :height="height"
      :src="require('@/assets/lunch2.png')"
      class="black--text"
      >

      <v-container class="fill-height px-4 py-12">
        <v-responsive
          class="d-flex align-center"
          height="100%"
          max-width="700"
          width="100%"
        >
          <h1 class="display-2 font-weight-black mb-4 text-left">ORDERING FOOD AT THE OFFICE?</h1>

          <p class="base-body body-1">Hard to keep track the orders and the payments?</p>
          <p class="base-body body-1">Why don't you check out this fancy tool!</p>

          <div
            :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'"
            class="d-flex flex-wrap"
          >
            <div v-if="loginPending == true">
              <v-btn>Loggin in ... wait plox.</v-btn>
            </div>

            <div v-if="loginPending == false">
              <v-btn
                  color="success"
                  type="submit"
                  :disabled="loginLoaded == false"
                  @click="googleSignIn"
                  x-large
              >Login using Google</v-btn
              >
            </div>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </section>
</template>

<script>
import JsApiConnector from "@/lib/JsApiConnector";
import GoogleLogin from "@/lib/GoogleLogin";

  export default {
    name: 'SectionHero',

    provide: {
      theme: { isDark: false },
    },

    data() {
      return {
        loginLoaded: false,
        loginPending: false,
        errors: []
      };
    },

    computed: {
      height () {
        const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'

        // return `calc(${height} - ${this.$vuetify.application.top}px - 64px)`
        return `calc(${height} - 64px)`
      },
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
