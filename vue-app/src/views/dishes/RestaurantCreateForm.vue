<template>
  <ViewWrapper>
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
            <v-btn color="primary" @click="submitForm">Create</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </ViewWrapper>
</template>

<script lang="ts">
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import DishesApiConnector from "@/lib/api/DishesApiConnector";
import ErrorHandler from "@/lib/ErrorHandler";

@Component({
  components: {
    ViewWrapper,
    ErrorsComponent
  }
})
export default class RestaurantCreateForm extends Vue {
  @Prop() restaurantName!: string;

  name = "";
  url = "";
  telephone = "";
  address = "";

  connector: DishesApiConnector = new DishesApiConnector();

  mounted() {
    this.$store.commit("setTitle", "Create restaurant")
  }

  submitForm() {
    const restaurant = {
      name: this.name,
      url: this.url,
      telephone: this.telephone,
      address: this.address
    };

    this.connector.saveRestaurant(restaurant)
        .then(() => this.$router.back())
        .catch(errResponse => ErrorHandler.handleError(errResponse));
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

<style scoped></style>
