<template>
  <div class="wrapper">
    <template v-if="this.loadingEntry === false">
      <div class="pull-right">
        <button type="button" class="btn btn-light" @click="cancelEdit()">
          Cancel
        </button>
      </div>

      <errors-component ref="errorsComponent"/>

      <div>
        <order-entry-input/>

        <side-dishes-input/>

        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" v-model="editedOrderEntry.additionalComments"></textarea>
        </div>

        <button class="btn btn-block btn-success" @click="submitForm">
          Save order
        </button>
      </div>

    </template>

    <template v-if="this.loadingEntry === true">
      <div class="justify-content-center">
        <spinner></spinner>
      </div>
    </template>
  </div>
</template>

<script>
    import BackButton from '../commons/backButton.vue'
    import ErrorsComponent from '../commons/errors.vue'
    import Spinner from '../commons/spinner.vue'
    import Price from '../commons/priceElement.vue'

    import OrderEntryInput from './OrderEntryInput.vue'
    import SideDishesInput from './SideDishesInput.vue'

    import ApiConnector from '../../lib/ApiConnector.js'

    export default {
        name: 'order-entry-create-entry',
        props: ['order'],
        data() {
            return {}
        },
        created() {
            this.$store.commit('setEntryLoadingTrue')
        },
        mounted() {
            let dishId;
            if (this.allDishesInRestaurant.length > 0) {
                dishId = this.allDishesInRestaurant[0].id;
            } else {
                dishId = null
            }

            const newEditedOrderEntry = {
                orderId: this.order.id,
                dishId: dishId,
                additionalComments: '',
                newDish: false,
                newDishName: "",
                newDishPrice: "",
                chosenSideDishes: []
            };

            this.$store.commit('setEditedOrderEntry', newEditedOrderEntry);

            this.$store.commit('setEntryLoadingFalse')
        },
        methods: {
            submitForm: function (e) {
                e.preventDefault();

                const action = "/order_entries/save";

                let errorsComponent = this.$refs.errorsComponent;

                let formData = {
                    orderId: this.order.id,
                    dishId: this.editedOrderEntry.dishId,
                    newDish: this.editedOrderEntry.newDish,
                    newDishName: this.editedOrderEntry.newDishName,
                    newDishPrice: Math.round(this.editedOrderEntry.newDishPrice * 100),
                    additionalComments: this.editedOrderEntry.additionalComments,
                    sideDishes: this.editedOrderEntry.chosenSideDishes.map(sd => Object.assign(sd, {newSideDishPrice: Math.round(sd.newSideDishPrice * 100)}))
                };

                ApiConnector.makePost(action, formData)
                    .then(() => {
                        this.$emit("updateOrder");
                        this.$store.commit('cancelEntryCreateOrEdit', {})
                    })
                    .catch((error) => {
                        console.log("orderEntryCreateEntry error:", error);
                        error.body.messages.forEach(msg => errorsComponent.addError(msg));
                    });

                return false;
            },
            cancelEdit: function () {
                this.$store.commit('cancelEntryCreateOrEdit', {})
            },
        },
        computed: {
            loadingEntry() {
                return this.$store.state.loadingEntry;
            },
            allDishesInRestaurant() {
                return this.$store.state.allDishesInRestaurant;
            },
            editedOrderEntry() {
                return this.$store.state.editedOrderEntry;
            }
        },
        components: {
            BackButton,
            ErrorsComponent,
            Price,
            Spinner,
            OrderEntryInput,
            SideDishesInput
        }
    }
</script>

<style scoped>
  .wrapper {
    margin-bottom: 30px;
  }
</style>
