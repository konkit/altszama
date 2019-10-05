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
  import BackButton2 from '../commons/BackButton2'
  import ErrorsComponent from '../commons/Errors'
  import Price from '../commons/PriceElement'
  import SideDishes from './components/SideDishes.vue'
  import LoadingView from "../commons/LoadingView";
  import {mapState} from "vuex"
  import {
    INIT_EDIT_DISH_ACTION,
    UPDATE_CATEGORY,
    UPDATE_DISH_ACTION,
    UPDATE_NAME,
    UPDATE_PRICE
  } from "../../store/modules/EditDishState"
  import MoneyInput from "../commons/MoneyInput";
  import ViewWrapper from "../commons/ViewWrapper";

  export default {
    data() {
      return {
        restaurantId: this.$route.params.id,
        dishId: this.$route.params.dishId,
      }
    },
    mounted() {
      this.$store.dispatch(`editDish/${INIT_EDIT_DISH_ACTION}`, {restaurantId: this.restaurantId, dishId: this.dishId})
    },
    methods: {
      submitForm() {
        let sideDishes = this.$refs.sideDishesElement.getSideDishes();

        this.$store.dispatch(`editDish/${UPDATE_DISH_ACTION}`, {sideDishes: sideDishes});

        return false;
      },
      addSideDish() {
        const newSideDish = {
          name: this.newSideDishName,
          price: this.newSideDishPrice
        };

        this.sideDishes.push(newSideDish)
      },
      removeSideDish(sideDishId) {
        this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId)
      },
      updateName(newValue) {
        this.$store.commit(`editDish/${UPDATE_NAME}`, newValue)
      },
      updatePrice(newValue) {
        this.$store.commit(`editDish/${UPDATE_PRICE}`, newValue)
      },
      updateCategory(newValue) {
        this.$store.commit(`editDish/${UPDATE_CATEGORY}`, newValue)
      }
    },
    computed: {
      ...mapState("editDish", [
        'categories',
        'initialSideDishes',
        'name',
        'price',
        'category'
      ])
    },
    components: {
      ViewWrapper,
      MoneyInput,
      LoadingView,
      BackButton2,
      ErrorsComponent,
      Price,
      SideDishes
    }
  }
</script>

<style scoped>
</style>