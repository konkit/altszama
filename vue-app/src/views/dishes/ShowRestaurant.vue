<template>
  <ViewWrapper>
    <LoadingView>
      <errors-component/>

      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-layout column>
              <p><b>Address : </b> {{ this.restaurant.address }}</p>
              <p>
                <b>URL : </b>
                <a target="_blank" :href="this.restaurant.url">{{ this.restaurant.url }}</a>
              </p>
              <p>
                <b>Telephone number:</b> {{ this.restaurant.telephone }}
              </p>
              <p>
                <b>Last auto-updated:</b>
                {{ dateToRel(this.restaurant.lastCrawled) }}
              </p>
              <p>
                <b>Last updated manually:</b>
                {{ dateToRel(this.restaurant.lastEdited) }}
              </p>
            </v-layout>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col>
            <div class="d-flex justify-space-between">
              <v-btn dark color="green" @click="goToCreateDish()">
                Create new dish
                <v-icon>add</v-icon>
              </v-btn>

              <v-btn @click="editRestaurant">
                Edit restaurant&nbsp;<span class="fa fa-pencil"/>
              </v-btn>

              <v-btn color="error" @click="deleteRestaurant()">
                Delete restaurant&nbsp;<span class="fa fa-times"/>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <show-restaurant-dishes-table :restaurant="this.restaurant"
                                          :dishes-by-category="this.dishesByCategory"
                                          @delete-dish="deleteDish($event)">
            </show-restaurant-dishes-table>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import ShowRestaurantDishesTable from "./components/ShowRestaurantDishesTable.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import router from "../../router/index";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Component from "vue-class-component";
import Vue from "vue";
import moment from "moment";
import ErrorHandler from "@/lib/ErrorHandler";
import DishesApiConnector from "@/lib/api/DishesApiConnector";
import {DishDto, Restaurant} from "@/frontend-client";

@Component({
  components: {
    ViewWrapper,
    LoadingView,
    ErrorsComponent,
    ShowRestaurantDishesTable
  }
})
export default class ShowRestaurant extends Vue {
  restaurantId = "";

  restaurant: Restaurant = {
    id: "",
    name: "",
    url: "",
    telephone: "",
    address: ""
  }
  dishes: DishDto[] = []
  dishesByCategory: { [key: string]: DishDto[] } = {}

  connector = new DishesApiConnector()

  mounted() {
    this.restaurantId = this.$route.params.id;

    this.connector
        .getShowRestaurantData(this.restaurantId)
        .then(response => {
          this.restaurant = response.restaurant;
          this.dishes = response.dishes;
          this.dishesByCategory = response.dishesByCategory;

          this.$store.commit("setTitle", `Restaurant ${this.restaurant!.name}`)
          this.$store.commit("setLoadingFalse");
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  goToCreateDish() {
    router.push({name: "DishCreateForm", params: {id: this.restaurantId}})
  }

  editRestaurant() {
    router.push({name: "RestaurantEditForm", params: {id: this.restaurantId}})
  }

  deleteRestaurant() {
    this.connector
        .deleteRestaurant(this.restaurantId)
        .then(response => this.$router.push({name: "RestaurantIndex"}))
        .catch(errResponse => errResponse.text().then((errorMessage: string) => ErrorHandler.handleError(errorMessage)));
  }

  deleteDish(dishId: string) {
    this.connector
        .deleteDish(this.restaurant.id, dishId)
        .then(_ => {
          return this.connector
              .getShowRestaurantData(this.restaurantId)
              .then(response => {
                this.restaurant = response.restaurant;
                this.dishes = response.dishes;
                this.dishesByCategory = response.dishesByCategory;

                this.$store.commit("setTitle", `Restaurant ${this.restaurant!.name}`)
                this.$store.commit("setLoadingFalse");
              })
        })
        .catch(errResponse => errResponse.text().then((errorMessage: string) => ErrorHandler.handleError(errorMessage)));
  }

  dateToRel(date: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }
}
</script>

<style scoped></style>
