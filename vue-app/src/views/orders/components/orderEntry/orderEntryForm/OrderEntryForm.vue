<template>
  <div>
    <v-btn-toggle :value="orderEntryData.newDish" mandatory @change="onDishTypeToggle($event)">
      <v-btn text :value="false">
        Select dish from the list
      </v-btn>

      <v-btn text :value="true">
        Type your own dish
      </v-btn>
    </v-btn-toggle>

    <template v-if="!orderEntryData.newDish">
      <v-autocomplete
          :items="allDishesAtOnce"
          label="Dish"
          :value="orderEntryData.dishId"
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

    <template v-if="orderEntryData.newDish">
      <v-text-field
          type="text"
          placeholder="New dish name"
          id="newDishName"
          class="pr-2"
          :value="orderEntryData.newDishName"
          @input="updateNewDishName($event)"
      >
      </v-text-field>

      <MoneyInput class="money-input" label="New dish price" :value="orderEntryData.newDishPrice" @input="updateNewDishPrice($event)">
      </MoneyInput>
    </template>

    <v-subheader>Side dishes:</v-subheader>

    <side-dishes-input :chosen-side-dishes="orderEntryData.chosenSideDishes"
                       :dish-id-to-side-dishes-map="dishIdToSideDishesMap"
                       :dish-id="orderEntryData.dishId"
                       @change="updateChosenSideDishes($event)">
    </side-dishes-input>

    <v-text-field label="Additional Comments" :value="orderEntryData.additionalComments" @input="updateAdditionalComments($event)">
    </v-text-field>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import SideDishesInput from "./SideDishesInput.vue";
import {OrderEntryData} from "@/store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import Vue from "vue";
import Component from "vue-class-component";
import {DishDto, SideDish} from "@/frontend-client";
import {Prop} from "vue-property-decorator";

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

  @Prop() orderEntryData: OrderEntryData
  @Prop() allDishesByCategory: { [category: string]: DishDto[] }
  @Prop() dishIdToSideDishesMap: { [key: string]: SideDish[] }

  setDishAsNew() {
    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      newDish: true,
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  setDishAsExisting() {
    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      newDish: false,
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  updateDishId(newValue: string) {
    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      dishId: newValue,
      chosenSideDishes: []
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  updateNewDishName(newValue: string) {
    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      newDishName: newValue,
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  updateNewDishPrice(newValue: number) {
    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      newDishPrice: newValue,
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  updateAdditionalComments(newValue: string) {
    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      additionalComments: newValue,
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  cancelEdit() {
    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      isEntryCreating: false,
      isEntryEdited: false,
      orderEntryId: "",
      dishEntryId: ""
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  updateChosenSideDishes(newSideDishes: []) {
    const newOrderEntryData: OrderEntryData = {...this.orderEntryData, chosenSideDishes: newSideDishes}
    this.updateOrderEntryData(newOrderEntryData);
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

  get allDishesAtOnce() {
    const dishByCategoryMap: Map<string, DishDto[]> = new Map(
        Object.entries(this.allDishesByCategory)
    );

    const entries: [string, DishDto[]][] = Array.from(
        dishByCategoryMap.entries()
    );

    return entries.flatMap(([category, dishesFromCat]) => {
      const dishes: (| { header: string } | { text: string; value: string; subtitle: string })[] =
          dishesFromCat.map(dish => {
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

      dishes.unshift({header: `Category: ${category}`});

      return dishes;
    });
  }

  private updateOrderEntryData(newOrderEntryData: OrderEntryData) {
    this.$emit("change", newOrderEntryData)
  }
}
</script>

<style>
.money-input {
  width: 5rem;
}
</style>
