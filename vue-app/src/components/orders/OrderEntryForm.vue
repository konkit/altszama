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

        <button class="btn btn-link" @click="setDishAsNew()">Type your own dish! &nbsp;</button>
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

        <button class="btn btn-link" @click="setDishAsExisting()">Select dish from list &nbsp;</button>
      </template>
    </div>

    <side-dishes-input></side-dishes-input>

    <div class="form-group">
      <h4>Additional Comments</h4>
      <textarea class="form-control" :value="additionalComments"
                @input="[UPDATE_ADDITIONAL_COMMENTS]($event.target.value)"></textarea>
    </div>
  </div>
</template>

<script>
  import BackButton from '../commons/BackButton.vue'
  import ErrorsComponent from '../commons/Errors.vue'
  import Spinner from '../commons/Spinner.vue'
  import Price from '../commons/PriceElement.vue'

  import OrderEntryForm from './OrderEntryForm.vue'
  import SideDishesInput from './SideDishesInput.vue'
  import {
    UPDATE_DISH_ID,
    CLEAR_EDITED_SIDE_DISHES,
    UPDATE_NEW_DISH_NAME,
    UPDATE_NEW_DISH_PRICE,
    NAMESPACE_MODIFY_ORDER_ENTRY,
    UPDATE_ADDITIONAL_COMMENTS,
    SET_DISH_AS_NEW,
    SET_DISH_AS_EXISTING,
  } from "../../store/modules/ModifyOrderEntryState";
  import {mapState, mapMutations} from "vuex"

  export default {
    name: 'order-entry-form',
    methods: {
      setDishAsNew() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_AS_NEW}`, newValue)
      },
      setDishAsExisting() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_AS_EXISTING}`, newValue)
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
      ...mapMutations(NAMESPACE_MODIFY_ORDER_ENTRY, [
        UPDATE_ADDITIONAL_COMMENTS
      ])
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
      Price,
      BackButton,
      ErrorsComponent,
      Price,
      Spinner,
      OrderEntryForm,
      SideDishesInput
    }
  }
</script>

<style>
</style>
