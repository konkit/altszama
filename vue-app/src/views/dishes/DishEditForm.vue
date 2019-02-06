<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 :href="'#/restaurants/show/' + restaurantId"></back-button2>

      <v-toolbar-title>
        Edit dish
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <errors-component />

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
                <v-btn color="success" @click="submitForm">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </LoadingView>
</template>

<script>
  import BackButton2 from '../../components/commons/BackButton2'
  import ErrorsComponent from '../../components/commons/Errors'
  import Price from '../../components/commons/PriceElement'
  import SideDishes from '../../components/restaurants/SideDishes.vue'
  import LoadingView from "../../components/commons/LoadingView";
  import {mapState} from "vuex"
  import {
    INIT_EDIT_DISH_ACTION,
    UPDATE_CATEGORY,
    UPDATE_DISH_ACTION,
    UPDATE_NAME,
    UPDATE_PRICE
  } from "../../store/modules/EditDishState"
  import MoneyInput from "../../components/commons/MoneyInput";

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
      submitForm () {
        let sideDishes = this.$refs.sideDishesElement.getSideDishes();

        this.$store.dispatch(`editDish/${UPDATE_DISH_ACTION}`, {sideDishes: sideDishes});

        return false;
      },
      addSideDish () {
        const newSideDish = {
          name: this.newSideDishName,
          price: Math.round(this.newSideDishPrice * 100)
        };

        this.sideDishes.push(newSideDish)
      },
      removeSideDish (sideDishId) {
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
  .row {
    margin-top: 2rem;
  }
</style>