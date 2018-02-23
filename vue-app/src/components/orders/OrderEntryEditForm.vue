<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button v-bind:href="'#/orders/show/' + this.order.id"></back-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Edit entry for {{order.restaurant.name}} ({{order.orderDate}})</h1>
          </div>
        </div>
      </div>

      <errors-component ref="errorsComponent" />

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-8">
            <form id="order-entry-edit-form">
              <input type="hidden" name="orderId" v-bind:value="order.id" />
              <input type="hidden" name="id" v-bind:value="orderEntry.id" />
              <input type="hidden" name="userId" v-bind:value="orderEntry.user.id" />

              <div class="form-group">
                <h4>Dish</h4>

                <select class="form-control" name="dishId" required="" id="dish" v-model="dishId" @change="clearSideDishes">
                  <optgroup v-for='(dishEntry, i) in this.allDishesByCategory' :key='i' :label="dishEntry.category">
                    <option v-for='(dish, i) in dishEntry.dishes' :key='i' :value="dish.id">
                      {{dish.name}}&nbsp;( <price :data-price="dish.price" /> )
                    </option>
                  </optgroup>
                </select>
              </div>

            </form>

            <div>
              <h4>Side dishes</h4>

              <div v-if="this.chosenSideDishes.length > 0">
                <p v-for="sideDish in this.chosenSideDishes" v-bind:key="sideDish.id">
                  {{ sideDish.name }}&nbsp;( <price v-bind:data-price="sideDish.price" /> )

                  <span class="fa fa-remove" v-on:click="removeSideDish(sideDish.id)"></span>
                </p>
              </div>
              <div v-else>
                <p>No side dishes selected</p>
              </div>

              <div v-if="this.sideDishFormVisible === false">
                <button class="btn btn-success" v-on:click="setSideDishFormVisible(true)">
                  Add side dish &nbsp; <i class="fa fa-plus" />
                </button>
              </div>

              <div class="input-group" v-if="this.sideDishFormVisible === true">
                <select class="form-control" name="sideDishId" required="" v-model="sideDishIdToAdd">
                  <option v-for="sideDish in this.dishIdToSideDishesMap[this.dishId]" v-bind:key="sideDish.id" v-bind:value="sideDish.id">
                    {{sideDish.name}}&nbsp;( <price v-bind:data-price="sideDish.price" /> )
                  </option>
                </select>

                <button class="btn btn-success" v-on:click="addSideDish">
                  Add &nbsp; <i class="fa fa-plus" />
                </button>

                <button class="btn btn-secondary" v-on:click="setSideDishFormVisible(false)">
                  Cancel
                </button>
              </div>

            </div>

            <div class="form-group">
              <h4>Additional Comments</h4>
              <input class="form-control" name="additionalComments" id="additionalComments" v-model="additionalComments" />
            </div>

            <button class="btn btn-block btn-success" v-on:click="submitForm">
              Update order
            </button>
          </div>

          <div class="col-4">
            <h4>Dish you wanted isn't there ?</h4>
            
            <p>
              <button class="btn btn-success" v-on:click="this.goToCreateDish">
                Add one now &nbsp; <i class="fa fa-plus" />
              </button>
            </p>
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

import ApiConnector from '../../ApiConnector.js'

export default {
  name: 'order-entry-edit-form',
  data () {
    return {
      orderEntryId: this.$route.params.entryId,

      orderEntry: {},
      order: {},

      allDishesInRestaurant: [],
      allDishesByCategory: [],
      dishIdToSideDishesMap: {},
      chosenSideDishes: [],

      orderId: '',
      dishId: '',
      additionalComments: '',

      sideDishIdToAdd: '',
      sideDishFormVisible: false
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/order_entries/" + this.orderEntryId + "/edit_entry.json")
      .then(response => {
        this.order = response.data.order;
        this.orderEntry = response.data.orderEntry;
        
        this.orderId = this.order.id;
        this.dishId = this.orderEntry.dish.id;
        this.additionalComments = this.orderEntry.additionalComments;

        this.allDishesInRestaurant = response.data.allDishesInRestaurant;
        this.allDishesByCategory = convertToMapEntries(response.data.allDishesByCategory);
        this.dishIdToSideDishesMap = response.data.dishIdToSideDishesMap;

        console.log("sideDishes: ", this.orderEntry.chosenSideDishes)

        this.chosenSideDishes = this.orderEntry.chosenSideDishes || [];

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
        id: this.orderEntry.id,
        orderId: this.order.id,
        dishId: this.dishId,
        additionalComments: this.additionalComments,
        sideDishesIds: this.chosenSideDishes.map(sd => sd.id)
      };

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
    isSelected: function(currentDishId) {
      return currentDishId === this.orderEntry.dish.id;
    },
    goToCreateDish: function(restaurantId) {
      window.location = "#/restaurants/" + this.order.restaurant.id + "/dishes/create"
    },
    goToCreateSideDish: function(restaurantId) {
      window.location = "#/restaurants/" + this.order.restaurant.id + "/side_dishes/create"
    },
    clearSideDishes: function() {
      this.chosenSideDishes = []
    },
    addSideDish: function() {
      var sideDishToAdd = this.dishIdToSideDishesMap[this.dishId].find(sd => sd.id == this.sideDishIdToAdd)

      this.chosenSideDishes.push(sideDishToAdd)
      this.setSideDishFormVisible(false)
    },
    removeSideDish: function(sideDishId) {
      this.chosenSideDishes = this.chosenSideDishes.filter(sd => sd.id !== sideDishId)
    },
    setSideDishFormVisible: function(isVisible) {
      this.sideDishFormVisible = isVisible;
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
    Spinner
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