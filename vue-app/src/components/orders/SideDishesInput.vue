<template>
  <div class="form-group">
    <div>
      <h4>Side dishes</h4>

      <div v-if="chosenSideDishes.length > 0">
        <div v-for="(sideDish, sdIndex) in chosenSideDishes" :key="sdIndex">

          <div class="input-group" v-if="sideDish.isNew === true">
            <input
                type="text"
                class="form-control"
                placeholder="New dish name"
                id="newDishName"
                v-model="sideDish.newSideDishName"
                @input="updateNewSideDishName(sdIndex, $event.target.value)"
            />

            <vue-numeric
                :value="sideDish.newSideDishPrice"
                @input="changeNewSideDishPrice(sdIndex, $event)"
                class="form-control"
                required=""
                currency="zł"
                separator="."
                currency-symbol-position="suffix"
                :precision="2"
            />

            <button class="btn btn-danger" @click="removeSideDish(sdIndex)"><span class="fa fa-remove"></span></button>

            <button class="btn btn-link" @click="setAsExistingSideDish(sdIndex)">Select side dish from the list</button>
          </div>

          <div class="input-group" v-else>
            <select
                class="form-control"
                name="sideDishId"
                required=""
                :value="sideDish.id"
                @change="updateSideDishComboBox(sdIndex, $event.target.value)"
            >
              <option
                  v-for="sideDishToSelect in dishIdToSideDishesMap[dishId]"
                  :value="sideDishToSelect.id"
              >
                {{sideDishToSelect.name}} &nbsp; (
                <price :data-price="sideDishToSelect.price"/>
                )
              </option>
            </select>

            <button class="btn btn-danger" @click="removeSideDish(sdIndex)">
              <span class="fa fa-remove"></span>
            </button>

            <button class="btn btn-link" @click="setAsNewSideDish(sdIndex)">
              Type your own side dish
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No side dishes selected</p>
      </div>

      <button class="btn btn-success" @click="addSideDishEntry()">
        Add side dish &nbsp; <i class="fa fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
  import Price from '../commons/PriceElement.vue'
  import {
    UPDATE_NEW_SIDE_DISH_NAME,
    UPDATE_NEW_SIDE_DISH_PRICE,
    UPDATE_SIDE_DISH_ACTION,
    SET_SIDE_DISH_AS_EXISTING,
    SET_SIDE_DISH_AS_NEW,
    ADD_SIDE_DISH_ACTION,
    REMOVE_SIDE_DISH,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryState";

  export default {
    name: 'side-dishes-input',
    methods: {
      removeSideDish (sideDishIndex) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${REMOVE_SIDE_DISH}`, sideDishIndex);

        this.$forceUpdate();
      },
      addSideDishEntry () {
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
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_SIDE_DISH_NAME}`, {sdIndex: sdIndex, newValue: newValue});

        this.$forceUpdate();
      },
      changeNewSideDishPrice(sdIndex, newValue) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_NEW_SIDE_DISH_PRICE}`, {sdIndex: sdIndex, newValue: newValue});

        this.$forceUpdate();
      },
      updateSideDishComboBox(sdIndex, sideDishId) {
        this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_SIDE_DISH_ACTION}`, {sdIndex: sdIndex, sideDishId: sideDishId});

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
    },
    components: {
      Price
    }
  }

</script>
