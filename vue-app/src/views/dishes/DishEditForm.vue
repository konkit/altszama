<template>
  <ViewWrapper title="Edit dish" :display-back-button="true">
    <LoadingView>
      <v-container>
        <errors-component />

        <v-row>
          <v-col>
                <input type="hidden" name="restaurant.id" :value="restaurantId"/>
                <input type="hidden" name="id" :value="dishId" />

                <v-text-field
                  label="Name"
                  :value="name"
                  @input="updateName($event)"
                  required=""
                ></v-text-field>

                <MoneyInput
                  label="Price"
                  :value="price"
                  @input="updatePrice($event)"
                ></MoneyInput>

                <v-combobox
                  :items="categories"
                  label="Category"
                  :value="category"
                  @input="updateCategory($event)"
                ></v-combobox>

                <div>
                  <side-dishes
                    ref="sideDishesElement"
                    :initialSideDishes="initialSideDishes"
                  ></side-dishes>
                </div>

              <div class="my-4">
                <v-btn block color="success" @click="submitForm">Update</v-btn>
              </div>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import SideDishes from "./components/SideDishes.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";
import Component from "vue-class-component";
import Vue from "vue";
import router from "../../router/index";
import { DishUpdateRequest, SideDish } from "../../frontend-client";

@Component({
  components: {
    ViewWrapper,
    MoneyInput,
    LoadingView,
    ErrorsComponent,
    SideDishes
  }
})
export default class DishEditForm extends Vue {
  restaurantId = "";
  dishId = "";
  name = "";
  price = 0;
  category = "";
  categories: string[] = [];
  initialSideDishes: SideDish[] = [];

  connector?: DishesApiConnector;

  mounted() {
    this.restaurantId = this.$route.params.id;
    this.dishId = this.$route.params.dishId;
    this.connector = new DishesApiConnector(this.$store.state);

    this.connector
      .getDishEditData(this.restaurantId, this.dishId)
      .then(dishData => {
        this.name = dishData.dish.name;
        this.price = dishData.dish.price;
        this.category = dishData.dish.category;

        this.initialSideDishes = dishData.dish.sideDishes;
        this.categories = dishData.categories;

        this.$store.commit("setLoadingFalse");

        document.title = `Edit dish | Alt Szama`;
      })
      .catch(errResponse => ApiConnector.handleError(errResponse));
  }

  submitForm() {
    const dish = {
      name: this.name,
      price: this.price,
      category: this.category
    };
    const sideDishesElement: SideDishes = this.$refs
      .sideDishesElement as SideDishes;
    const sideDishes = sideDishesElement.getSideDishes();

    const dishObj: DishUpdateRequest = {
      id: this.dishId,
      name: dish.name,
      price: dish.price,
      category: dish.category,
      sideDishes: sideDishes
    };

    this.connector!.editDish(this.restaurantId, dishObj)
      .then(() => router.push("/restaurants/show/" + this.restaurantId))
      .catch(errResponse => ApiConnector.handleError(errResponse));

    return false;
  }

  updateName(newValue: string) {
    this.name = newValue;
  }

  updatePrice(newValue: number) {
    this.price = newValue;
  }

  updateCategory(newValue: string) {
    this.category = newValue;
  }
}
</script>

<style scoped></style>
