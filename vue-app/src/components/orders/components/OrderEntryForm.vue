<template>
  <div class="container">
    <div class="row justify-content-center" v-if="!orderEntry.newDish">
      <div class="col-8">
        <div class="form-group">
          <h4>Dish</h4>

          <select class="form-control" required="" id="dish" v-model="orderEntry.dishId" @change="clearSideDishes">
            <optgroup v-for='(dishEntry, i) in this.allDishesByCategory' :key='i' :label="dishEntry.category">
              <option v-for='(dish, i) in dishEntry.dishes' :key='i' :value="dish.id">
                {{ dish.name }}&nbsp;( <price :data-price="dish.price" /> )
              </option>
            </optgroup>
          </select>
        </div>
      </div>

      <div class="col-4">
        <h3>&nbsp;</h3>
        <p><button class="btn btn-link" @click="setNewDishFlag(true)">Add new dish! &nbsp;</button></p>
      </div>
    </div>

    <div class="row justify-content-center" v-if="orderEntry.newDish">
      <div class="col-8">
        <div class="form-group">
          <h4>Dish</h4>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="New dish name" id="newDishName" v-model="orderEntry.newDishName" />
            <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="orderEntry.newDishPrice" :precision="2" class="form-control" required=""></vue-numeric>
          </div>
        </div>
      </div>

      <div class="col-4">
        <h3>&nbsp;</h3>
        <p><button class="btn btn-link" @click="setNewDishFlag(false)">Back to dish list &nbsp;</button></p>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-8">
        <div class="form-group">
          <div>
            <h4>Side dishes</h4>

            <div v-if="orderEntry.chosenSideDishes.length > 0">
              <div v-for="(sideDish, sdIndex) in orderEntry.chosenSideDishes" :key="sdIndex">
                <div class="input-group" v-if="sideDish.isNew === true">
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
                  
                  <button @click="setAsExistingSideDish(sdIndex)"><span class="fa fa-undo" /></button>

                  <button @click="removeSideDish(orderEntry.chosenSideDishes[sdIndex])"><span class="fa fa-remove" /></button>
                </div>

                <div class="input-group" v-else>
                  <select class="form-control" name="sideDishId" required="" v-model="orderEntry.chosenSideDishes[sdIndex]">
                    <option v-for="sideDish in dishIdToSideDishesMap[orderEntry.dishId]"  :value="sideDish">
                      {{sideDish.name}}&nbsp;( <price :data-price="sideDish.price" /> )
                    </option>
                  </select>

                  <button @click="setAsNewSideDish(sdIndex)"><span class="fa fa-undo" /></button>

                  <button @click="removeSideDish(orderEntry.chosenSideDishes[sdIndex])"><span class="fa fa-remove" /></button>
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
      </div>

      <div class="col-4">
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col">
        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" name="additionalComments" value="" id="additionalComments" v-model="orderEntry.additionalComments" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import Price from '../../commons/priceElement.vue'

export default {
  props: {
    orderEntry: {
      type: Object
    },
    restaurantId: {
      type: String
    },
    orderId: {
      type: String
    },
    allDishesInRestaurant: {
      type: Array
    },
    allDishesByCategory: {
      type: Array
    },
    dishIdToSideDishesMap: {
      type: Object
    }
  },
  data () {
    return {
      sideDishIdToAdd: '',
      sideDishFormVisible: false,
    }
  },
  methods: {
    clearSideDishes: function() {
      this.orderEntry.chosenSideDishes = []
    },
    removeSideDish: function(sideDishId) {
      this.orderEntry.chosenSideDishes = this.orderEntry.chosenSideDishes.filter(sd => sd.id !== sideDishId)
      this.$forceUpdate();
    },
    setNewDishFlag: function(newDishValue) {
      this.orderEntry.newDish = newDishValue;
    },
    addSideDishEntry: function() {
      var sideDishesForGivenDish = this.dishIdToSideDishesMap[this.orderEntry.dishId];
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

      this.orderEntry.chosenSideDishes.push(sideDishToAdd) // = this.orderEntry.chosenSideDishes + sideDishToAdd
    },
    setAsNewSideDish: function(sideDishIndex) {
      this.orderEntry.chosenSideDishes = this.orderEntry.chosenSideDishes.map((sd, i) => {
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
      this.orderEntry.chosenSideDishes = this.orderEntry.chosenSideDishes.map((sd, i) => {
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
  components: {
    Price
  }
}
</script>
