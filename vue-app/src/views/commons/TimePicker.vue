<template>
  <v-dialog
      ref="dialog"
      v-model="modal2"
      :return-value.sync="time"
      @update:returnValue="inputEvent($event)"
      persistent
      lazy
      full-width
      width="290px"
  >
    <v-text-field
        slot="activator"
        v-model="time"
        :label="label"
        prepend-icon="access_time"
        readonly
        class="time-input"
    ></v-text-field>
    <v-time-picker
        v-if="modal2"
        v-model="time"
        full-width
        format="24hr"
    >
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="modal2 = false">Cancel</v-btn>
      <v-btn flat color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
  export default {
    name: "TimePicker",
    props: ["value", "label"],
    data() {
      return {
        time: null,
        modal2: false
      }
    },
    mounted() {
      this.time = this.value
    },
    methods: {
      inputEvent(event) {
        this.$emit("input", event)
      },
    },
    watch: {
      value(newVal) {
        this.time = newVal;
      }
    }
  }
</script>

<style scoped>
  .time-input {
    width: 200px;
  }
</style>