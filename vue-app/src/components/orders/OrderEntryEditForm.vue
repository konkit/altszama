<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button :href="'#/orders/show/' + this.order.id"></back-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Edit entry for {{this.order.restaurant.name}} ({{this.order.orderDate}})</h1>
          </div>
        </div>
      </div>

      <errors-component ref="errorsComponent" />

      <div v-if="this.allDishesInRestaurant.length > 0">

        <order-entry-form 
          :order-entry="orderEntry"
          :orderId="order.id"
          :restaurantId="order.restaurant.id"
          :allDishesInRestaurant="allDishesInRestaurant" 
          :allDishesByCategory="allDishesByCategory" 
          :dishIdToSideDishesMap="dishIdToSideDishesMap"
          />


        <div class="container">
          <div class="row justify-content-center">
            <div class="col">
              <button class="btn btn-block btn-success" @click="submitForm">
                Update order
              </button>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BackButton from '../commons/backButton.vue'
import ErrorsComponent from '../commons/errors.vue'
import Spinner from '../commons/spinner.vue'
import Price from '../commons/priceElement.vue'
import OrderEntryForm from './components/OrderEntryForm.vue'
import ApiConnector from '../../ApiConnector.js'

export default {
  name: 'order-entry-edit-form',
  data () {
    return {
      orderEntryId: this.$route.params.entryId,
      dishEntryId: this.$route.params.dishEntryId,
      
      order: {},
      allDishesInRestaurant: [],
      allDishesByCategory: [],
      dishIdToSideDishesMap: {},

      orderEntry: {}
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/order_entries/" + this.orderEntryId + "/dish_entry/" + this.dishEntryId + "/edit_entry.json")
      .then(response => {
        this.order = response.data.order;

        this.allDishesInRestaurant = response.data.allDishesInRestaurant;
        this.allDishesByCategory = convertToMapEntries(response.data.allDishesByCategory);
        this.dishIdToSideDishesMap = response.data.dishIdToSideDishesMap;
        
        this.orderEntry = {
          orderId: this.order.id,
          dishId: response.data.dishEntry.dish.id,
          additionalComments: response.data.dishEntry.additionalComments,
          newDish: false,
          newDishName: "",
          newDishPrice: "",
          chosenSideDishes: response.data.dishEntry.chosenSideDishes || []
        }

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();
      
      const action = "/order_entries/update";
      const dataSuccessUrl = "#/orders/show/" + this.order.id;

      let errorsComponent = this.$refs.errorsComponent;

      let formData = {
        id: this.orderEntryId,
        orderId: this.order.id,
        dishEntryId: this.dishEntryId,
        dishId: this.orderEntry.dishId,
        newDish: this.orderEntry.newDish,
        newDishName: this.orderEntry.newDishName,
        newDishPrice: Math.round(this.orderEntry.newDishPrice * 100),
        additionalComments: this.orderEntry.additionalComments,
        sideDishes: this.orderEntry.chosenSideDishes.map(sd => Object.assign(sd, { newSideDishPrice: Math.round(sd.newSideDishPrice * 100) }))
      };

      console.log(JSON.stringify(formData.sideDishes))

      ApiConnector.makePost(action, formData)
        .then(function (response) {
            window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
            console.log("orderEntryEditForm Error:")
            console.log(error)
            error.body.messages.forEach(msg => errorsComponent.addError(msg));
        });

      return false;
    },
    goToCreateDish: function(restaurantId) {
      window.location = "#/restaurants/" + restaurantId + "/dishes/create"
    },
    goToCreateSideDish: function(restaurantId) {
      window.location = "#/restaurants/" + restaurantId + "/side_dishes/create"
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading;
    }
  },
  components: {
    BackButton,
    ErrorsComponent,
    Price,
    Spinner,
    OrderEntryForm
  }
}

function convertToMapEntries(dishesMap) {
  var result = []
  
  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
}
</script>

<style scoped>
  .container {
    max-width: 900px;
  }

  .row {
    margin-top: 2rem;
  }
</style>