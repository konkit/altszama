<template>
  <v-dialog
      ref="dialog"
      v-model="modal2"
      :return-value.sync="time"
      @update:return-value="inputEvent($event)"
      persistent
      width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
          v-on="on"
          v-model="time"
          :label="label"
          prepend-icon="access_time"
          readonly
          class="time-input"
      ></v-text-field>
    </template>


    <v-time-picker
        v-if="modal2"
        v-model="time"
        full-width
        format="24hr"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Prop, Watch} from "vue-property-decorator";
  import Component from "vue-class-component";

  @Component({})
  export default class TimePicker extends Vue {
    @Prop() value!: string;
    @Prop() label!: string;

    time: string | null = null;
    modal2 = false;

    mounted() {
      this.time = this.value
    }

    inputEvent(event: Event) {
      console.log("event: ", event)
      this.$emit("input", event)
    }

    @Watch('value')
    onPropertyChanged(value: string, oldValue: string) {
      this.time = value;
    }
  }
</script>

<style scoped>
  .time-input {
    width: 200px;
  }
</style>