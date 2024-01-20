import {Component, OnInit} from '@angular/core';
import {
  BalanceControllerService,
  OrderHistoryCreatedEntry,
  OrderHistoryParticipatedEntry
} from "../../../../frontend-client";
import {Router} from "@angular/router";
import {PricePipe} from '../../../components/pipes/price.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {NgClass} from '@angular/common';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';

@Component({
    selector: 'app-balance-view',
    templateUrl: './balance-view.component.html',
    styleUrls: ['./balance-view.component.scss'],
    standalone: true,
    imports: [ViewWrapperComponent, MatListModule, NgClass, MatProgressSpinnerModule, PricePipe]
})
export class BalanceViewComponent implements OnInit {
  isLoading = true
  orderHistoryEntries: (OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry)[] = []
  owedMoneyEntries: [string, number][] = []

  constructor(private balanceControllerService: BalanceControllerService,
              private router: Router) {
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

  goToOrder(orderId: string) {
    this.router.navigate(["/orders", orderId, "show"])
  }

  isCreatedEntryPaid(entry: OrderHistoryCreatedEntry) {
    return entry.confirmedPaymentsTotalAmount >= entry.totalAmount
  }

  isParticipatedEntryPaid(entry: OrderHistoryParticipatedEntry) {
    return entry.status === OrderHistoryParticipatedEntry.StatusEnum.CONFIRMED
  }
}
