<template>
  <div>
    <div class="input-group">
      <template v-if="!newDish">
        <v-autocomplete
            :items="allDishesAtOnce"
            label="Dish"
            :value="dishId"
            @change="updateDishId($event.target.value)"
            item-text="text"
            item-value="value"
        >
          <template slot="selection" slot-scope="data">
              {{ data.item.text }}
          </template>

          <template slot="item" slot-scope="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>

            <template v-else>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </template>


        </v-autocomplete>

        <v-btn flat @click="setDishAsNew()">Type your own dish! &nbsp;</v-btn>
      </template>
    </div>

    <div class="input-group">
      <template v-if="newDish">
        <input type="text" class="form-control" placeholder="New dish name" id="newDishName"
               :value="newDishName" @input="updateNewDishName($event.target.value)"/>

        <vue-numeric currency="zł" separator="." currency-symbol-position="suffix"
                     :value="newDishPrice" @input.native="updateNewDishPrice($event.target.value)" :precision="2"
                     class="form-control"
                     required=""></vue-numeric>

        <v-btn flat @click="setDishAsExisting()">Select dish from list &nbsp;</v-btn>
      </template>
    </div>

    <side-dishes-input></side-dishes-input>

    <v-textarea
        label="Additional Comments"
        :value="additionalComments"
        @input="[UPDATE_ADDITIONAL_COMMENTS]($event.target.value)"
    >
    </v-textarea>
  </div>
</template>

<script>
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
      SET_DISH_AS_EXISTING, CANCEL_DISH_ENTRY_MODIFICATION,
  } from "../../store/modules/ModifyOrderEntryState";
  import {mapState, mapMutations} from "vuex"

  export default {
    name: 'order-entry-form',
    methods: {
      setDishAsNew() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_AS_NEW}`)
      },
      setDishAsExisting() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_AS_EXISTING}`)
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
      ]),
      cancelEdit() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
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
      ]),
      allDishesAtOnce() {
        return this.allDishesByCategory.flatMap(categoryData => {
            let dishes = categoryData.dishes.flatMap(dish => {
                var price = (dish.price/100).toLocaleString("pl-PL", {style: "currency", currency: "PLN"});

                return Object.assign({}, {
                    text: `${dish.name}`,
                    value: dish.id,
                    subtitle: `Price: ${price}`
                })
            });

            dishes.unshift({"header": `Category: ${categoryData.category}`});
            dishes.push({"divider": true})

            return dishes
        })
      }
    },
    components: {
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
