<template>
  <ViewWrapper>
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">
            <H1>Teams:</H1>
          </v-col>
        </v-row>

        <!--<v-row>-->
        <!--<v-col>-->
        <!--<v-btn class="button" @click="goToCreateTeam()">Create team</v-btn>-->
        <!--</v-col>-->
        <!--</v-row>-->

        <v-row>
          <v-col cols="xs12">
            <h3>All teams</h3>
            <div>
              <div v-for="(team, i) in allTeams" :key="'allTeam-' + team.id">
                <div>{{ i + 1 }}. Team:</div>
                <div>{{ team.domain }}</div>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="xs12">
            <h3>Your teams</h3>

            <div>
              <div
                v-for="(userTeam, i) in userTeams"
                :key="'userTeam-' + userTeam.id"
              >
                <div>{{ i + 1 }}. Team:</div>
                <div>{{ userTeam.domain }}</div>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h3>Your balance</h3>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import TeamsApiConnector from "../../lib/TeamsApiConnector";
import { Team } from "../../frontend-client";
import LoadingView from "@/views/commons/LoadingView.vue";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";

@Component({
  components: {
    ViewWrapper,
    LoadingView,
    ErrorsComponent
  }
})
export default class TeamsView extends Vue {
  allTeams: Team[] = [];
  userTeams: Team[] = [];

  connector?: TeamsApiConnector;

  mounted() {
    const connector = new TeamsApiConnector(this.$store.state);
    this.connector = connector;

    this.connector.getAllTeams().then(allTeams => {
      this.allTeams = allTeams;

      connector.getForUser().then(userTeams => {
        this.userTeams = userTeams;

        this.$store.commit("setLoadingFalse");
        this.$store.commit("setTitle", "Teams");
      });
    });
  }

  goToCreateTeam() {
    this.$router.push({name: "TeamsCreate"});
  }
}
</script>
