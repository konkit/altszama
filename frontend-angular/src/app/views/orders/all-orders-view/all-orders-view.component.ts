import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ViewWrapperComponent } from '../../../components/view-wrapper/view-wrapper.component';
import { ChipComponent, ChipTone } from '../../../components/chip/chip.component';
import { AllOrdersOrderDto, AllOrdersResponse } from '../../../../frontend-client';
import { orderStateToCaption, orderStateToTone } from '../lib/orderState';
import { formatOrderDate } from '../lib/orderDate';
import OrderStateEnum = AllOrdersOrderDto.OrderStateEnum;

interface OrdersFilter {
  search: string
  onlyMine: boolean
}

@Component({
  selector: 'app-all-orders-view',
  imports: [
    ViewWrapperComponent,
    ChipComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './all-orders-view.component.html',
  styleUrl: './all-orders-view.component.scss',
  standalone: true
})
export class AllOrdersViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['orderDate', 'restaurantName', 'orderState', 'orderCreatorUsername'];

  dataSource = new MatTableDataSource<AllOrdersOrderDto>();
  // Current page after filtering and sorting, used by the phone layout
  visibleRows$ = this.dataSource.connect();

  hasAnyOrders = false
  filter: OrdersFilter = {search: "", onlyMine: false}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.dataSource.filterPredicate = (order, filterJson) => this.matchesFilter(order, JSON.parse(filterJson))
    this.dataSource.sortingDataAccessor = (order, column) => {
      switch (column) {
        case 'orderState': return orderStateToCaption(order.orderState)
        default: return (order as any)[column] ?? ""
      }
    }

    this.route.data.pipe(take(1)).subscribe(data => {
      const response: AllOrdersResponse = data['response']
      this.dataSource.data = response.allOrdersList
      this.hasAnyOrders = response.allOrdersList.length > 0
    })
    this.applyFilter()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchChanged(event: Event) {
    this.filter = {...this.filter, search: (event.target as HTMLInputElement).value}
    this.applyFilter()
  }

  clearSearch() {
    this.filter = {...this.filter, search: ""}
    this.applyFilter()
  }

  scopeChanged(event: MatButtonToggleChange) {
    this.filter = {...this.filter, onlyMine: event.value === 'mine'}
    this.applyFilter()
  }

  private applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filter)
    this.paginator?.firstPage()
  }

  private matchesFilter(order: AllOrdersOrderDto, filter: OrdersFilter): boolean {
    if (filter.onlyMine && !this.isMine(order)) {
      return false
    }
    const search = filter.search.trim().toLowerCase()
    return search === ""
      || order.restaurantName.toLowerCase().includes(search)
      || order.orderCreatorUsername.toLowerCase().includes(search)
  }

  isMine(order: AllOrdersOrderDto): boolean {
    return order.createdByCurrentUser === true || order.currentUserParticipates === true
  }

  creatorLabel(order: AllOrdersOrderDto): string {
    return order.createdByCurrentUser ? "you" : order.orderCreatorUsername
  }

  formatDate(isoDate: string): string {
    return formatOrderDate(isoDate)
  }

  getOrderStateString(orderState: OrderStateEnum): string {
    return orderStateToCaption(orderState)
  }

  getOrderStateTone(orderState: OrderStateEnum): ChipTone {
    return orderStateToTone(orderState)
  }

  goToCreateOrder() {
    return this.router.navigate(["/orders/create"])
  }
}
