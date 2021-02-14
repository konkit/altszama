<template>
  <div>
    <h4>Side dishes</h4>

    <div v-if="this.sideDishes.length > 0">
      <p v-for="sideDish in this.sideDishes" :key="sideDish.id">
        {{ sideDish.name }}&nbsp;(
        <price :data-price="sideDish.price" />
        )
        <v-btn icon @click="removeSideDish(sideDish.id)"
          ><span class="fa fa-times"
        /></v-btn>
      </p>
    </div>
    <div v-else>
      <p>No side dishes</p>
    </div>

    <div v-if="this.sideDishFormVisible === false">
      <v-btn text @click="setSideDishFormVisible(true)">
        Add side dish &nbsp; <i class="fa fa-plus" />
      </v-btn>
    </div>

    <div v-if="this.sideDishFormVisible === true">
      <v-text-field label="New Side dish name" v-model="newSideDishName">
      </v-text-field>

      <MoneyInput
        label="New Side dish price"
        :value="newSideDishPrice"
        @input="newSideDishPrice = $event"
      >
      </MoneyInput>

      <v-btn color="success" @click="addSideDish">
        Add &nbsp; <i class="fa fa-plus" />
      </v-btn>

      <v-btn @click="setSideDishFormVisible(false)">
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Price from "../../commons/PriceElement.vue";
import MoneyInput from "../../commons/MoneyInput.vue";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import { SideDish } from "@/frontend-client";

@Component({
  components: {
    MoneyInput,
    Price
  }
})
export default class SideDishes extends Vue {
  @Prop() initialSideDishes!: SideDish[];

  sideDishes: SideDish[] = [];
  newSideDishName = "";
  newSideDishPrice = 0;
  sideDishFormVisible = false;

  mounted() {
    this.sideDishes = this.initialSideDishes || [];
  }

  addSideDish() {
    const newSideDish: SideDish = {
      name: this.newSideDishName,
      price: this.newSideDishPrice
    };

    this.sideDishes.push(newSideDish);
    this.setSideDishFormVisible(false);
  }

  removeSideDish(sideDishId: string) {
    this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId);
  }

  setSideDishFormVisible(isVisible: boolean) {
    this.sideDishFormVisible = isVisible;
  }

  getSideDishes() {
    return this.sideDishes;
  }
}
</script>
