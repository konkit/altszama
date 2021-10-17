<template>
  <span>{{ valueAsString }}</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';

@Component({})
export default class Price extends Vue {
  @Prop() dataPrice!: number;

  valueAsString = ''

  private formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

  mounted() {
    this.valueAsString = this.formatter.format(this.dataPrice / 100);
  }
}
</script>
