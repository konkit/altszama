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

<script>
  import ErrorsComponent from '../commons/Errors'
  import SideDishes from './components/SideDishes.vue'
  import LoadingView from "../commons/LoadingView";
  import MoneyInput from "../commons/MoneyInput";
  import ViewWrapper from "../commons/ViewWrapper";
  import ApiConnector from "../../lib/ApiConnector";
  import DishesApiConnector from "../../lib/DishesApiConnector";
  import Component from 'vue-class-component'
  import Vue from "vue"

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
    restaurantId = this.$route.params.id;
    dishId = this.$route.params.dishId;
    name = "";
    price = 0;
    category = "";
    categories = [];
    initialSideDishes = [];

    mounted() {
      DishesApiConnector.getDishEditData(this.restaurantId, this.dishId)
        .then(dishData => {
          this.$store.commit('setLoadingFalse');

          this.name = dishData.name;
          this.price = dishData.price;
          this.category = dishData.category;

          this.initialSideDishes = dishData.initialSideDishes;
          this.categories = dishData.categories;

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
      let sideDishes = this.$refs.sideDishesElement.getSideDishes();

      const dishObj = {
        id: this.dishId,
        name: dish.name,
        price: dish.price,
        category: dish.category,
        sideDishes: sideDishes
      };

      DishesApiConnector.editDish(this.restaurantId, dishObj)
        .catch(errResponse => ApiConnector.handleError(errResponse))

      return false;
    }

    addSideDish() {
      const newSideDish = {
        name: this.newSideDishName,
        price: this.newSideDishPrice
      };

      this.sideDishes.push(newSideDish)
    }

    removeSideDish(sideDishId) {
      this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId)
    }

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