<template>
  <tr>
    <template v-if="this.loadingEntry === false">
      <errors-component ref="errorsComponent" />

      <td v-if="entriesIndex == 0" :rowspan="rowspan">
        {{username}}
      </td>

      <td>
        <order-entry-input 
          :editedOrderEntry="createdOrderEntry" 
          :allDishesByCategory="allDishesByCategory" 
          @clearSideDishes="clearSideDishes"
          @setNewDishFlag="setNewDishFlag" />

        <side-dishes-input 
          :editedOrderEntry="createdOrderEntry" 
          :dishIdToSideDishesMap="dishIdToSideDishesMap" />
        
        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" v-model="createdOrderEntry.additionalComments" value="" />
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

import OrderEntryInput from './OrderEntryInput.vue'
import SideDishesInput from './SideDishesInput.vue'

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
    setNewDishFlag: function(newDishValue) {
      this.createdOrderEntry.newDish = newDishValue;
      if (newDishValue == true) {
        this.createdOrderEntry.dishId = ""
      }
    },
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
    OrderEntryInput,
    SideDishesInput
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
