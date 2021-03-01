<template>
  <div>
    <v-combobox
        placeholder="New dish name"
        id="newDishName"
        class="pr-2"
        :value="name"
        :items="allDishesAtOnce"
        @input="updateNewDishName($event)"
    >
      <template v-slot:item="{ index, item }">
        <v-list-item-content>
          <v-list-item-title v-html="item.text"></v-list-item-title>
          <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-combobox>

    <MoneyInput class="money-input" label="New dish price" :value="price" @input="updateNewDishPrice($event)">
    </MoneyInput>

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

interface ComboBoxItem {
  text: string;
  value: string;
  subtitle: string;
}

@Component({
  components: {
    MoneyInput,
    SideDishesInput
  }
})
export default class OrderEntryForm extends Vue {

  @Prop() orderEntryData: OrderEntryData
  @Prop() allDishesInRestaurant: DishDto[]
  @Prop() allDishesByCategory: { [category: string]: DishDto[] }
  @Prop() dishIdToSideDishesMap: { [key: string]: SideDish[] }

  // items: ({ header: string } | { text: string; value: string; subtitle: string })[] = []
  //
  // mounted() {
  //   this.items = this.generateAllDishesAtOnce()
  // }

  updateNewDishName(newValue: string | ComboBoxItem | null) {
    if (typeof newValue === "string") {
      const newOrderEntryData: OrderEntryData = {
        ...this.orderEntryData,
        newDish: true,
        dishId: undefined,
        newDishName: newValue,
      }
      this.updateOrderEntryData(newOrderEntryData);
    } else if (newValue != null && typeof newValue === "object") {
      const newOrderEntryData: OrderEntryData = {
        ...this.orderEntryData,
        newDish: false,
        dishId: newValue.value,
        chosenSideDishes: []
      }
      this.updateOrderEntryData(newOrderEntryData);
    }
  }

  updateNewDishPrice(newValue: number) {
    let newDishName
    if (this.orderEntryData.newDish) {
      newDishName = this.orderEntryData.newDishName
    } else {
      newDishName = this.allDishesInRestaurant.find(d => d.id === this.orderEntryData.dishId)?.name ?? ""
    }

    const newOrderEntryData: OrderEntryData = {
      ...this.orderEntryData,
      newDish: true,
      newDishName: newDishName,
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
    this.updateOrderEntryData(this.orderEntryData);
    this.$store.commit(`modifyOrderEntry/cancelDishEntryModification`, {});
  }

  updateChosenSideDishes(newSideDishes: []) {
    const newOrderEntryData: OrderEntryData = {...this.orderEntryData, chosenSideDishes: newSideDishes}
    this.updateOrderEntryData(newOrderEntryData);
  }

  get allDishesAtOnce(): ({ header: string } | ComboBoxItem)[] {
    const dishByCategoryMap: Map<string, DishDto[]> = new Map(Object.entries(this.allDishesByCategory));

    const entries: [string, DishDto[]][] = Array.from(dishByCategoryMap.entries());

    return entries.flatMap(([category, dishesFromCat]) => {
      const dishes: (| { header: string } | { text: string; value: string; subtitle: string })[] =
          dishesFromCat.map(dish => {
            return OrderEntryForm.dishToComboBoxItem(dish);
          });

      dishes.unshift({header: `Category: ${category}`});

      return dishes;
    });
  }

  private static dishToComboBoxItem(dish: DishDto): ComboBoxItem {
    const price = (dish.price / 100).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN"
    });

    let updateDesc = "";
    if (dish.lastCrawled) {
      updateDesc = `auto-updated ${dateToRel(dish.lastCrawled)}`;
    }

    return {
      text: `${dish.name}`,
      value: dish.id,
      subtitle: `Price: ${price}, ${updateDesc}`
    };
  }

  get name(): string | ComboBoxItem {
    if (this.orderEntryData.newDish) {
      return this.orderEntryData.newDishName
    } else {
      const dish: DishDto = this.allDishesInRestaurant.find(d => d.id === this.orderEntryData.dishId)!;
      return OrderEntryForm.dishToComboBoxItem(dish)
    }
  }

  get price() {
    if (this.orderEntryData.newDish) {
      return this.orderEntryData.newDishPrice
    } else {
      return this.allDishesInRestaurant.find(d => d.id === this.orderEntryData.dishId)?.price
    }
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
