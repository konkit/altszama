<template>
  <div class="wrapper">
    <template v-if="this.loadingEntry === false">
      <errors-component ref="errorsComponent" />

      <div class="pull-right">
        <button type="button" class="btn btn-light" @click="cancelEdit()">
          Cancel
        </button>
      </div>

      <div>
        <order-entry-input :editedOrderEntry="editedOrderEntry" :allDishesByCategory="allDishesByCategory" @clearSideDishes="clearSideDishes" />

        <side-dishes-input :editedOrderEntry="editedOrderEntry" :dishIdToSideDishesMap="dishIdToSideDishesMap" />
        
        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" name="additionalComments" value="" id="additionalComments" v-model="editedOrderEntry.additionalComments" />
        </div>

        <button class="btn btn-block btn-success" @click="submitForm">
          Update order
        </button>
      </div>

    </template>

    <template v-if="this.loadingEntry === true">
      <div class="justify-content-center">
        <spinner></spinner>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import BackButton from '../../commons/backButton.vue'
import ErrorsComponent from '../../commons/errors.vue'
import Spinner from '../../commons/spinner.vue'
import Price from '../../commons/priceElement.vue'
import ApiConnector from '../../../ApiConnector.js'

import OrderEntryInput from './OrderEntryInput.vue'
import SideDishesInput from './SideDishesInput.vue'

export default {
  name: 'order-entry-edit-entry',
  props: ['orderEntry', 'dishEntry'],
  data () {
    return {
      order: {},
      allDishesInRestaurant: [],
      allDishesByCategory: [],
      dishIdToSideDishesMap: {},

      editedOrderEntry: {}
    }
  },
  created() {
    this.$store.commit('setEntryLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/order_entries/" + this.orderEntry.id + "/dish_entry/" + this.dishEntry.id + "/edit_entry.json")
      .then(response => {
        this.order = response.data.order;

        this.allDishesInRestaurant = response.data.allDishesInRestaurant;
        this.allDishesByCategory = convertToMapEntries(response.data.allDishesByCategory);
        this.dishIdToSideDishesMap = response.data.dishIdToSideDishesMap;

        this.editedOrderEntry = {
          id: response.data.dishEntry.id,
          orderId: this.order.id,
          dishId: response.data.dishEntry.dish.id,
          additionalComments: response.data.dishEntry.additionalComments,
          newDish: false,
          newDishName: "",
          newDishPrice: "",
          chosenSideDishes: response.data.dishEntry.chosenSideDishes || []
        }

        this.$store.commit('setEntryLoadingFalse')
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
        dishEntryId: this.editedOrderEntry.id,
        dishId: this.editedOrderEntry.dishId,
        newDish: this.editedOrderEntry.newDish,
        newDishName: this.editedOrderEntry.newDishName,
        newDishPrice: Math.round(this.editedOrderEntry.newDishPrice * 100),
        additionalComments: this.editedOrderEntry.additionalComments,
        sideDishes: this.editedOrderEntry.chosenSideDishes.map(sd => Object.assign(sd, { newSideDishPrice: Math.round(sd.newSideDishPrice * 100) }))
      };

      console.log("Starting submit");

      ApiConnector.makePost(action, formData)
        .then(function (response) {
          console.log("Submit sucessful, redirect to " + dataSuccessUrl)
          window.location.reload();
        })
        .catch(function(error) {
          console.log("Submit error")
          error.body.messages.forEach(msg => errorsComponent.addError(msg));
        });

      return false;
    },
    cancelEdit: function() {
      this.$emit("cancelEdit")
    },
    clearSideDishes: function() {
      this.editedOrderEntry.chosenSideDishes = []
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

  .wrapper {
    margin-bottom: 30px;
  }
</style>
