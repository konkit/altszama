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
              <h1 class="pb-5 text-align-center">Test Login</h1>

              <div v-for="(user, i) in usersList" :key="i">
                <v-btn @click="loginAsUser(user)">{{user.username}} ({{user.email}})</v-btn>
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
import {BACKEND_URL} from "@/lib/config";

@Component({
  components: {
    ErrorsComponent,
    GoogleLoginButton
  }
})
export default class TestLoginView extends Vue {

  usersList = []

  mounted() {
    this.getTestUsers()
  }

  get height() {
    return "calc(100vh - 64px)"
  }

  loginAsUser(user: any) {
    const payload = {
      username: user.username,
      email: user.email
    }
    this.doLogin(payload);
  }

  private getTestUsers() {
    fetch(`${BACKEND_URL}/auth/testUser/list`, {method: 'GET'})
    .then(response => response.json())
    .then(data => {
      console.log("Users: ", data)
      this.usersList = data
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  private doLogin(payload: { email: string; username: string }) {
    fetch(`${BACKEND_URL}/auth/testUser/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      this.$store.commit("loginUser", {username: data.username, token: data.token})
      this.$router.push({"name": "TodayOrders"})
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
}
</script>

<style scoped>

.text-align-center {
  text-align: center;
}

</style>
