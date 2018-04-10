<template>
  <tr>
    <template v-if="this.loadingEntry === false">
    <errors-component ref="errorsComponent" />

    <td v-if="entriesIndex == 0" :rowspan="rowspan">
      {{username}}
    </td>

    <td>
      <div v-if="!createdOrderEntry.newDish">
        <h4>Dish</h4>
        <div class="input-group">
          <select class="form-control existing-dish-dropdown" required="" id="dish" v-model="createdOrderEntry.dishId" @change="clearSideDishes">
            <optgroup v-for='(dishEntry, i) in this.allDishesByCategory' :key='i' :label="dishEntry.category">
              <option v-for='(dish, i) in dishEntry.dishes' :key='i' :value="dish.id">
                {{ dish.name }}&nbsp;( <price :data-price="dish.price" /> )
              </option>
            </optgroup>
          </select>

          <button class="btn btn-link" @click="setNewDishFlag(true)">Type your own dish! &nbsp;</button>
        </div>
      </div>

      <div v-if="createdOrderEntry.newDish">
        <h4>Dish</h4>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="New dish name" id="newDishName" v-model="createdOrderEntry.newDishName" />
          
          <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="createdOrderEntry.newDishPrice" :precision="2" class="form-control" required=""></vue-numeric>

          <button class="btn btn-link" @click="setNewDishFlag(false)">Select dish from list &nbsp;</button>
        </div>
      </div>

      <div class="form-group">
        <div>
          <h4>Side dishes</h4>

          <div v-if="createdOrderEntry.chosenSideDishes.length > 0">
            <div v-for="(sideDish, sdIndex) in createdOrderEntry.chosenSideDishes" :key="sdIndex">

              <div class="input-group" v-if="sideDish.isNew == true">
                <input type="text" class="form-control" placeholder="New dish name" id="newDishName" v-model="sideDish.newSideDishName" />
                <vue-numeric 
                  currency="zł" 
                  separator="." 
                  currency-symbol-position="suffix" 
                  v-model="sideDish.newSideDishPrice" 
                  :precision="2" 
                  class="form-control" 
                  required="">
                </vue-numeric>
                
                <button class="btn btn-danger" @click="removeSideDish(createdOrderEntry.chosenSideDishes[sdIndex].id)"><span class="fa fa-remove" /></button>

                <button class="btn btn-link" @click="setAsExistingSideDish(sdIndex)">Select side dish from the list</button>
              </div>

              <div class="input-group" v-if="sideDish.isNew == false || sideDish.isNew == null">
                <select class="form-control" name="sideDishId" required="" v-model="createdOrderEntry.chosenSideDishes[sdIndex]">
                  <option v-for="sideDish in dishIdToSideDishesMap[createdOrderEntry.dishId]" :value="sideDish">
                    {{sideDish.name}} &nbsp; ( <price :data-price="sideDish.price" /> )
                  </option>
                </select>

                <button class="btn btn-danger" @click="removeSideDish(createdOrderEntry.chosenSideDishes[sdIndex].id)"><span class="fa fa-remove" /></button>

                <button class="btn btn-link" @click="setAsNewSideDish(sdIndex)">Type your own side dish</button>
              </div>
            </div>
          </div>
          <div v-else>
            <p>No side dishes selected</p>
          </div>

          <button class="btn btn-success" @click="addSideDishEntry()">
            Add side dish &nbsp; <i class="fa fa-plus" />
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <h4>Additional Comments</h4>
        <textarea class="form-control" name="additionalComments" value="" id="additionalComments" v-model="createdOrderEntry.additionalComments" />
      </div>

      <button class="btn btn-block btn-success" @click="submitForm">
        Save order
      </button>
    </td>

    <td>
      <button type="button" class="btn btn-light" @click="cancelEdit()">
        Cancel
      </button>
    </td>

    </template>

    <template v-if="this.loadingEntry === true">
      <td colspan=3>
        <div class="justify-content-center">
          <spinner></spinner>
        </div>
      </td>
    </template>
  </tr>
</template>

<script>
import Vue from 'vue'

import BackButton from '../../commons/backButton.vue'
import ErrorsComponent from '../../commons/errors.vue'
import Spinner from '../../commons/spinner.vue'
import Price from '../../commons/priceElement.vue'

import OrderEntryForm from '../components/OrderEntryForm.vue'

import ApiConnector from '../../../ApiConnector.js'


export default {
  name: 'order-entry-create-entry',
  props: ['orderId', 'username', 'entriesIndex', 'rowspan'],
  data () {
    return {
      allDishesInRestaurant: [],
      allDishesByCategory: [],
      dishIdToSideDishesMap: {},
      order: {},

      createdOrderEntry: {},
    }
  },
  created() {
    this.$store.commit('setEntryLoadingTrue')
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

        this.createdOrderEntry = {
          orderId: response.data.order.id,
          dishId: dishId,
          additionalComments: '',
          newDish: false,
          newDishName: "",
          newDishPrice: "",
          chosenSideDishes: []
        }

        this.$store.commit('setEntryLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();

      const action = "/order_entries/save";
      const dataSuccessUrl = "#/orders/show/" + this.order.id;

      let errorsComponent = this.$refs.errorsComponent;

      let formData = {
        orderId: this.orderId,
        dishId: this.createdOrderEntry.dishId,
        newDish: this.createdOrderEntry.newDish,
        newDishName: this.createdOrderEntry.newDishName,
        newDishPrice: Math.round(this.createdOrderEntry.newDishPrice * 100),
        additionalComments: this.createdOrderEntry.additionalComments,
        sideDishes: this.createdOrderEntry.chosenSideDishes.map(sd => Object.assign(sd, { newSideDishPrice: Math.round(sd.newSideDishPrice * 100) }))
      };

      ApiConnector.makePost(action, formData)
        .then(function (response) {
          console.log("Submit sucessful, redirect to " + dataSuccessUrl)
          window.location.reload();
        })
        .catch(function(error) {
            console.log("orderEntryCreateForm Error:");
            console.log(error);
            error.body.messages.forEach(msg => errorsComponent.addError(msg));
        });

      return false;
    },
    cancelEdit: function() {
      this.$emit("cancelEdit")
    },

    clearSideDishes: function() {
      this.createdOrderEntry.chosenSideDishes = []
    },
    removeSideDish: function(sideDishId) {
      console.log("Removing side dishes, id: " + sideDishId + " before: " + this.createdOrderEntry.chosenSideDishes)

      this.createdOrderEntry.chosenSideDishes = this.createdOrderEntry.chosenSideDishes.filter(sd => sd.id !== sideDishId)
      this.$forceUpdate();
      
      console.log("After sidedishes: " + this.createdOrderEntry.chosenSideDishes)
    },
    setNewDishFlag: function(newDishValue) {
      this.createdOrderEntry.newDish = newDishValue;
    },
    addSideDishEntry: function() {
      var sideDishesForGivenDish = this.dishIdToSideDishesMap[this.createdOrderEntry.dishId];
      var sideDishToAdd;

      if (sideDishesForGivenDish.length > 0) {
        var firstSD = sideDishesForGivenDish[0]
        sideDishToAdd = { isNew: false, id: firstSD.id, name: firstSD.name, price: firstSD.price }
      } else {
        sideDishToAdd = {}
        sideDishToAdd.isNew = true
      }
      
      sideDishToAdd.newSideDishName = ""
      sideDishToAdd.newSideDishPrice = 0

      this.createdOrderEntry.chosenSideDishes.push(sideDishToAdd) // = this.orderEntry.chosenSideDishes + sideDishToAdd
    },
    setAsNewSideDish: function(sideDishIndex) {
      this.createdOrderEntry.chosenSideDishes = this.createdOrderEntry.chosenSideDishes.map((sd, i) => {
        var newSd = {}
        if (i === sideDishIndex) {
          sd.isNew = true
          newSd = sd
        } else {
          newSd = sd
        }

        return newSd
      })
    },
    setAsExistingSideDish: function(sideDishIndex) {
      this.createdOrderEntry.chosenSideDishes = this.createdOrderEntry.chosenSideDishes.map((sd, i) => {
        var newSd = {}
        if (i === sideDishIndex) {
          sd.isNew = false
          newSd = sd
        } else {
          newSd = sd
        }

        return newSd
      })
    }
  },
  computed: {
    loadingEntry () {
      return this.$store.state.loadingEntry;
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

  .existing-dish-dropdown {
    max-width: 500px;
  }
</style>
