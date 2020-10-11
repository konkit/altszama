<template>
  <ViewWrapper
    :title="`Edit restaurant ${initialName}`"
    :backpath="`#/restaurants/show/${this.restaurantId}`"
  >
    <LoadingView>
      <v-container>
        <errors-component />

        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <v-form id="restaurantCreateForm">
                  <v-text-field
                    label="Name"
                    :value="name"
                    @input="updateName($event)"
                  ></v-text-field>
                  <v-text-field
                    label="Url"
                    :value="url"
                    @input="updateUrl($event)"
                  ></v-text-field>
                  <v-text-field
                    label="Telephone"
                    :value="telephone"
                    @input="updateTelephone($event)"
                  ></v-text-field>
                  <v-text-field
                    label="Address"
                    :value="address"
                    @input="updateAddress($event)"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="success" @click="submitForm">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";

import LoadingView from "@/views/commons/LoadingView.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import DishesApiConnector from "../../lib/DishesApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import router from "../../router/index";

@Component({
  components: {
    ViewWrapper,
    LoadingView,
    ErrorsComponent
  }
})
export default class RestaurantEditForm extends Vue {
  restaurantId = "";
  initialName = "";

  name = "";
  url = "";
  telephone = "";
  address = "";

  connector?: DishesApiConnector;

  mounted() {
    this.restaurantId = this.$route.params.id;
    this.connector = new DishesApiConnector(this.$store.state);

    this.connector
      .getRestaurantEditData(this.restaurantId)
      .then(payload => {
        this.name = payload.name;
        this.url = payload.url;
        this.telephone = payload.telephone;
        this.address = payload.address;
        this.$store.commit("setLoadingFalse");

        this.initialName = payload.name;

        document.title = `Edit restaurant ${this.initialName} | Alt Szama`;
      })
      .catch(errResponse => ApiConnector.handleError(errResponse));
  }

  submitForm() {
    const restaurant = {
      id: this.restaurantId,
      name: this.name,
      url: this.url,
      telephone: this.telephone,
      address: this.address
    };

    this.connector!.editRestaurant(this.restaurantId, restaurant)
      .then(() => router.push("/restaurants/show/" + this.restaurantId))
      .catch(errResponse => ApiConnector.handleError(errResponse));

    return false;
  }

  updateName(newValue: string) {
    this.name = newValue;
  }

  updateUrl(newValue: string) {
    this.url = newValue;
  }

  updateTelephone(newValue: string) {
    this.telephone = newValue;
  }

  updateAddress(newValue: string) {
    this.address = newValue;
  }
}
</script>

<style scoped>
.row {
  margin-top: 2rem;
}
</style>
