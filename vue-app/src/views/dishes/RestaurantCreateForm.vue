<template>
  <ViewWrapper title="Create restaurant" backpath="#/restaurants">
    <v-container>
      <errors-component/>

      <v-row>
        <v-col>
          <v-card>
            <v-card-text>
              <v-form id="restaurantCreateForm">
                <v-text-field label="Name" :value="name" @input="updateName($event)"></v-text-field>
                <v-text-field label="Url" :value="url" @input="updateUrl($event)"></v-text-field>
                <v-text-field label="Telephone" :value="telephone" @input="updateTelephone($event)"></v-text-field>
                <v-text-field label="Address" :value="address" @input="updateAddress($event)"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn block color="success" @click="submitForm">Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </ViewWrapper>
</template>

<script lang="ts">
  import ErrorsComponent from '../commons/ErrorsComponent'
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from "vue";
  import {Prop} from "vue-property-decorator";
  import Component from "vue-class-component";
  import DishesApiConnector from "../../lib/DishesApiConnector";
  import ApiConnector from "../../lib/ApiConnector";
  import router from '../../router/index'

  @Component({
    components: {
      ViewWrapper,
      ErrorsComponent,
    }
  })
  export default class RestaurantCreateForm extends Vue {
    @Prop() restaurantName: string;

    name: string = '';
    url: string = '';
    telephone: string = '';
    address: string = '';

    connector: DishesApiConnector;

    mounted() {
      this.connector = new DishesApiConnector(this.$store);

      document.title = `Create restaurant | Alt Szama`
    }

    submitForm() {
      const restaurant = {
        name: this.name,
        url: this.url,
        telephone: this.telephone,
        address: this.address,
      };

      this.connector.createRestaurant(restaurant)
        .then(() => router.push("/restaurants"))
        .catch(errResponse => ApiConnector.handleError(errResponse));
    }

    updateName(newValue) {
      this.name = newValue;
    }

    updateUrl(newValue) {
      this.url = newValue;
    }

    updateTelephone(newValue) {
      this.telephone = newValue;
    }

    updateAddress(newValue) {
      this.address = newValue;
    }
  }
</script>

<style scoped>
</style>