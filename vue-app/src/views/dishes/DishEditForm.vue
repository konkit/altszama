<template>
  <ViewWrapper title="Edit dish" :backpath="`#/restaurants/show/${restaurantId}`">
    <LoadingView>
      <v-container>
        <errors-component/>

        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <input type="hidden" name="restaurant.id" :value="restaurantId"/>
                <input type="hidden" name="id" :value="dishId"/>

                <v-text-field label="Name" :value="name" @input="updateName($event)" required=""></v-text-field>

                <MoneyInput label="Price" :value="price" @input="updatePrice($event)"></MoneyInput>

                <v-combobox
                    :items="categories"
                    label="Category"
                    :value="category"
                    @input="updateCategory($event)"
                ></v-combobox>

                <div>
                  <side-dishes ref="sideDishesElement" :initialSideDishes="initialSideDishes"></side-dishes>
                </div>

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
  import ErrorsComponent from '../commons/Errors'
  import SideDishes from './components/SideDishes.vue'
  import LoadingView from "../commons/LoadingView";
  import MoneyInput from "../commons/MoneyInput";
  import ViewWrapper from "../commons/ViewWrapper";
  import ApiConnector from "../../lib/ApiConnector";
  import DishesApiConnector from "../../lib/DishesApiConnector";
  import Component from 'vue-class-component'
  import Vue from "vue"
  import router from '../../router/index'

  const connector = new DishesApiConnector();

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
    categories = [];
    initialSideDishes = [];

    mounted() {
      this.restaurantId = this.$route.params.id;
      this.dishId = this.$route.params.dishId;

      const connector = new DishesApiConnector();
      connector.getDishEditData(this.restaurantId, this.dishId)
        .then(dishData => {
          this.name = dishData.dish.name;
          this.price = dishData.dish.price;
          this.category = dishData.dish.category;

          this.initialSideDishes = dishData.dish.sideDishes;
          this.categories = dishData.categories;

          this.$store.commit('setLoadingFalse');

          document.title = `Edit dish | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))

    }

    submitForm() {
      let dish = {
        name: this.name,
        price: this.price,
        category: this.category
      };
      let sideDishesElement: SideDishes = this.$refs.sideDishesElement;
      let sideDishes = sideDishesElement.getSideDishes();

      const dishObj = {
        id: this.dishId,
        name: dish.name,
        price: dish.price,
        category: dish.category,
        sideDishes: sideDishes
      };

      connector.editDish(this.restaurantId, dishObj)
        .then(() => router.push("/restaurants/show/" + this.restaurantId))
        .catch(errResponse => ApiConnector.handleError(errResponse));

      return false;
    }

    // addSideDish() {
    //   const newSideDish = {
    //     name: this.newSideDishName,
    //     price: this.newSideDishPrice
    //   };
    //
    //   this.sideDishes.push(newSideDish)
    // }

    // removeSideDish(sideDishId) {
    //   this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId)
    // }

    updateName(newValue) {
      this.name = newValue;
    }

    updatePrice(newValue) {
      this.price = newValue
    }

    updateCategory(newValue) {
      this.category = newValue;
    }
  }
</script>

<style scoped>
</style>