<template>
  <ViewWrapper>
    <LoadingView>
      <v-container>
        <errors-component/>

        <v-row>
          <v-col>
            <v-form id="restaurantCreateForm">
              <v-text-field label="Name" :value="name" @input="updateName($event)"></v-text-field>
              <v-text-field label="Url" :value="url" @input="updateUrl($event)"></v-text-field>
              <v-text-field label="Telephone" :value="telephone" @input="updateTelephone($event)"></v-text-field>
              <v-text-field label="Address" :value="address" @input="updateAddress($event)"></v-text-field>
            </v-form>
            <div class="my-4">
              <v-btn color="primary" @click="submitForm">Update</v-btn>
            </div>
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
import DishesApiConnector from "@/lib/api/DishesApiConnector";
import ErrorHandler from "@/lib/ErrorHandler";
import router from "@/router/index";

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

  connector: DishesApiConnector = new DishesApiConnector();

  mounted() {
    this.restaurantId = this.$route.params.id;

    this.connector
        .getRestaurantEditData(this.restaurantId)
        .then(payload => {
          this.name = payload.name;
          this.url = payload.url;
          this.telephone = payload.telephone;
          this.address = payload.address;
          this.$store.commit("setLoadingFalse");

          this.initialName = payload.name;

          this.$store.commit("setTitle", `Edit restaurant ${this.initialName}`)
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  submitForm() {
    const restaurant = {
      id: this.restaurantId,
      name: this.name,
      url: this.url,
      telephone: this.telephone,
      address: this.address
    };

    this.connector.editRestaurant(this.restaurantId, restaurant)
        .then(() => router.push({name: "ShowRestaurant", params: {id: this.restaurantId}}))
        .catch(errResponse => ErrorHandler.handleError(errResponse));

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
</style>
