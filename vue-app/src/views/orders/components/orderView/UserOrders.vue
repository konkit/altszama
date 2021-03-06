<template>
  <div>
    <v-list dense>
      <template v-for="(entry, entryIndex) in groupedEntries">
        <v-list-item :key="'list-' + entryIndex">
          <v-list-item-content class="body-1">
            <span><b>{{ entry.eatingPeopleCount }}x</b> {{ entry.dishName }}</span>
          </v-list-item-content>
        </v-list-item>

        <v-list
          dense
          class="px-8 no-y-padding"
          v-if="entry.eatingPeopleEntries.length > 0"
          :key="'second-list-' + entryIndex"
        >
          <template v-for="(eatingPersonEntry, i) in entry.eatingPeopleEntries">
            <v-list-item :key="'eatingPersonEntry-' + i">
              <v-list-item-content>
                <div class="user-row">
                  <div class="username">
                    {{ i + 1 }}. {{ eatingPersonEntry.username }}
                  </div>

                  <div class="sidedishes mx-4">
                    <v-list dense>
                      <template v-if="eatingPersonEntry.comments.length > 0">
                        <v-subheader>Additional comments:</v-subheader>

                        <v-list-item>
                          <v-list-item-content>
                            {{ eatingPersonEntry.comments }}
                          </v-list-item-content>
                        </v-list-item>
                      </template>

                      <template v-if="eatingPersonEntry.sideDishes.length > 0">
                        <v-subheader>Side dishes:</v-subheader>

                        <template
                          v-for="(sd, j) in eatingPersonEntry.sideDishes"
                        >
                          <v-list-item :key="'entry-' + i + '-side-dish-' + j">
                            <v-list-item-content>
                              {{ sd.name }}
                            </v-list-item-content>
                          </v-list-item>

                          <template
                            v-if="j < eatingPersonEntry.sideDishes.length - 1"
                          >
                            <v-divider
                              class="custom-margin-divider"
                              :key="
                                'entry-' + i + '-side-dish-' + j + '-divider'
                              "
                            ></v-divider>
                          </template>
                        </template>
                      </template>
                    </v-list>
                  </div>

                  <div class="comments mx-4">
                    <v-list class="comments-list"> </v-list>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>

            <template v-if="i < entry.eatingPeopleEntries.length - 1">
              <v-divider
                class="custom-margin-divider"
                :key="'eatingPersonEntry-' + i + '-divider'"
              ></v-divider>
            </template>
          </template>
        </v-list>

        <template v-if="entryIndex < groupedEntries.length - 1">
          <v-divider
            class="custom-margin-divider"
            :key="'divider-' + entryIndex"
          ></v-divider>
        </template>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import Vue from "vue";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import { GroupedOrderEntry } from "@/frontend-client";

@Component({
  components: {
    ErrorsComponent
  }
})
export default class UserOrders extends Vue {
  @Prop() groupedEntries!: GroupedOrderEntry[];
}
</script>

<style scoped>
.user-row {
  display: flex;
  flex-direction: row;
}

.username {
  flex-shrink: 0;
}

.sidedishes {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 50%;
}

.sidedishes .v-list {
  padding-top: 0;
}

.sidedishes .v-subheader {
  align-items: baseline;
  height: 1.25rem;
  padding-top: 2px;
}

.sidedishes .v-list-item {
  padding-top: 9px;
  padding-bottom: 9px;
}

.custom-margin-divider {
  margin-left: 16px;
  max-width: calc(100% - 16px);
}
</style>
