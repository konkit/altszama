import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderEntryService {

  constructor() { }

  setDishEntryCreating() {
    // this.$store.commit(`modifyOrderEntry/setDishEntryCreating`, {});
  }

  isModifiedEntryCreating(): boolean {
    // return this.$store.state.modifyOrderEntry.isEntryCreating;
    return false;
  }

  isModifiedEntryEdited(): boolean {
    // return this.$store.state.modifyOrderEntry.isEntryEdited;
    return false;
  }

  getModifiedDishEntryId(): string {
    // return this.$store.state.modifyOrderEntry.dishEntryId;
    return "0";
  }
}
