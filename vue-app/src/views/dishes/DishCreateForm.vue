<template>
  <ViewWrapper :title="`Create dish`" :backpath="getBackUrl()">
    <v-container fluid>
      <v-layout align-center justify-center>
        <v-flex xs10>
          <v-card>
            <v-card-text>
              <errors-component/>

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
        </v-flex>
      </v-layout>
    </v-container>
  </ViewWrapper>
</template>

<script>
  import BackButton2 from '../commons/BackButton2.vue'
  import ErrorsComponent from '../commons/Errors.vue'
  import Price from '../commons/PriceElement.vue'
  import SideDishes from './components/SideDishes.vue'
  import {mapState} from "vuex"
  import {
    UPDATE_NAME,
    UPDATE_PRICE,
    UPDATE_CATEGORY,
    INIT_ACTION,
    SAVE_DISH_ACTION
  } from "../../store/modules/CreateDishState"
  import MoneyInput from "../commons/MoneyInput";
  import ViewWrapper from "../commons/ViewWrapper";

  export default {
    props: ['restaurantName'],
    data() {
      return {
        restaurantId: this.$route.params.id,
      }
    },
    mounted() {
      this.$store.dispatch(`createDish/${INIT_ACTION}`, {restaurantId: this.restaurantId})
    },
    methods: {
      submitForm() {
        let sideDishes = this.$refs.sideDishesElement.getSideDishes();

        this.$store.dispatch(`createDish/${SAVE_DISH_ACTION}`, {sideDishes: sideDishes, backUrl: this.getBackUrl()});

        return false;
      },
      getBackUrl() {
        if (typeof this.$route.query.addingToOrderId !== "undefined" && this.$route.query.addingToOrderId.length > 0) {
          return "/orders/" + this.$route.query.addingToOrderId + "/create_entry"
        } else {
          return "/restaurants/show/" + this.restaurantId
        }
      },
      updateName(newValue) {
        this.$store.commit(`createDish/${UPDATE_NAME}`, newValue)
      },
      updatePrice(newValue) {
        this.$store.commit(`createDish/${UPDATE_PRICE}`, newValue)
      },
      updateCategory(newValue) {
        this.$store.commit(`createDish/${UPDATE_CATEGORY}`, newValue)
      }
    },
    computed: {
      ...mapState("createDish", [
        'categories',
        'name',
        'price',
        'category'
      ])
    },
    components: {
      ViewWrapper,
      MoneyInput,
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