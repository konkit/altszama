<template>
  <ViewWrapper :display-back-button="true">
    <v-container>
      <errors-component/>

      <v-row>
        <v-col>
          <input type="hidden" name="restaurant.id" :value="restaurantId"/>
          <v-text-field label="Name" :value="name" @input="updateName($event)" required="" ></v-text-field>
          <MoneyInput label="Price" :value="price" @input="updatePrice($event)" ></MoneyInput>
          <v-combobox :items="categories" label="Category" :value="category" @input="updateCategory($event)"></v-combobox>

          <div>
            <side-dishes ref="sideDishesElement"></side-dishes>
          </div>

          <div class="mb-4">
            <v-btn color="primary" @click="submitForm">Create</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </ViewWrapper>
</template>

<script lang="ts">
import DishesApiConnector from "../../lib/DishesApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import ErrorsComponent from "../commons/ErrorsComponent.vue";
import SideDishes from "./components/SideDishes.vue";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
  components: {
    ViewWrapper,
    MoneyInput,
    ErrorsComponent,
    SideDishes
  }
})
export default class DishCreateForm extends Vue {
  @Prop(String) restaurantName!: string;

  restaurantId = "";
  name = "";
  price = 0;
  category = "";
  categories: string[] = [];

  connector?: DishesApiConnector;

  mounted() {
    this.restaurantId = this.$route.params.id;
    this.connector = new DishesApiConnector(this.$store.state);

    this.connector
        .getDishCreateData(this.restaurantId)
        .then(response => {
          this.categories = response.categories;

          this.$store.commit("setTitle", "Create new dish")
        })
        .catch(errResponse => ApiConnector.handleError(errResponse));
  }

  submitForm() {
    const sideDishesElement: SideDishes = this.$refs.sideDishesElement as SideDishes;
    const sideDishes = sideDishesElement.getSideDishes();

    const dishPayload = {
      "restaurant.id": this.restaurantId,
      name: this.name,
      price: this.price,
      category: this.category,
      sideDishes: sideDishes
    };

    this.connector!.createDish(this.restaurantId, dishPayload)
        .then(() => this.$router.back())
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

<style scoped>
</style>
