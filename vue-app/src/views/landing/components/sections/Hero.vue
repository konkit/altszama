<template>
  <section id="hero">
    <v-img
      :min-height="minHeight"
      :src="require('@/assets/lunch2.png')"
      class="white--text"
      gradient="to right, rgba(5, 11, 31, .8), rgba(5, 11, 31, .8)"
    >
      <v-container class="fill-height px-4 py-12">
        <v-responsive
          class="d-flex align-center"
          height="100%"
          max-width="700"
          width="100%"
        >
          <base-heading title="ALT SZAMA" />

          <base-body>
            <p>
            Yes! Finally a place, which will help order your lovely
            foody-foody!
            </p>

            <p>
              The button below will use your business Google Account to log in
            </p>
          </base-body>

          <div
            :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'"
            class="d-flex flex-wrap"
          >
            <div v-if="loginPending == true">
              <base-btn>Loggin in ... wait plox.</base-btn>
            </div>

            <div v-if="loginPending == false">
              <base-btn
                  color="success"
                  type="submit"
                  :disabled="loginLoaded == false"
                  @click="googleSignIn"
              >Login using Google</base-btn
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
      minHeight () {
        const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'

        return `calc(${height} - ${this.$vuetify.application.top}px - 64px)`
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
