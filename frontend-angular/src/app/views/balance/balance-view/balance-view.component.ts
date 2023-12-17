import {Component, OnInit} from '@angular/core';
import {BalanceControllerService,} from "../../../../frontend-client";

@Component({
  selector: 'app-balance-view',
  templateUrl: './balance-view.component.html',
  styleUrls: ['./balance-view.component.scss']
})
export class BalanceViewComponent implements OnInit {
  isLoading = true
  owedMoneyEntries: [string, number][] = []

  constructor(private balanceControllerService: BalanceControllerService) {
  }

  ngOnInit() {
    this.balanceControllerService.getBalanceForUser()
      .subscribe(response => {
        this.owedMoneyEntries = Object.entries(response.owedMoney)
        this.isLoading = false
      })
  }
}
