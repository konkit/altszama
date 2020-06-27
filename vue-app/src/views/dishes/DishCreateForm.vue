<template>
  <ViewWrapper :title="`Create dish`" :backpath="getBackUrl()">
    <v-container>
      <errors-component/>

      <v-row>
        <v-col>
          <v-card>
            <v-card-text>
              <input type="hidden" name="restaurant.id" :value="restaurantId"/>

              <v-text-field label="Name" :value="name" @input="updateName($event)" required=""></v-text-field>

              <MoneyInput label="Price" :value="price" @input="updatePrice($event)"></MoneyInput>

              <v-combobox
                  :items="categories"
                  label="Category"
                  :value="category"
                  @input="updateCategory($event)"
              ></v-combobox>

              <div>
                <side-dishes ref="sideDishesElement"></side-dishes>
              </div>
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
  import DishesApiConnector from "../../lib/DishesApiConnector"
  import ApiConnector from "../../lib/ApiConnector"
  import ErrorsComponent from '../commons/Errors.vue'
  import SideDishes from './components/SideDishes.vue'
  import MoneyInput from "../commons/MoneyInput";
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from 'vue'
  import Component from 'vue-class-component'
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
    @Prop(String) restaurantName: string;

    restaurantId = "";
    name = "";
    price = 0;
    category = "";
    categories = [];

    connector: DishesApiConnector;

    mounted() {
      this.restaurantId = this.$route.params.id;
      this.connector = new DishesApiConnector(this.$store);

      this.connector.getDishCreateData(this.restaurantId)
        .then(response => {
          this.categories = response.categories;
          document.title = `Create new dish | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }

    submitForm() {
      let sideDishesElement: SideDishes = this.$refs.sideDishesElement;
      let sideDishes = sideDishesElement.getSideDishes();

      const dishPayload = {
        "restaurant.id": this.restaurantId,
        name: this.name,
        price: this.price,
        category: this.category,
        sideDishes: sideDishes
      };

      this.connector.createDish(this.restaurantId, dishPayload)
        .then(() => this.$router.push(this.getBackUrl()))
        .catch(errResponse => ApiConnector.handleError(errResponse));

      return false;
    }

    getBackUrl() {
      if (typeof this.$route.query.addingToOrderId !== "undefined" && this.$route.query.addingToOrderId.length > 0) {
        return `/orders/${this.$route.query.addingToOrderId}/create_entry`
      } else {
        return `/restaurants/show/${this.restaurantId}`
      }
    }

    updateName(newValue) {
      this.name = newValue;
    }

    updatePrice(newValue) {
      this.price = newValue;
    }

    updateCategory(newValue) {
      this.category = newValue;
    }

  }
</script>

<style scoped>
  .row {
    margin-top: 2rem;
  }
</style>