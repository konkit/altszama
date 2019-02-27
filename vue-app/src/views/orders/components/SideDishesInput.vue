<template>
  <div>
    <div v-if="chosenSideDishes.length > 0">
      <div v-for="(sideDish, sdIndex) in chosenSideDishes" :key="sdIndex">
        <v-layout>
          <div class="py-4 px-3">{{sdIndex + 1}}.</div>

          <template v-if="sideDish.isNew === true">
            <v-text-field
                label="New side dish name"
                v-model="sideDish.newSideDishName"
                @input="updateNewSideDishName(sdIndex, $event)">
            </v-text-field>

            <MoneyInput
                label="New side dish price"
                :value="sideDish.newSideDishPrice"
                @input="changeNewSideDishPrice(sdIndex, $event)">
            </MoneyInput>

            <v-btn flat icon @click="removeSideDish(sdIndex)"><span class="fa fa-remove"></span></v-btn>

            <v-btn flat @click="setAsExistingSideDish(sdIndex)">Select side dish from the list</v-btn>
          </template>

          <template v-else>
            <v-autocomplete
                :items="sideDishesItems"
                label="Side dish"
                :value="sideDish.id"
                @change="updateSideDishComboBox(sdIndex, $event)">
            </v-autocomplete>

            <v-btn flat icon @click="removeSideDish(sdIndex)">
              <span class="fa fa-remove"></span>
            </v-btn>

            <v-btn flat @click="setAsNewSideDish(sdIndex)">
              Type your own side dish
            </v-btn>
          </template>
        </v-layout>
      </div>
    </div>

    <v-btn flat @click="addSideDishEntry()">
      <i class="fa fa-plus"></i> &nbsp; Add side dish
    </v-btn>
  </div>
</template>

<script>
  import Price from '../../commons/PriceElement.vue'
  import {
    UPDATE_NEW_SIDE_DISH_NAME,
    UPDATE_NEW_SIDE_DISH_PRICE,
    UPDATE_SIDE_DISH_ACTION,
    SET_SIDE_DISH_AS_EXISTING,
    SET_SIDE_DISH_AS_NEW,
    ADD_SIDE_DISH_ACTION,
    REMOVE_SIDE_DISH,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../../store/modules/ModifyOrderEntryState";
  import MoneyInput from "../../commons/MoneyInput";

  export default {
    name: 'side-dishes-input',
    methods: {
      removeSideDish(sideDishIndex) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${REMOVE_SIDE_DISH}`, {sdIndex: sideDishIndex});

        this.$forceUpdate();
      },
      addSideDishEntry() {
        this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${ADD_SIDE_DISH_ACTION}`);

        this.$forceUpdate();
      },
      setAsNewSideDish(sdIndex) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_SIDE_DISH_AS_NEW}`, {sdIndex: sdIndex});

        this.$forceUpdate();
      },
      setAsExistingSideDish(sdIndex) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_SIDE_DISH_AS_EXISTING}`, {sdIndex: sdIndex});

        this.$forceUpdate();
      },
      updateNewSideDishName(sdIndex, newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_SIDE_DISH_NAME}`, {
          sdIndex: sdIndex,
          newValue: newValue
        });

        this.$forceUpdate();
      },
      changeNewSideDishPrice(sdIndex, newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_SIDE_DISH_PRICE}`, {
          sdIndex: sdIndex,
          newValue: newValue
        });

        this.$forceUpdate();
      },
      updateSideDishComboBox(sdIndex, sideDishId) {
        console.log("sideDishId", sideDishId)
        this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_SIDE_DISH_ACTION}`, {
          sdIndex: sdIndex,
          sideDishId: sideDishId
        });

        this.$forceUpdate();
      },

    },
    computed: {
      dishId() {
        return this.$store.state.modifyOrderEntry.dishId;
      },
      dishIdToSideDishesMap() {
        return this.$store.state.showOrder.dishIdToSideDishesMap;
      },
      chosenSideDishes() {
        return this.$store.state.modifyOrderEntry.chosenSideDishes;
      },
      sideDishesItems() {
        return this.dishIdToSideDishesMap[this.dishId].map(entry => {
          var price = (entry.price / 100.0).toLocaleString("pl-PL", {style: "currency", currency: "PLN"});
          var text = `${entry.name} (${price})`;

          return Object.assign({}, {text: text, value: entry.id})
        })
      }
    },
    components: {
      MoneyInput,
      Price
    }
  }

</script>
