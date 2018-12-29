<template>
  <div class="form-group">
    <div>
      <h4>Side dishes</h4>

      <div v-if="editedOrderEntry.chosenSideDishes.length > 0">
        <div v-for="(sideDish, sdIndex) in editedOrderEntry.chosenSideDishes" :key="sdIndex">

          <div class="input-group" v-if="sideDish.isNew == true">
            <input type="text" class="form-control" placeholder="New dish name" id="newDishName"
                   v-model="sideDish.newSideDishName"/>
            <vue-numeric :value="sideDish.newSideDishPrice" @input="changeNewSideDishPrice(sdIndex, $event)"
                         class="form-control" required="" currency="zł" separator="." currency-symbol-position="suffix"
                         :precision="2"/>

            <button class="btn btn-danger" @click="removeSideDish(sdIndex)"><span class="fa fa-remove"/></button>

            <button class="btn btn-link" @click="setAsExistingSideDish(sdIndex)">Select side dish from the list</button>
          </div>

          <div class="input-group" v-else>
            <select class="form-control" name="sideDishId" required="" :value="sideDish.id"
                    @change="updateSideDishComboBox(sdIndex, editedOrderEntry.dishId, $event.target.value)">
              <option v-for="sideDishToSelect in dishIdToSideDishesMap[editedOrderEntry.dishId]"
                      :value="sideDishToSelect.id">
                {{sideDishToSelect.name}} &nbsp; (
                <price :data-price="sideDishToSelect.price"/>
                )
              </option>
            </select>

            <button class="btn btn-danger" @click="removeSideDish(sdIndex)"><span class="fa fa-remove"/></button>

            <button class="btn btn-link" @click="setAsNewSideDish(sdIndex)">Type your own side dish</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No side dishes selected</p>
      </div>

      <button class="btn btn-success" @click="addSideDishEntry()">
        Add side dish &nbsp; <i class="fa fa-plus"/>
      </button>
    </div>
  </div>
</template>

<script>
  import Price from '../commons/PriceElement.vue'
  import {SET_EDITED_ORDER_ENTRY} from "../../store/modules/ShowOrderState";

  export default {
    name: 'side-dishes-input',
    props: [],
    methods: {
      removeSideDish: function (id) {
        this.editedOrderEntry.chosenSideDishes = removeItemWithSlice(this.editedOrderEntry.chosenSideDishes, id)
        this.$store.commit(`showOrder/${SET_EDITED_ORDER_ENTRY}`, this.editedOrderEntry)
      },
      addSideDishEntry: function () {
        var sideDishesForGivenDish = this.dishIdToSideDishesMap[this.editedOrderEntry.dishId];
        var sideDishToAdd;

        if (sideDishesForGivenDish && sideDishesForGivenDish.length > 0) {
          sideDishToAdd = sideDishesForGivenDish[0]
          sideDishToAdd.isNew = false
        } else {
          sideDishToAdd = {}
          sideDishToAdd.isNew = true
        }

        sideDishToAdd.newSideDishName = ""
        sideDishToAdd.newSideDishPrice = 0

        this.editedOrderEntry.chosenSideDishes.push(sideDishToAdd)

        this.$store.commit(`showOrder/${SET_EDITED_ORDER_ENTRY}`, this.editedOrderEntry)
      },
      setAsNewSideDish: function (sideDishIndex) {
        this.editedOrderEntry.chosenSideDishes = this.editedOrderEntry.chosenSideDishes.map((sd, i) => {
          var newSd = {}
          if (i === sideDishIndex) {
            sd.isNew = true
            newSd = sd
          } else {
            newSd = sd
          }

          return newSd
        })

        this.$store.commit(`showOrder/${SET_EDITED_ORDER_ENTRY}`, this.editedOrderEntry)
      },
      setAsExistingSideDish: function (sideDishIndex) {
        this.editedOrderEntry.chosenSideDishes = this.editedOrderEntry.chosenSideDishes.map((sd, i) => {
          var newSd = {}
          if (i === sideDishIndex) {
            sd.isNew = false
            newSd = sd
          } else {
            newSd = sd
          }

          return newSd
        })

        this.$store.commit(`showOrder/${SET_EDITED_ORDER_ENTRY}`, this.editedOrderEntry)
      },
      changeNewSideDishPrice(sdIndex, newPrice) {
        this.editedOrderEntry.chosenSideDishes[sdIndex].newSideDishPrice = newPrice;
        this.$store.commit(`showOrder/${SET_EDITED_ORDER_ENTRY}`, this.editedOrderEntry)

        this.$forceUpdate();
      },
      updateSideDishComboBox(sdIndex, dishId, sidedishId) {
        this.editedOrderEntry.chosenSideDishes[sdIndex] = this.dishIdToSideDishesMap[dishId].find(sd => sd.id == sidedishId)
        this.$store.commit(`showOrder/${SET_EDITED_ORDER_ENTRY}`, this.editedOrderEntry)

        this.$forceUpdate();
      }
    },
    computed: {
      dishIdToSideDishesMap() {
        return this.$store.state.showOrder.dishIdToSideDishesMap;
      },
      editedOrderEntry() {
        return this.$store.state.showOrder.editedOrderEntry;
      },
    },
    components: {
      Price
    }
  }

  function removeItemWithSlice(array, index) {
    return [...array.slice(0, index), ...array.slice(index + 1)]
  }

</script>
