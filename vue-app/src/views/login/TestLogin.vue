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
              <h1 class="text-h4 pb-5 text-align-center">Test Login</h1>

              <div v-for="(user, i) in usersList.slice((page_number - 1) * 10, page_number * 10)" :key="i">
                <v-btn @click="loginAsUser(user)">{{ user.username }} ({{ user.email }})</v-btn>
              </div>

              <v-pagination
                  v-model="page_number"
                  :length="Math.ceil(usersList.length / 10)"
              ></v-pagination>
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
import {getConfig} from "@/lib/config";

interface UserEntry {
  username: string;
  email: string;
}

@Component({
  components: {
    ErrorsComponent,
    GoogleLoginButton
  }
})
export default class TestLoginView extends Vue {

  usersList: UserEntry[] = [];

  page_number = 1

  mounted() {
    this.getTestUsers()
  }

  get height() {
    return "calc(100vh - 64px)"
  }

  loginAsUser(user: UserEntry) {
    const payload = {
      username: user.username,
      email: user.email
    }
    this.doLogin(payload);
  }

  private getTestUsers() {
    fetch(`${getConfig().currentDomain}/api/auth/testUser/list`, {method: 'GET'})
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json()
        })
        .then((data: UserEntry[]) => {
          this.usersList = data.sort((a, b) => a.username.localeCompare(b.username))
        })
        .catch((error) => {
          console.error('Error:', error);
          this.$router.push({name: 'Login'})
        });
  }

  private doLogin(payload: { email: string; username: string }) {
    fetch(`${getConfig().currentDomain}/api/auth/testUser/login`, {
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
