import {Component, OnInit} from '@angular/core';
import {
  BalanceControllerService,
  OrderHistoryCreatedEntry,
  OrderHistoryParticipatedEntry
} from "../../../../frontend-client";

@Component({
  selector: 'app-balance-view',
  templateUrl: './balance-view.component.html',
  styleUrls: ['./balance-view.component.scss']
})
export class BalanceViewComponent implements OnInit {
  isLoading = true
  orderHistoryEntries: (OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry)[] = []
  owedMoneyEntries: [string, number][] = []

  constructor(private balanceControllerService: BalanceControllerService) {
  }

  ngOnInit() {
    this.balanceControllerService.getBalanceForUser()
      .subscribe(response => {
        this.orderHistoryEntries = response.entries
        this.owedMoneyEntries = Object.entries(response.owedMoney)
        this.isLoading = false
      })
  }

  isCreatedEntry(entry: OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry): entry is OrderHistoryCreatedEntry {
    return entry.kind == "createdEntry"
  }

  isParticipatedEntry(entry: OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry): entry is OrderHistoryParticipatedEntry {
    return entry.kind == "participatedEntry"
  }
}
