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
          <template v-if="typeof data.item.category !== 'undefined'">
            <v-list-item-content
              v-text="data.item.category"
            ></v-list-item-content>
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
        class="pr-2"
        :value="newDishName"
        @input="updateNewDishName($event)"
      >
      </v-text-field>

      <MoneyInput class="money-input" label="New dish price" :value="newDishPrice" @input="updateNewDishPrice($event)">
      </MoneyInput>
    </template>

    <v-subheader>Side dishes:</v-subheader>

    <side-dishes-input></side-dishes-input>

    <v-text-field label="Additional Comments" :value="additionalComments" @input="updateAdditionalComments($event)">
    </v-text-field>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import SideDishesInput from "./SideDishesInput.vue";
import {
  CANCEL_DISH_ENTRY_MODIFICATION,
  CLEAR_EDITED_SIDE_DISHES,
  NAMESPACE_MODIFY_ORDER_ENTRY,
  SET_DISH_AS_EXISTING,
  SET_DISH_AS_NEW,
  UPDATE_ADDITIONAL_COMMENTS,
  UPDATE_DISH_ID,
  UPDATE_NEW_DISH_NAME,
  UPDATE_NEW_DISH_PRICE
} from "@/store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import Vue from "vue";
import Component from "vue-class-component";
import { DishDto } from "@/frontend-client";

function dateToRel(date: Date) {
  if (date) {
    return moment(date).fromNow();
  } else {
    return "";
  }
}

@Component({
  components: {
    MoneyInput,
    SideDishesInput
  }
})
export default class OrderEntryForm extends Vue {
  setDishAsNew() {
    this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_AS_NEW}`);
  }

  setDishAsExisting() {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_AS_EXISTING}`
    );
  }

  updateDishId(newValue: string) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_DISH_ID}`,
      newValue
    );
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${CLEAR_EDITED_SIDE_DISHES}`
    );
  }

  updateNewDishName(newValue: string) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_DISH_NAME}`,
      newValue
    );
  }

  updateNewDishPrice(newValue: number) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_DISH_PRICE}`,
      newValue
    );
  }

  updateAdditionalComments(newValue: string) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_ADDITIONAL_COMMENTS}`,
      newValue
    );
  }

  cancelEdit() {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`,
      {}
    );
  }

  onDishTypeToggle(value: boolean) {
    console.log("onDishTypeToggle: ", value);

    if (value) {
      this.setDishAsNew();
    } else if (!value) {
      this.setDishAsExisting();
    } else {
      console.warn("Dish type toggle returned wrong value");
    }
  }

  get allDishesByCategory(): { [category: string]: DishDto[] } {
    return this.$store.state.showOrder.allDishesByCategory;
  }

  get orderId() {
    return this.$store.state.modifyOrderEntry.orderId;
  }

  get dishId() {
    return this.$store.state.modifyOrderEntry.dishId;
  }

  get additionalComments() {
    return this.$store.state.modifyOrderEntry.additionalComments;
  }

  get newDish() {
    return this.$store.state.modifyOrderEntry.newDish;
  }

  get newDishName() {
    return this.$store.state.modifyOrderEntry.newDishName;
  }

  get newDishPrice() {
    return this.$store.state.modifyOrderEntry.newDishPrice;
  }

  get allDishesAtOnce() {
    const dishByCategoryMap: Map<string, DishDto[]> = new Map(
      Object.entries(this.allDishesByCategory)
    );

    console.log("dishByCategoryMap", dishByCategoryMap);

    const entries: [string, DishDto[]][] = Array.from(
      dishByCategoryMap.entries()
    );

    const result = entries.flatMap(([category, dishesFromCat]) => {
      console.log("categoryData", [category, dishesFromCat]);

      const dishes: (
        | { header: string }
        | { text: string; value: string; subtitle: string }
      )[] = dishesFromCat.map(dish => {
        console.log("dish: ", dish);

        const price = (dish.price / 100).toLocaleString("pl-PL", {
          style: "currency",
          currency: "PLN"
        });

        let updateDesc = "";
        if (dish.lastCrawled) {
          updateDesc = `auto-updated ${dateToRel(dish.lastCrawled)}`;
        }

        return Object.assign(
          {},
          {
            text: `${dish.name}`,
            value: dish.id,
            subtitle: `Price: ${price}, ${updateDesc}`
          }
        );
      });

      console.log("Dishes: ", dishes);

      dishes.unshift({ header: `Category: ${category}` });

      return dishes;
    });

    console.log("Result: ", result);

    return result;
  }
}
</script>

<style>
  .money-input {
    width: 5rem;
  }
</style>