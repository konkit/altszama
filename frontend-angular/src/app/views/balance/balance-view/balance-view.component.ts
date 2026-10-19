import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {PricePipe} from '../../../components/pipes/price.pipe';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {ChipComponent, ChipTone} from '../../../components/chip/chip.component';
import {formatOrderDate} from '../../orders/lib/orderDate';
import {
  BalanceControllerService,
  OrderHistory,
  OrderHistoryCreatedEntry,
  OrderHistoryParticipatedEntry,
  OwedMoneyEntry
} from '../../../../frontend-client';

type HistoryEntry = OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry

const HISTORY_PAGE_SIZE = 10

@Component({
  selector: 'app-balance-view',
  imports: [
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    PricePipe,
    ViewWrapperComponent,
    ChipComponent,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './balance-view.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './balance-view.component.scss'
})
export class BalanceViewComponent implements OnInit {
  isLoading = true
  hasError = false

  owedToYou: OwedMoneyEntry[] = []
  youOwe: OwedMoneyEntry[] = []
  netAmount = 0

  historyEntries: HistoryEntry[] = []
  visibleHistoryCount = HISTORY_PAGE_SIZE

  constructor(private balanceControllerService: BalanceControllerService) {
  }

  ngOnInit() {
    this.load()
  }

  load() {
    this.isLoading = true
    this.hasError = false
    this.balanceControllerService.getBalanceForUser()
      .subscribe({
        next: response => {
          this.setOwedMoney(this.owedMoneyEntries(response))
          this.historyEntries = this.unsettledFirst(response.entries as HistoryEntry[])
          this.visibleHistoryCount = HISTORY_PAGE_SIZE
          this.isLoading = false
        },
        error: () => {
          this.hasError = true
          this.isLoading = false
        }
      })
  }

  // Older backends only send the username-keyed map
  private owedMoneyEntries(response: OrderHistory): OwedMoneyEntry[] {
    if (response.owedMoneyByUser) {
      return response.owedMoneyByUser
    }
    return Object.entries(response.owedMoney)
      .map(([username, amount]) => ({userId: username, username, amount}))
  }

  private setOwedMoney(entries: OwedMoneyEntry[]) {
    this.owedToYou = entries.filter(e => e.amount > 0).sort((a, b) => b.amount - a.amount)
    this.youOwe = entries.filter(e => e.amount < 0).sort((a, b) => a.amount - b.amount)
    this.netAmount = entries.reduce((sum, e) => sum + e.amount, 0)
  }

  // Keeps the backend's newest-first order within each group
  private unsettledFirst(entries: HistoryEntry[]): HistoryEntry[] {
    return [...entries.filter(e => !this.isSettled(e)), ...entries.filter(e => this.isSettled(e))]
  }

  get visibleHistoryEntries(): HistoryEntry[] {
    return this.historyEntries.slice(0, this.visibleHistoryCount)
  }

  showMoreHistory() {
    this.visibleHistoryCount += HISTORY_PAGE_SIZE
  }

  isCreatedEntry(entry: HistoryEntry): entry is OrderHistoryCreatedEntry {
    return entry.kind == "createdEntry"
  }

  isParticipatedEntry(entry: HistoryEntry): entry is OrderHistoryParticipatedEntry {
    return entry.kind == "participatedEntry"
  }

  isSettled(entry: HistoryEntry): boolean {
    if (this.isCreatedEntry(entry)) {
      return entry.confirmedPaymentsTotalAmount >= entry.totalAmount
    }
    return (entry as OrderHistoryParticipatedEntry).status === OrderHistoryParticipatedEntry.StatusEnum.Confirmed
  }

  statusCaption(entry: HistoryEntry): string {
    if (this.isCreatedEntry(entry)) {
      return this.isSettled(entry) ? "Settled" : "Collecting"
    }
    return this.isSettled(entry) ? "Paid" : "Unpaid"
  }

  statusTone(entry: HistoryEntry): ChipTone {
    return this.isSettled(entry) ? "success" : "warning"
  }

  formatDate(isoDate: string): string {
    return formatOrderDate(isoDate)
  }

  abs(amount: number): number {
    return Math.abs(amount)
  }
}
