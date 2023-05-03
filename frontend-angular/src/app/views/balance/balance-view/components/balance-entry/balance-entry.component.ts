import {Component, Input} from '@angular/core';
import {OrderHistoryCreatedEntry, OrderHistoryParticipatedEntry} from "../../../../../../frontend-client";
import {Router} from "@angular/router";

@Component({
  selector: 'app-balance-entry',
  templateUrl: './balance-entry.component.html',
  styleUrls: ['./balance-entry.component.scss']
})
export class BalanceEntryComponent {

  @Input() historyEntry!: OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry

  constructor(private router: Router) {
  }

  goToOrder(orderId: string) {
    this.router.navigate(["/orders", orderId, "show"])
  }

  isCreatedEntry(entry: OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry): entry is OrderHistoryCreatedEntry {
    return entry.kind == "createdEntry"
  }

  isCreatedEntryPaid(entry: OrderHistoryCreatedEntry) {
    return entry.confirmedPaymentsTotalAmount >= entry.totalAmount
  }

  isParticipatedEntry(entry: OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry): entry is OrderHistoryParticipatedEntry {
    return entry.kind == "participatedEntry"
  }

  isParticipatedEntryPaid(entry: OrderHistoryParticipatedEntry) {
    return entry.status === OrderHistoryParticipatedEntry.StatusEnum.CONFIRMED
  }
}
