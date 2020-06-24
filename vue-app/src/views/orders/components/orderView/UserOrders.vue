<template>
  <div>
    <errors-component/>

    <v-list dense>
      <template v-for="(entry, entryIndex) in groupedEntries">
        <v-list-item :key="entryIndex">
          <v-list-item-content class="body-1">
            <span><b>{{entry.eatingPeopleCount}}x</b> {{entry.dish.name}}</span>
          </v-list-item-content>
        </v-list-item>

        <v-list dense class="px-8 no-y-padding" v-if="entry.eatingPeopleEntries.length > 0" :key="entryIndex">

          <template v-for="(eatingPersonEntry, i) in entry.eatingPeopleEntries">
            <v-list-item :key="i">
              <v-list-item-content>
                <div class="user-row">
                  <div class="username">
                    {{i + 1}}. {{ eatingPersonEntry.username }}
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

                        <template v-for="(sd, j) in eatingPersonEntry.sideDishes">
                          <v-list-item :key="j">
                            <v-list-item-content>
                              {{sd.name}}
                            </v-list-item-content>
                          </v-list-item>

                          <template v-if="j < eatingPersonEntry.sideDishes.length - 1">
                            <v-divider class="custom-margin-divider" :key="j"></v-divider>
                          </template>
                        </template>
                      </template>
                    </v-list>
                  </div>

                  <div class="comments mx-4">
                    <v-list class="comments-list">

                    </v-list>
                  </div>
                </div>


              </v-list-item-content>
            </v-list-item>

            <template v-if="i < entry.eatingPeopleEntries.length - 1">
              <v-divider class="custom-margin-divider"  :key="i"></v-divider>
            </template>

          </template>
        </v-list>

        <template v-if="entryIndex < groupedEntries.length - 1">
          <v-divider class="custom-margin-divider" :key="entryIndex"></v-divider>
        </template>
      </template>
    </v-list>
  </div>
</template>

<script>
  export default {
    props: ['groupedEntries'],
    name: "UserOrders"
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