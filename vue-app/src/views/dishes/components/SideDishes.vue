<template>
  <div>
    <h4>Side dishes</h4>

    <div v-if="this.sideDishes.length > 0">
      <p v-for="sideDish in this.sideDishes" :key="sideDish.id">
        {{sideDish.name}}&nbsp;(<price :data-price="sideDish.price"/>)
        <span @click="removeSideDish(sideDish.id)"><span class="fa fa-times"/></span>
      </p>
    </div>
    <div v-else>
      <p>No side dishes</p>
    </div>

    <div v-if="this.sideDishFormVisible === false">
      <v-btn @click="setSideDishFormVisible(true)">
        Add side dish &nbsp; <i class="fa fa-plus"/>
      </v-btn>
    </div>

    <div v-if="this.sideDishFormVisible === true">
      <v-text-field
        label="New Side dish name"
        v-model="newSideDishName">
      </v-text-field>

      <MoneyInput
          label="New Side dish price"
          :value="newSideDishPrice"
          @input="newSideDishPrice = $event">
      </MoneyInput>

      <v-btn color="success" @click="addSideDish">
        Add &nbsp; <i class="fa fa-plus"/>
      </v-btn>

      <v-btn @click="setSideDishFormVisible(false)">
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<script>
    import ErrorsComponent from '../../commons/Errors.vue'
    import Price from '../../commons/PriceElement.vue'
    import MoneyInput from "../../commons/MoneyInput";

    export default {
        props: [
            'initialSideDishes'
        ],
        data() {
            return {
                sideDishes: this.initialSideDishes || [],

                newSideDishName: '',
                newSideDishPrice: '',
                sideDishFormVisible: false
            }
        },
        methods: {
            addSideDish() {
                var newSideDish = {
                    name: this.newSideDishName,
                    price: this.newSideDishPrice
                }

                this.sideDishes.push(newSideDish)
                this.setSideDishFormVisible(false);
            },
            removeSideDish(sideDishId) {
                this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId)
            },
            setSideDishFormVisible(isVisible) {
                this.sideDishFormVisible = isVisible;
            },
            getSideDishes() {
                return this.sideDishes
            },
            setSideDishes(sideDishes) {
                this.sideDishes = sideDishes
            },

        },
        components: {
            MoneyInput,
            ErrorsComponent,
            Price
        }
    }
</script>
