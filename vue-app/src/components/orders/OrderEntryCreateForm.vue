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
            <h1>Add to order from {{this.order.restaurant.name}} ({{this.order.orderDate}})</h1>

            <p><b>Link to menu:</b> <a target="_blank" :href="order.restaurant.url">{{this.order.restaurant.url}}</a></p>
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
              <button @click="this.submitForm" class="btn btn-block btn-success">
                Add your order &nbsp; <i class="fa fa-plus" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col">
              <h4>Sorry, there are no dishes in {{this.order.restaurant.name}}</h4>
              
              <div>
                <button class="btn btn-success" @click="this.goToCreateDish">
                  Add first dish now &nbsp; <i class="fa fa-plus" />
                </button>
              </div>
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
import Price from '../commons/priceElement.vue'
import OrderEntryForm from './components/OrderEntryForm.vue'
import Spinner from '../commons/spinner.vue'

import ApiConnector from '../../ApiConnector.js'

export default {
  name: 'order-entry-create-form',
  data () {
    return {
      orderId: this.$route.params.id,

      allDishesInRestaurant: [],
      allDishesByCategory: [],
      dishIdToSideDishesMap: {},
      chosenSideDishes: [],
      order: {},

      orderEntry: {},
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/orders/" + this.orderId + "/create_entry.json")
      .then(response => {
        this.order = response.data.order;

        this.allDishesInRestaurant = response.data.allDishesInRestaurant;
        this.allDishesByCategory = convertToMapEntries(response.data.allDishesByCategory);
        this.dishIdToSideDishesMap = response.data.dishIdToSideDishesMap;

        console.log(this.allDishesByCategory);

        var dishId;
        if (this.allDishesInRestaurant.length > 0) {
          dishId = this.allDishesInRestaurant[0].id;
        } else {
          dishId = null
        }

        this.orderEntry = {
          orderId: response.data.order.id,
          dishId: dishId,
          additionalComments: '',
          chosenSideDishes: []
        }

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();

      const action = "/order_entries/save";
      const dataSuccessUrl = "#/orders/show/" + this.order.id;

      let errorsComponent = this.$refs.errorsComponent;

      // console.log(this.chosenSideDishes)

      let formData = {
        orderId: this.orderId,
        dishId: this.orderEntry.dishId,
        additionalComments: this.orderEntry.additionalComments,
        sideDishes: this.orderEntry.chosenSideDishes //.map(sd => sd.id)
      };

      ApiConnector.makePost(action, formData)
        .then(function (response) {
            window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
            console.log("orderEntryCreateForm Error:");
            console.log(error);
            error.body.messages.forEach(msg => errorsComponent.addError(msg));
        });

      return false;
    },
    goToCreateDish: function(restaurantId) {
      window.location = "#/restaurants/" + this.order.restaurant.id + "/dishes/create?addingToOrderId=" + this.orderId
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