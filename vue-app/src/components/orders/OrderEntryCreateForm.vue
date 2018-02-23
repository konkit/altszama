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

      <div class="container">
        <div v-if="this.allDishesInRestaurant.length > 0">

          <div class="row justify-content-center">
            <div class="col-8">

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
            </div>

            <div class="col-4">
              <h3>&nbsp;</h3>
              <p>Can't find your dish ? <button class="btn btn-link" v-on:click="this.goToCreateDish">Add one now! &nbsp;</button></p>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-8">
              <div class="form-group">
                <div>
                  <h4>Side dishes</h4>

                  <div v-if="this.chosenSideDishes.length > 0"> 
                    <p v-for="sideDish in this.chosenSideDishes" v-bind:key="sideDish.id">
                      {{sideDish.name}}&nbsp;( <price v-bind:data-price="sideDish.price" /> )

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

                  <div v-if="this.sideDishFormVisible === true">
                    <select class="form-control" name="sideDishId" required="" v-model="sideDishIdToAdd">
                      <option v-for="sideDish in this.dishIdToSideDishesMap[this.dishId]" v-bind:key="sideDish.id" v-bind:value="sideDish.id">
                        {{sideDish.name}}&nbsp;( <price v-bind:data-price="sideDish.price" /> )
                      </option>
                    </select>

                    <div class="input-group">
                      <button class="btn btn-success" v-on:click="addSideDish">
                        Add &nbsp; <i class="fa fa-plus" />
                      </button>
                      
                      <button class="btn btn-secondary" v-on:click="setSideDishFormVisible(false)">
                        Cancel
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="col-4">
              <h3>&nbsp;</h3>
              <p>
                Can't find your favourite sidedish ? 
                <button class="btn btn-link" v-on:click="this.goToCreateDish">Add one now! &nbsp;</button>
              </p>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col">
              <div class="form-group">
                <h4>Additional Comments</h4>
                <textarea class="form-control" name="additionalComments" value="" id="additionalComments" v-model="additionalComments" />
              </div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col">
              <button v-on:click="this.submitForm" class="btn btn-block btn-success">
                Add your order &nbsp; <i class="fa fa-plus" />
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="row justify-content-center">
            <div class="col">
              <h4>Sorry, there are no dishes in {{this.order.restaurant.name}}</h4>
              
              <div>
                <button class="btn btn-success" v-on:click="this.goToCreateDish">
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
    ApiConnector.makeGet("/orders/" + this.orderId + "/create_entry.json")
      .then(response => {
        this.order = response.data.order;

        this.allDishesInRestaurant = response.data.allDishesInRestaurant;
        this.allDishesByCategory = convertToMapEntries(response.data.allDishesByCategory);
        this.dishIdToSideDishesMap = response.data.dishIdToSideDishesMap;

        console.log(this.allDishesByCategory);

        if (this.allDishesInRestaurant.length > 0) {
          this.dishId = this.allDishesInRestaurant[0].id;
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

      console.log(this.chosenSideDishes)

      let formData = {
        orderId: this.orderId,
        dishId: this.dishId,
        additionalComments: this.additionalComments,
        sideDishesIds: this.chosenSideDishes.map(sd => sd.id)
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
    },
    goToCreateSideDish: function(restaurantId) {
      window.location = "#/restaurants/" + this.order.restaurant.id + "/side_dishes/create"
    },
    clearSideDishes: function() {
      this.chosenSideDishes = []
    },
    addSideDish: function() {
      let sideDishToAdd = this.dishIdToSideDishesMap[this.dishId].find(sd => sd.id === this.sideDishIdToAdd);

      if (sideDishToAdd) {
        this.chosenSideDishes.push(sideDishToAdd);  
      }
      
      this.setSideDishFormVisible(false);
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