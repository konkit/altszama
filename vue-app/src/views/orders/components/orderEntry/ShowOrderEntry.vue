<template>
  <div class="show-order-entry-wrapper">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <div class="dish-name-and-edit-buttons">
            <div class="dish-name-text">
              {{ dishEntry.dishName }}
            </div>

            <div class="dish-price">
              (
              <price :data-price="dishEntry.price"/>
              )
            </div>

            <div class="edit-buttons" v-if="isOrderEntryOwner() && order.orderState === 'CREATED'">
              <v-btn text icon @click="editDishEntry()">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </v-btn>

              <v-btn text icon @click="deleteDishEntry()">
                <i class="fa fa-times" aria-hidden="true"></i>
              </v-btn>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>

      <template v-for="(sideDish, i) in dishEntry.sideDishes">
        <v-list-item :key="i">
          <v-list-item-content>
            <div class="side-dish-name-and-price">
              <div class="side-dish-name">+ {{ sideDish.name }}</div>

              <div class="side-dish-price">
                &nbsp; (
                <price :data-price="sideDish.price"/>
                )
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </template>

      <template v-if="dishEntry.comments.length > 0">
        <v-list-item>
          <v-list-item-content>
            <div class="dish-comments py-2">
              Additional comments: {{ dishEntry.comments }}
            </div>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Price from "../../../commons/PriceElement.vue";
import {ShowOrderState} from "@/store/modules/ShowOrderModule";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from "vue";
import {ParticipantsDishEntry, ParticipantsOrderEntry} from "../../../../frontend-client";
import ErrorHandler from "@/lib/ErrorHandler";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";

@Component({
  components: {
    Price
  }
})
export default class ShowOrderEntry extends Vue {
  @Prop() index!: number;
  @Prop() orderEntry!: ParticipantsOrderEntry;
  @Prop() dishEntry!: ParticipantsDishEntry;
  @Prop() currentUserId!: string;

  ordersConnector = new OrdersApiConnector()

  get order() {
    const showOrderState: ShowOrderState = this.$store.state.showOrder;
    return showOrderState.order;
  }

  isOrderOwner() {
    return this.order.orderCreatorId === this.currentUserId;
  }

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
  }

  editDishEntry() {
    this.$store.commit(
        `modifyOrderEntry/setDishEntryEditing`,
        {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        }
    );
  }

  deleteDishEntry() {
    this.ordersConnector
        .deleteDishEntry(this.orderEntry.id, this.dishEntry.id)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }
}
</script>

<style scoped>
.dish-name-and-edit-buttons {
  display: flex;
  flex-direction: row;
  max-width: 100%;
  line-height: 36px;
}

.dish-name-text {
  display: block;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-price {
  white-space: nowrap;
  padding-left: 5px;
}

.side-dish-name-and-price {
  max-width: 100%;
  display: flex;
  flex-direction: row;
}

.side-dish-name {
  margin-top: 0;
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.side-dish-price {
  white-space: nowrap;
}

.show-order-entry-wrapper {
  max-width: 100%;
}

.edit-buttons {
  min-width: 72px;
}
</style>
