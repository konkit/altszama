<template>
<div class="container">
  <div class="row justify-content-center">
    <div class="col-8">

      <div class="form-group">
        <h4>Dish</h4>

        <select class="form-control" required="" id="dish" v-model="orderEntry.dishId" @change="clearSideDishes">
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

          <div v-if="this.orderEntry.chosenSideDishes.length > 0"> 
            <p v-for="sideDish in this.orderEntry.chosenSideDishes" v-bind:key="sideDish.id">
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
              <option v-for="sideDish in this.dishIdToSideDishesMap[this.orderEntry.dishId]" v-bind:key="sideDish.id" v-bind:value="sideDish.id">
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
      sideDishFormVisible: false
    }
  },
  methods: {
    goToCreateDish: function(restaurantId) {
      window.location = "#/restaurants/" + this.restaurantId + "/dishes/create?addingToOrderId=" + this.orderId
    },
    clearSideDishes: function() {
      this.orderEntry.chosenSideDishes = []
    },
    addSideDish: function() {
      let sideDishToAdd = this.dishIdToSideDishesMap[this.orderEntry.dishId].find(sd => sd.id === this.sideDishIdToAdd);

      if (sideDishToAdd) {
        this.orderEntry.chosenSideDishes.push(sideDishToAdd);  
      }
      
      this.setSideDishFormVisible(false);
    },
    removeSideDish: function(sideDishId) {
      this.orderEntry.chosenSideDishes = this.orderEntry.chosenSideDishes.filter(sd => sd.id !== sideDishId)
      this.$forceUpdate();
    },
    setSideDishFormVisible: function(isVisible) {
      this.sideDishFormVisible = isVisible;
    },
    isSelected: function(currentDishId) {
      return currentDishId === this.orderEntry.dish.id;
    }
  },
  components: {
    Price
  }
}
</script>
