<template>
  <tr>
    <template v-if="this.loadingEntry === false">
    <errors-component ref="errorsComponent" />

    <td v-if="entriesIndex == 0" :rowspan="orderEntry.dishEntries.length + 1">
      {{orderEntry.user.username}}
    </td>

    <td>
      <div v-if="!editedOrderEntry.newDish">
        <h4>Dish</h4>
        <div class="input-group">
          <select class="form-control existing-dish-dropdown" required="" id="dish" v-model="editedOrderEntry.dishId" @change="clearSideDishes">
            <optgroup v-for='(dishEntry, i) in this.allDishesByCategory' :key='i' :label="dishEntry.category">
              <option v-for='(dish, i) in dishEntry.dishes' :key='i' :value="dish.id">
                {{ dish.name }} &nbsp; ( <price :data-price="dish.price" /> )
              </option>
            </optgroup>
          </select>

          <button class="btn btn-link" @click="setNewDishFlag(true)">Type your own dish! &nbsp;</button>
        </div>
      </div>

      <div v-if="editedOrderEntry.newDish">
        <h4>Dish</h4>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="New dish name" id="newDishName" v-model="editedOrderEntry.newDishName" />
          
          <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="editedOrderEntry.newDishPrice" :precision="2" class="form-control" required=""></vue-numeric>

          <button class="btn btn-link" @click="setNewDishFlag(false)">Select dish from list &nbsp;</button>
        </div>
      </div>

      <div class="form-group">
        <div>
          <h4>Side dishes</h4>

          <div v-if="editedOrderEntry.chosenSideDishes.length > 0">
            <div v-for="(sideDish, sdIndex) in editedOrderEntry.chosenSideDishes" :key="sdIndex">

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
                
                <button class="btn btn-danger" @click="removeSideDish(editedOrderEntry.chosenSideDishes[sdIndex].id)"><span class="fa fa-remove" /></button>

                <button class="btn btn-link" @click="setAsExistingSideDish(sdIndex)">Select side dish from the list</button>
              </div>

              <div class="input-group" v-else>
                <select class="form-control" name="sideDishId" required="" v-model="editedOrderEntry.chosenSideDishes[sdIndex]">
                  <option v-for="sideDish in dishIdToSideDishesMap[editedOrderEntry.dishId]" :value="sideDish">
                    {{sideDish.name}} &nbsp; ( <price :data-price="sideDish.price" /> )
                  </option>
                </select>

                <button class="btn btn-danger" @click="removeSideDish(editedOrderEntry.chosenSideDishes[sdIndex].id)"><span class="fa fa-remove" /></button>

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
        <textarea class="form-control" name="additionalComments" value="" id="additionalComments" v-model="editedOrderEntry.additionalComments" />
      </div>

      <button class="btn btn-block btn-success" @click="submitForm">
        Update order
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
import ApiConnector from '../../../ApiConnector.js'

export default {
  name: 'order-entry-edit-entry',
  props: ['entriesIndex', 'usersDishEntriesCount', 'username', 'orderEntry', 'dishEntry'],
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
          // window.location.href = dataSuccessUrl;
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
    },
    removeSideDish: function(sideDishId) {
      console.log("Removing side dishes, id: " + sideDishId + " before: " + this.editedOrderEntry.chosenSideDishes)

      this.editedOrderEntry.chosenSideDishes = this.editedOrderEntry.chosenSideDishes.filter(sd => sd.id !== sideDishId)
      this.$forceUpdate();
      
      console.log("After sidedishes: " + this.editedOrderEntry.chosenSideDishes)
    },
    setNewDishFlag: function(newDishValue) {
      this.editedOrderEntry.newDish = newDishValue;
    },
    addSideDishEntry: function() {
      var sideDishesForGivenDish = this.dishIdToSideDishesMap[this.editedOrderEntry.dishId];
      var sideDishToAdd;

      if (sideDishesForGivenDish.size > 0) {
        sideDishToAdd = sideDishesForGivenDish[0]
        sideDishToAdd.isNew = false
      } else {
        sideDishToAdd = {}
        sideDishToAdd.isNew = true
      }
      
      sideDishToAdd.newSideDishName = ""
      sideDishToAdd.newSideDishPrice = 0

      this.editedOrderEntry.chosenSideDishes.push(sideDishToAdd) // = this.orderEntry.chosenSideDishes + sideDishToAdd
    },
    setAsNewSideDish: function(sideDishIndex) {
      this.editedOrderEntry.chosenSideDishes = this.editedOrderEntry.chosenSideDishes.map((sd, i) => {
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
      this.editedOrderEntry.chosenSideDishes = this.editedOrderEntry.chosenSideDishes.map((sd, i) => {
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

  .existing-dish-dropdown {
    max-width: 500px;
  }
</style>
