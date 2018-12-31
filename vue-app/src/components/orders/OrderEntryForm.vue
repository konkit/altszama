<template>
  <div>
    <h4>Dish</h4>

    <div class="input-group">
      <template v-if="!newDish">
        <select
            class="form-control existing-dish-dropdown"
            required=""
            id="dish"
            :value="dishId"
            @change="updateDishId($event.target.value)"
        >
          <optgroup
              v-for='(dishEntry, i) in allDishesByCategory'
              :key='i'
              :label="dishEntry.category"
          >
            <option
                v-for='(dish, i) in dishEntry.dishes'
                :key='i'
                :value="dish.id"
            >
              {{ dish.name }} &nbsp; (
              <price
                  :data-price="dish.price"
              />
              )
            </option>
          </optgroup>
        </select>

        <button class="btn btn-link" @click="setNewDishFlag(true)">Type your own dish! &nbsp;</button>
      </template>
    </div>

    <div class="input-group">
      <template v-if="newDish">
        <input type="text" class="form-control" placeholder="New dish name" id="newDishName"
               :value="newDishName" @input="updateNewDishName($event.target.value)"/>

        <vue-numeric currency="zł" separator="." currency-symbol-position="suffix"
                     :value="newDishPrice" @input="updateNewDishPrice($event.target.value)" :precision="2"
                     class="form-control"
                     required=""></vue-numeric>

        <button class="btn btn-link" @click="setNewDishFlag(false)">Select dish from list &nbsp;</button>
      </template>
    </div>
  </div>
</template>

<script>
  import Price from '../commons/PriceElement.vue'
  import {
    SET_NEW_DISH_FLAG,
    UPDATE_DISH_ID,
    CLEAR_EDITED_SIDE_DISHES,
    UPDATE_NEW_DISH_NAME,
    UPDATE_NEW_DISH_PRICE,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryState";
  import {mapState} from "vuex"

  export default {
    name: 'order-entry-form',
    methods: {
      setNewDishFlag(newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_NEW_DISH_FLAG}`, newValue)
      },
      updateDishId(newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_DISH_ID}`, newValue);
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CLEAR_EDITED_SIDE_DISHES}`)
      },
      updateNewDishName(newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_DISH_NAME}`, newValue)
      },
      updateNewDishPrice(newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_DISH_PRICE}`, newValue)
      },
    },
    computed: {
      ...mapState("showOrder", [
        "allDishesByCategory"
      ]),
      ...mapState(NAMESPACE_MODIFY_ORDER_ENTRY, [
        "orderId",
        "dishId",
        "additionalComments",
        "newDish",
        "newDishName",
        "newDishPrice",
        "chosenSideDishes",
      ])
    },
    components: {
      Price
    }
  }
</script>
