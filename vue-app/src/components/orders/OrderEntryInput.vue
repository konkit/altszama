<template>
  <div>
    <h4>Dish</h4>

    <div class="input-group">
      <template v-if="!editedOrderEntry.newDish">
        <select class="form-control existing-dish-dropdown" required="" id="dish" v-model="editedOrderEntry.dishId"
                @change="clearSideDishes">
          <optgroup v-for='(dishEntry, i) in allDishesByCategory' :key='i' :label="dishEntry.category">
            <option v-for='(dish, i) in dishEntry.dishes' :key='i' :value="dish.id">
              {{ dish.name }} &nbsp; (
              <price :data-price="dish.price"/>
              )
            </option>
          </optgroup>
        </select>

        <button class="btn btn-link" @click="setNewDishFlag(true)">Type your own dish! &nbsp;</button>
      </template>
    </div>

    <div class="input-group">
      <template v-if="editedOrderEntry.newDish">
        <input type="text" class="form-control" placeholder="New dish name" id="newDishName"
               v-model="editedOrderEntry.newDishName"/>

        <vue-numeric currency="zł" separator="." currency-symbol-position="suffix"
                     v-model="editedOrderEntry.newDishPrice" :precision="2" class="form-control"
                     required=""></vue-numeric>

        <button class="btn btn-link" @click="setNewDishFlag(false)">Select dish from list &nbsp;</button>
      </template>
    </div>
  </div>
</template>

<script>
  import Price from '../commons/PriceElement.vue'

  export default {
    name: 'order-entry-input',
    methods: {
      setNewDishFlag: function (newValue) {
        this.$store.commit('setNewDishFlag', newValue)
      },
      clearSideDishes: function () {
        this.$store.commit('showOrder/clearEditedSideDishes')
      }
    },
    computed: {
      editedOrderEntry() {
        return this.$store.state.showOrder.editedOrderEntry;
      },
      allDishesByCategory() {
        return this.$store.state.showOrder.allDishesByCategory;
      }
    },
    components: {
      Price
    }
  }
</script>
