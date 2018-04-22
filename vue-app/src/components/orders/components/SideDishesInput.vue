<template>
  <div class="form-group">
    <div>
      <h4>Side dishes</h4>

      <div v-if="editedOrderEntry.chosenSideDishes.length > 0">
        <div v-for="(sideDish, sdIndex) in editedOrderEntry.chosenSideDishes" :key="sdIndex">

          <div class="input-group" v-if="sideDish.isNew == true">
            <input type="text" class="form-control" placeholder="New dish name" id="newDishName" v-model="sideDish.newSideDishName" />
            <vue-numeric v-model="sideDish.newSideDishPrice" class="form-control" required="" currency="zł" separator="." currency-symbol-position="suffix" :precision="2" />
            
            <button class="btn btn-danger" @click="removeSideDish(sdIndex)"><span class="fa fa-remove" /></button>

            <button class="btn btn-link" @click="setAsExistingSideDish(sdIndex)">Select side dish from the list</button>
          </div>

          <div class="input-group" v-else>
            <select class="form-control" name="sideDishId" required="" v-model="editedOrderEntry.chosenSideDishes[sdIndex]">
              <option v-for="sideDish in dishIdToSideDishesMap[editedOrderEntry.dishId]" :value="sideDish">
                {{sideDish.name}} &nbsp; ( <price :data-price="sideDish.price" /> )
              </option>
            </select>

            <button class="btn btn-danger" @click="removeSideDish(sdIndex)"><span class="fa fa-remove" /></button>

            <button class="btn btn-link" @click="setAsNewSideDish(sdIndex)">Type your own side dish</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No side dishes selected</p>
      </div>

      <button class="btn btn-success" @click="addSideDishEntry()">
        Add side dish &nbsp; <i class="fa fa-plus" />
      </button>
    </div>
  </div>
</template>

<script>
import Price from '../../commons/priceElement.vue'

export default {
  name: 'side-dishes-input',
  props: [],
  methods: {
    removeSideDish: function(id) {
      this.editedOrderEntry.chosenSideDishes = removeItemWithSlice(this.editedOrderEntry.chosenSideDishes, id)
      this.$store.commit('setEditedOrderEntry', this.editedOrderEntry)
    },
    addSideDishEntry: function() {
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

      this.$store.commit('setEditedOrderEntry', this.editedOrderEntry)
    },
    setAsNewSideDish: function(sideDishIndex) {
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

      this.$store.commit('setEditedOrderEntry', this.editedOrderEntry)
    },
    setAsExistingSideDish: function(sideDishIndex) {
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

      this.$store.commit('setEditedOrderEntry', this.editedOrderEntry)
    }
  },
  computed: {
    dishIdToSideDishesMap () { return this.$store.state.dishIdToSideDishesMap; },
    editedOrderEntry () { return this.$store.state.editedOrderEntry; },
  },
  components: {
    Price
  }
}

function removeItemWithSlice(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

</script>
