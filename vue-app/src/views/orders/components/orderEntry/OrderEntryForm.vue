<template>
  <div>
    <v-btn-toggle :value="newDish" mandatory @change="onDishTypeToggle($event)">
      <v-btn text :value="false">
        Select dish from the list
      </v-btn>

      <v-btn text :value="true">
        Type your own dish
      </v-btn>
    </v-btn-toggle>

    <template v-if="!newDish">
      <v-autocomplete
          :items="allDishesAtOnce"
          label="Dish"
          :value="dishId"
          @change="updateDishId($event)"
          item-text="text"
          item-value="value"
      >
        <template slot="selection" slot-scope="data">
          {{ data.item.text }}
        </template>

        <template slot="item" slot-scope="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>

          <template v-else>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.text"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.subtitle"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>

    </template>

    <template v-if="newDish">
      <v-text-field
          type="text"
          placeholder="New dish name"
          id="newDishName"
          :value="newDishName"
          class="pr-2"
          @input="updateNewDishName($event)">
      </v-text-field>

      <MoneyInput
          label="New dish price"
          :value="newDishPrice"
          @input="updateNewDishPrice($event)"
      >
      </MoneyInput>
    </template>

    <subheader>Side dishes:</subheader>

    <side-dishes-input></side-dishes-input>

    <v-text-field
        label="Additional Comments"
        :value="additionalComments"
        @input="updateAdditionalComments($event)"
    >
    </v-text-field>
  </div>
</template>

<script>
  import ErrorsComponent from '../../../commons/Errors.vue'
  import Spinner from '../../../commons/Spinner.vue'
  import Price from '../../../commons/PriceElement.vue'
  import moment from "moment"
  import CustomPolyfills from "../../../../lib/CustomPolyfills"

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
  } from "../../../../store/modules/ModifyOrderEntryState";
  import {mapState, mapMutations} from "vuex"
  import MoneyInput from "../../../commons/MoneyInput";

  export default {
    name: 'order-entry-form',
    data: function () {
      return {
        newDish123: 1
      }
    },
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
      updateAdditionalComments(newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_ADDITIONAL_COMMENTS}`, newValue)
      },
      cancelEdit() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
      },
      onDishTypeToggle(e) {
        console.log("onDishTypeToggle: ", e);

        if (e === true) {
          this.setDishAsNew()
        } else if (e === false) {
          this.setDishAsExisting()
        } else {
          console.warn("Dish type toggle returned wrong value")
        }
      }

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
        return CustomPolyfills.flatMap(this.allDishesByCategory, categoryData => {
          let dishes = CustomPolyfills.flatMap(categoryData.dishes, dish => {
            const price = (dish.price / 100).toLocaleString("pl-PL", {style: "currency", currency: "PLN"});

            let updateDesc = "";
            if (dish.lastCrawled) {
              updateDesc = `auto-updated ${dateToRel(dish.lastCrawled)}`
            }

            return Object.assign({}, {
              text: `${dish.name}`,
              value: dish.id,
              subtitle: `Price: ${price}, ${updateDesc}`
            })
          });

          dishes.unshift({"header": `Category: ${categoryData.category}`});

          return dishes
        })
      }
    },
    components: {
      MoneyInput,
      ErrorsComponent,
      Price,
      Spinner,
      OrderEntryForm,
      SideDishesInput
    }
  }

  function dateToRel(date) {
    if (date) {
      return moment(date).fromNow()
    } else {
      return ""
    }
  }
</script>

<style>
</style>
