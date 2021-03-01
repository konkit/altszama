<template>
  <div>
    <v-list dense>
      <div v-if="chosenSideDishes.length > 0">
        <div v-for="(sideDish, sdIndex) in chosenSideDishes" :key="sdIndex">
          <v-list-item>
            <v-list-item-content class="index-element">
              <div>{{ sdIndex + 1 }}.</div>
            </v-list-item-content>

            <v-list-item-content>
              <v-layout>
                <v-combobox
                    :items="sideDishesItems"
                    label="New side dish name"
                    :value="getName(sideDish)"
                    @input="updateNewSideDishName(sdIndex, $event)"
                >
                  <template v-slot:item="{ index, item }">
                    <v-list-item-content>
                      <v-list-item-title v-html="item.text"></v-list-item-title>
                      <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-combobox>

                <MoneyInput
                    label="New side dish price"
                    :value="getPrice(sideDish)"
                    @input="changeNewSideDishPrice(sdIndex, $event)"
                >
                </MoneyInput>

                <v-btn text icon @click="removeSideDish(sdIndex)">
                  <span class="fa fa-remove"></span>
                </v-btn>
              </v-layout>
            </v-list-item-content>
          </v-list-item>
        </div>
      </div>

      <v-list-item>
        <v-list-item-content class="index-element new-sidedish-item">
          {{ chosenSideDishes.length + 1 }}.
        </v-list-item-content>

        <v-list-item-content>
          <div>
            <v-btn text @click="addSideDishEntry()">
              Add side dish &nbsp; <i class="fa fa-plus"></i>
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import MoneyInput from "@/views/commons/MoneyInput.vue";
import Vue from "vue";
import Component from "vue-class-component";
import {SideDish, SideDishData} from "../../../../../frontend-client";
import {Prop} from "vue-property-decorator";

interface ComboBoxItem {
  text: string;
  value: string;
  subtitle: string;
}

@Component({
  components: {
    MoneyInput
  }
})
export default class SideDishesInput extends Vue {
  @Prop() chosenSideDishes: SideDishData[]
  @Prop() availableSideDishes: SideDish[]

  removeSideDish(sideDishIndex: number) {
    const newSideDishes: SideDishData[] = [
      ...this.chosenSideDishes.slice(0, sideDishIndex),
      ...this.chosenSideDishes.slice(sideDishIndex + 1)
    ]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  addSideDishEntry() {
    const sideDishToAdd: SideDishData = {
      isNew: false,
      newSideDishName: "",
      newSideDishPrice: 0
    };

    const newSideDishes: SideDishData[] = [...this.chosenSideDishes, sideDishToAdd]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  setAsNewSideDish(sdIndex: number) {
    const oldItem = this.chosenSideDishes[sdIndex]
    const newItem = Object.assign(oldItem, {isNew: true})

    const newSideDishes: SideDishData[] = [
      ...this.chosenSideDishes.slice(0, sdIndex),
      newItem,
      ...this.chosenSideDishes.slice(sdIndex + 1)
    ]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  setAsExistingSideDish(sdIndex: number) {
    const oldItem = this.chosenSideDishes[sdIndex]
    const newItem = Object.assign(oldItem, {isNew: false})

    const newSideDishes: SideDishData[] = [
      ...this.chosenSideDishes.slice(0, sdIndex),
      newItem,
      ...this.chosenSideDishes.slice(sdIndex + 1)
    ]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  updateNewSideDishName(sdIndex: number, newValue: string | ComboBoxItem | null) {
    if (typeof newValue === "string") {
      const oldItem = this.chosenSideDishes[sdIndex]
      const newItem = Object.assign(oldItem, {isNew: true, newSideDishName: newValue})

      const newSideDishes: SideDishData[] = [
        ...this.chosenSideDishes.slice(0, sdIndex),
        newItem,
        ...this.chosenSideDishes.slice(sdIndex + 1)
      ]
      this.updateSideDishes(newSideDishes);
    } else if (newValue != null && typeof newValue === "object") {
      const oldItem = this.chosenSideDishes[sdIndex]
      const newItem = Object.assign(oldItem, {isNew: false, id: newValue.value})

      const newSideDishes: SideDishData[] = [
        ...this.chosenSideDishes.slice(0, sdIndex),
        newItem,
        ...this.chosenSideDishes.slice(sdIndex + 1)
      ]
      this.updateSideDishes(newSideDishes);
    }

    this.$forceUpdate();
  }

  changeNewSideDishPrice(sdIndex: number, newValue: number) {
    const oldItem: SideDishData = this.chosenSideDishes[sdIndex]

    let newSideDishName
    if (oldItem.isNew) {
      newSideDishName = oldItem.newSideDishName
    } else {
      newSideDishName = this.availableSideDishes.find(sd => sd.id === oldItem.id)?.name ?? ""
    }

    const newItem: SideDishData = Object.assign(oldItem, {isNew: true, newSideDishName: newSideDishName, newSideDishPrice: newValue})

    const newSideDishes: SideDishData[] = [
      ...this.chosenSideDishes.slice(0, sdIndex),
      newItem,
      ...this.chosenSideDishes.slice(sdIndex + 1)
    ]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  updateSideDishComboBox(sdIndex: number, sideDishId: string) {
    const newSideDish = this.availableSideDishes.find(sd => sd.id === sideDishId);

    const newSideDishes: SideDishData[] = [
      ...this.chosenSideDishes.slice(0, sdIndex),
      ...(newSideDish ? [newSideDish] : []),
      ...this.chosenSideDishes.slice(sdIndex + 1)
    ]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  onSideDishTypeToggle(sdIndex: number, e: boolean) {
    console.log("onSideDishTypeToggle: ", e);

    if (e === true) {
      this.setAsNewSideDish(sdIndex);
    } else if (e === false) {
      this.setAsExistingSideDish(sdIndex);
    } else {
      console.warn("Side dish type toggle returned wrong value");
    }
  }

  get sideDishesItems() {
    if (this.availableSideDishes) {
      return this.availableSideDishes.map(entry => SideDishesInput.toComboBoxItem(entry));
    } else {
      return []
    }
  }

  getName(item: SideDishData): string | ComboBoxItem | undefined {
    if (item.isNew) {
      return item.newSideDishName!
    } else {
      const sideDish = this.availableSideDishes.find(d => d.id === item.id)

      return sideDish ? SideDishesInput.toComboBoxItem(sideDish) : undefined
    }
  }

  getPrice(item: SideDishData) {
    if (item.isNew) {
      return item.newSideDishPrice
    } else {
      return this.availableSideDishes.find(d => d.id === item.id)?.price
    }
  }

  private static toComboBoxItem(entry: SideDish): ComboBoxItem {
    const price = (entry.price / 100).toLocaleString("pl-PL", {style: "currency",currency: "PLN"});

    return {
      text: `${entry.name}`,
      value: entry.id!,
      subtitle: `Price: ${price}`
    };
  }

  private updateSideDishes(newSideDishes: SideDishData[]) {
    this.$emit("change", newSideDishes)
  }
}
</script>

<style scoped>
.index-element {
  padding-top: 28px;
  min-width: 20px;
  flex-grow: 0;
  align-self: flex-start;
}

.index-element div {
  padding-top: 16px;
}

.index-element.new-sidedish-item {
  padding-top: 18px;
}
</style>
