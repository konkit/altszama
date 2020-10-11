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
              <v-btn-toggle
                :value="sideDish.isNew"
                mandatory
                @change="onSideDishTypeToggle(sdIndex, $event)"
              >
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
import {
  ADD_SIDE_DISH_ACTION,
  ModifyOrderEntryState,
  NAMESPACE_MODIFY_ORDER_ENTRY,
  REMOVE_SIDE_DISH,
  SET_SIDE_DISH_AS_EXISTING,
  SET_SIDE_DISH_AS_NEW,
  UPDATE_NEW_SIDE_DISH_NAME,
  UPDATE_NEW_SIDE_DISH_PRICE,
  UPDATE_SIDE_DISH_ACTION
} from "../../../../store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import Vue from "vue";
import Component from "vue-class-component";
import { SideDish, SideDishData } from "../../../../frontend-client";
import { ShowOrderState } from "../../../../store/modules/ShowOrderModule";

@Component({
  components: {
    MoneyInput
  }
})
export default class SideDishesInput extends Vue {
  removeSideDish(sideDishIndex: number) {
    this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${REMOVE_SIDE_DISH}`, {
      sdIndex: sideDishIndex
    });

    this.$forceUpdate();
  }

  addSideDishEntry() {
    this.$store.dispatch(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${ADD_SIDE_DISH_ACTION}`
    );

    this.$forceUpdate();
  }

  setAsNewSideDish(sdIndex: number) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_SIDE_DISH_AS_NEW}`,
      { sdIndex: sdIndex }
    );

    this.$forceUpdate();
  }

  setAsExistingSideDish(sdIndex: number) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_SIDE_DISH_AS_EXISTING}`,
      { sdIndex: sdIndex }
    );

    this.$forceUpdate();
  }

  updateNewSideDishName(sdIndex: number, newValue: string) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_SIDE_DISH_NAME}`,
      {
        sdIndex: sdIndex,
        newValue: newValue
      }
    );

    this.$forceUpdate();
  }

  changeNewSideDishPrice(sdIndex: number, newValue: number) {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_SIDE_DISH_PRICE}`,
      {
        sdIndex: sdIndex,
        newValue: newValue
      }
    );

    this.$forceUpdate();
  }

  updateSideDishComboBox(sdIndex: number, sideDishId: string) {
    this.$store.dispatch(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_SIDE_DISH_ACTION}`,
      {
        sdIndex: sdIndex,
        sideDishId: sideDishId
      }
    );

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

  get dishId(): string {
    const modifyOrderEntry: ModifyOrderEntryState = this.$store.state
      .modifyOrderEntry;
    return modifyOrderEntry.dishId;
  }

  get dishIdToSideDishesMap(): { [key: string]: SideDish[] } {
    const showOrderState: ShowOrderState = this.$store.state.showOrder;
    return showOrderState.dishIdToSideDishesMap;
  }

  get chosenSideDishes(): SideDishData[] {
    const modifyOrderEntry: ModifyOrderEntryState = this.$store.state
      .modifyOrderEntry;
    return modifyOrderEntry.chosenSideDishes;
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
