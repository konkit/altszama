import {Component, OnInit} from '@angular/core';
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../frontend-client";
import {Router} from "@angular/router";
import {EMPTY, filter, Observable, switchMap, take, tap} from "rxjs";
import {faAdd, faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {RestaurantFormService} from "./service/restaurant-form.service";
import {isNotNull} from "../../../lib/utils";
import {DialogService} from "../../../service/dialog.service";
import {RestaurantEditorState} from "./service/restaurant-editor-state";


@Component({
  selector: 'app-show-restaurant-view',
  templateUrl: './show-restaurant-view.component.html',
  styleUrls: ['./show-restaurant-view.component.scss']
})
export class ShowRestaurantViewComponent implements OnInit {

  restaurant$: Observable<ShowRestaurantResponse>

  restaurantState$: Observable<RestaurantEditorState>

  faPencil = faPencil;
  faTimes = faTimes;
  faAdd = faAdd;


  constructor(private restaurantControllerService: RestaurantControllerService,
              private router: Router,
              private restaurantFormService: RestaurantFormService,
              private dialogService: DialogService) {
    this.restaurant$ = this.restaurantFormService.restaurantData.asObservable().pipe(filter(isNotNull));
    this.restaurantState$ = this.restaurantFormService.editorStateSubject.asObservable()
  }

  ngOnInit() {

  }

  editRestaurant(restaurantId: string) {
    this.restaurantFormService.setRestaurantAsEdited(restaurantId)
  }

  deleteRestaurant() {
    this.dialogService.displayDeleteDialog("Are you sure you want to delete this restaurant?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.restaurant$.pipe(
              take(1),
              switchMap(payload => {
                let restaurantId = payload.restaurant.id;

                return this.restaurantControllerService.deleteRestaurant(restaurantId)
                  .pipe(tap(() => {
                    this.router.navigate(['/restaurants/'], {onSameUrlNavigation: "reload"})
                  }))
              })
            )
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe()
  }

  createDish(restaurantId: string) {
    this.restaurantFormService.setDishAsCreated(restaurantId)
  }
}
