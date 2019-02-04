<template>
  <div>
    <h4>Side dishes</h4>

    <div v-if="this.sideDishes.length > 0">
      <p v-for="sideDish in this.sideDishes" :key="sideDish.id">
        {{sideDish.name}}&nbsp;(
        <price :data-price="sideDish.price"/>
        )
        <span @click="removeSideDish(sideDish.id)"><span class="fa fa-times"/></span>
      </p>
    </div>
    <div v-else>
      <p>No side dishes</p>
    </div>

    <div v-if="this.sideDishFormVisible === false">
      <v-btn color="success" @click="setSideDishFormVisible(true)">
        Add side dish &nbsp; <i class="fa fa-plus"/>
      </v-btn>
    </div>

    <div v-if="this.sideDishFormVisible === true">
      <div class="form-group">
        <label>New Side dish name</label>
        <input class="form-control" type="text" name="newSideDishName" v-model="newSideDishName"/>
      </div>

      <div class="form-group">
        <label>New Side dish price</label>
        <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="newSideDishPrice"
                     :precision="2" class="form-control" required="" id="newSideDishPrice"></vue-numeric>
      </div>

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
    import ErrorsComponent from '../commons/Errors.vue'
    import Price from '../commons/PriceElement.vue'

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
                    price: Math.round(this.newSideDishPrice * 100)
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
            ErrorsComponent,
            Price
        }
    }
</script>
