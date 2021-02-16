<template>
  <ViewWrapper title="Create new order">
    <LoadingView>
      <v-container>
        <errors-component />

        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field
                      label="Domain"
                      :value="domain"
                      @input="updateDomain($event)"
                      required="true"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-btn color="success" block @click="submitForm">
                      Create
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import router from "../../router/index";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import {
  CANCEL_DISH_ENTRY_MODIFICATION,
  NAMESPACE_MODIFY_ORDER_ENTRY
} from "../../store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import TimePicker from "@/views/commons/TimePicker.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import ApiConnector from "../../lib/ApiConnector";
import { RootState } from "../../store";
import { CreateTeamDto } from "../../frontend-client";
import TeamsApiConnector from "../../lib/TeamsApiConnector";

@Component({
  components: {
    ViewWrapper,
    TimePicker,
    MoneyInput,
    LoadingView,
    ErrorsComponent
  }
})
export default class CreateTeamForm extends Vue {
  domain = "";

  connector?: TeamsApiConnector;

  // created() {
  //   this.$store.commit('setLoadingTrue')
  // }

  mounted() {
    this.connector = new TeamsApiConnector(this.$store.state as RootState);
    this.$store.commit("setLoadingFalse");
  }

  submitForm(e: Event) {
    e.preventDefault();

    const dto: CreateTeamDto = {
      domain: this.domain
    };

    this.connector!.createTeam(dto)
      .then(() => router.push("/teams/"))
      .catch(errResponse => ApiConnector.handleError(errResponse));

    return false;
  }

  updateDomain(newValue: string) {
    this.domain = newValue;
  }
}
</script>

<style scoped></style>
