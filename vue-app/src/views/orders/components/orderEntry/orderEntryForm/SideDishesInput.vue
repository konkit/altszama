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
              <v-btn-toggle :value="sideDish.isNew" mandatory @change="onSideDishTypeToggle(sdIndex, $event)">
                <v-btn text :value="false">
                  Select side dish from the list
                </v-btn>

                <v-btn text :value="true">
                  Type your own side dish
                </v-btn>
              </v-btn-toggle>

              <v-layout>
                <template v-if="sideDish.isNew === true">
                  <v-text-field
                    label="New side dish name"
                    v-model="sideDish.newSideDishName"
                    @input="updateNewSideDishName(sdIndex, $event)"
                  >
                  </v-text-field>

                  <MoneyInput
                    label="New side dish price"
                    :value="sideDish.newSideDishPrice"
                    @input="changeNewSideDishPrice(sdIndex, $event)"
                  >
                  </MoneyInput>

                  <v-btn text icon @click="removeSideDish(sdIndex)"
                    ><span class="fa fa-remove"></span
                  ></v-btn>
                </template>

                <template v-else>
                  <v-autocomplete
                    :items="sideDishesItems"
                    label="Side dish"
                    :value="sideDish.id"
                    @change="updateSideDishComboBox(sdIndex, $event)"
                  >
                  </v-autocomplete>

                  <v-btn text icon @click="removeSideDish(sdIndex)">
                    <span class="fa fa-remove"></span>
                  </v-btn>
                </template>
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

@Component({
  components: {
    MoneyInput
  }
})
export default class SideDishesInput extends Vue {
  @Prop() chosenSideDishes: []
  @Prop() dishId: string
  @Prop() dishIdToSideDishesMap: { [key: string]: SideDish[] }

  removeSideDish(sideDishIndex: number) {
    const newSideDishes = [...this.chosenSideDishes.slice(0, sideDishIndex), ...this.chosenSideDishes.slice(sideDishIndex+1)]

    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  addSideDishEntry() {
    const sideDishToAdd: SideDishData = {
      isNew: false,
      newSideDishName: "",
      newSideDishPrice: 0
    };

    const newSideDishes = [...this.chosenSideDishes, sideDishToAdd]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  setAsNewSideDish(sdIndex: number) {
    const oldItem = this.chosenSideDishes[sdIndex]
    const newItem = Object.assign(oldItem, {isNew: true})

    const newSideDishes = [...this.chosenSideDishes.slice(0, sdIndex), newItem, ...this.chosenSideDishes.slice(sdIndex+1)]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  setAsExistingSideDish(sdIndex: number) {
    const oldItem = this.chosenSideDishes[sdIndex]
    const newItem = Object.assign(oldItem, {isNew: false})

    const newSideDishes = [...this.chosenSideDishes.slice(0, sdIndex), newItem, ...this.chosenSideDishes.slice(sdIndex+1)]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  updateNewSideDishName(sdIndex: number, newValue: string) {
    const oldItem = this.chosenSideDishes[sdIndex]
    const newItem = Object.assign(oldItem, {newSideDishName: newValue})

    const newSideDishes = [...this.chosenSideDishes.slice(0, sdIndex), newItem, ...this.chosenSideDishes.slice(sdIndex+1)]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  changeNewSideDishPrice(sdIndex: number, newValue: number) {
    const oldItem = this.chosenSideDishes[sdIndex]
    const newItem = Object.assign(oldItem, {newSideDishPrice: newValue})

    const newSideDishes = [...this.chosenSideDishes.slice(0, sdIndex), newItem, ...this.chosenSideDishes.slice(sdIndex+1)]
    this.updateSideDishes(newSideDishes);

    this.$forceUpdate();
  }

  updateSideDishComboBox(sdIndex: number, sideDishId: string) {
    const newSideDish = this.dishIdToSideDishesMap[this.dishId]
        .find(sd => sd.id === sideDishId);

    const newSideDishes = [...this.chosenSideDishes.slice(0, sdIndex), newSideDish, ...this.chosenSideDishes.slice(sdIndex+1)]
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
    return this.dishIdToSideDishesMap[this.dishId].map(entry => {
      const price = (entry.price / 100.0).toLocaleString("pl-PL", {
        style: "currency",
        currency: "PLN"
      });
      const text = `${entry.name} (${price})`;

      return Object.assign({}, { text: text, value: entry.id });
    });
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
