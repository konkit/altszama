import Vue from 'vue'

var eventBus = new Vue()

export default {
    addEvent: (eventName, eventAction) => eventBus.$on(eventName, eventAction),
    emitEvent: (eventName) => eventBus.$emit(eventName)
}