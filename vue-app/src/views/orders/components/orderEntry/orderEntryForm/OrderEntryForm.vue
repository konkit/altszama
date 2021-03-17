<template>
  <div>
    <div class="d-flex fix-top-margin">
      <v-combobox
          placeholder="New dish name"
          id="newDishName"
          class="pr-2"
          :value="name"
          :items="allDishesAtOnce"
          @input="updateNewDishName($event)"
      >
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title><span class="text-wrap">{{ item.text }}</span></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-combobox>

      <MoneyInput class="money-input" :value="price" @input="updateNewDishPrice($event)">
      </MoneyInput>
    </div>

    <v-subheader>Side dishes:</v-subheader>

    <side-dishes-input :chosen-side-dishes="orderEntryData.dishData.chosenSideDishes"
                       :available-side-dishes="availableSideDishes"
                       @change="updateChosenSideDishes($event)">
    </side-dishes-input>

    <v-text-field label="Additional Comments" :value="orderEntryData.additionalComments"
                  @input="updateAdditionalComments($event)">
    </v-text-field>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import SideDishesInput from "./SideDishesInput.vue";
import {ExistingDishData, NewDishData, OrderEntryData} from "@/store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import Vue from "vue";
import Component from "vue-class-component";
import {DishDto, SideDish, SideDishData} from "@/frontend-client";
import {Prop} from "vue-property-decorator";

function dateToRel(date: Date) {
  if (date) {
    return moment(date).fromNow();
  } else {
    return "";
  }
}

interface ComboBoxHeaderItem {
  header: string;
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
  @Prop() allDishesByCategory: Record<string, DishDto[]>
  @Prop() dishIdToSideDishesMap: Record<string, SideDish[]>

  get name(): string | ComboBoxItem {
    if (this.orderEntryData.dishData.kind === "NewDishData") {
      return this.orderEntryData.dishData.newDishName
    } else {
      const existingDishData: ExistingDishData = this.orderEntryData.dishData
      const dish: DishDto = this.allDishesInRestaurant.find(d => d.id === existingDishData.dishId)!;
      return OrderEntryForm.dishToComboBoxItem(dish)
    }
  }

  get price() {
    if (this.orderEntryData.dishData.kind === "NewDishData") {
      return this.orderEntryData.dishData.newDishPrice
    } else {
      const existingDishData: ExistingDishData = this.orderEntryData.dishData
      return this.allDishesInRestaurant.find(d => d.id === existingDishData.dishId)?.price
    }
  }

  get availableSideDishes() {
    if (this.orderEntryData.dishData.kind === "ExistingDishData") {
      return this.dishIdToSideDishesMap[this.orderEntryData.dishData.dishId] || []
    } else {
      return []
    }
  }

  get allDishesAtOnce(): (ComboBoxHeaderItem | ComboBoxItem)[] {
    return Object.entries(this.allDishesByCategory).flatMap(([category, dishesFromCat]) => {
      const categoryHeader = {header: `Category: ${category}`}
      const dishes = dishesFromCat.map(dish => OrderEntryForm.dishToComboBoxItem(dish));

      return [categoryHeader, ...dishes];
    });
  }

  updateNewDishName(newValue: string | ComboBoxItem | null) {
    if (typeof newValue === "string") {
      const newDishData: NewDishData = {
        kind: "NewDishData",
        newDishName: newValue,
        newDishPrice: 0,
        chosenSideDishes: this.orderEntryData.dishData.chosenSideDishes
      }

      const newOrderEntryData: OrderEntryData = {
        dishData: newDishData,
        additionalComments: this.orderEntryData.additionalComments
      }
      this.updateOrderEntryData(newOrderEntryData);
    } else if (newValue != null && typeof newValue === "object") {
      const newDishData: ExistingDishData = {
        kind: "ExistingDishData",
        dishId: newValue.value,
        chosenSideDishes: this.orderEntryData.dishData.chosenSideDishes
      }

      const newOrderEntryData: OrderEntryData = {
        dishData: newDishData,
        additionalComments: this.orderEntryData.additionalComments
      }
      this.updateOrderEntryData(newOrderEntryData);
    }
  }

  updateNewDishPrice(newValue: number) {
    let newDishName
    if (this.orderEntryData.dishData.kind === "NewDishData") {
      newDishName = this.orderEntryData.dishData.newDishName
    } else {
      const existingDishData: ExistingDishData = this.orderEntryData.dishData
      newDishName = this.allDishesInRestaurant.find(d => d.id === existingDishData.dishId)?.name ?? ""
    }

    const newDishData: NewDishData = {
      kind: "NewDishData",
      newDishName: newDishName,
      newDishPrice: newValue,
      chosenSideDishes: this.orderEntryData.dishData.chosenSideDishes
    }

    const newOrderEntryData: OrderEntryData = {
      dishData: newDishData,
      additionalComments: this.orderEntryData.additionalComments
    }
    this.updateOrderEntryData(newOrderEntryData);
  }

  updateChosenSideDishes(newSideDishes: SideDishData[]) {
    const newDishData: NewDishData | ExistingDishData = {
      ...this.orderEntryData.dishData,
      chosenSideDishes: newSideDishes
    }

    const newOrderEntryData: OrderEntryData = {...this.orderEntryData, dishData: newDishData}
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

  private updateOrderEntryData(newOrderEntryData: OrderEntryData) {
    this.$emit("change", newOrderEntryData)
  }
}
</script>

<style>
.money-input {
  width: 5rem;
}

.fix-top-margin {
  margin-top: -7px;
  padding-left: 16px;
}
</style>
