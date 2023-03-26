import { Component } from '@angular/core';
import {OrderHistoryCreatedEntry, OrderHistoryParticipatedEntry} from "../../../../frontend-client";

@Component({
  selector: 'app-balance-view',
  templateUrl: './balance-view.component.html',
  styleUrls: ['./balance-view.component.scss']
})
export class BalanceViewComponent {
  orderHistoryEntries: (OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry)[] = []
  owedMoneyEntries: [string, number][] = []

  isCreatedEntry(entry: OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry): entry is OrderHistoryCreatedEntry {
    return entry.kind == "createdEntry"
  }

  isParticipatedEntry(entry: OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry): entry is OrderHistoryParticipatedEntry {
    return entry.kind == "participatedEntry"
  }
}
