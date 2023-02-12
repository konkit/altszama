import {Component, OnInit} from '@angular/core';
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, Observable, switchMap, take, tap} from "rxjs";
import {faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import {NonNullableFormBuilder} from "@angular/forms";
import {RestaurantEditorState, RestaurantFormService} from "./service/restaurant-form.service";
import {isNotNull} from "../../../lib/utils";
import {MatDialog} from "@angular/material/dialog";
import {
  DeleteConfirmationModalComponent
} from "../../../components/delete-confirmation-modal/delete-confirmation-modal.component";


@Component({
  selector: 'app-show-restaurant-view',
  templateUrl: './show-restaurant-view.component.html',
  styleUrls: ['./show-restaurant-view.component.scss']
})
export class ShowRestaurantViewComponent implements OnInit {

  restaurant$: Observable<ShowRestaurantResponse>
  editedDishId$: Observable<string>;

  id: string

  faPencil = faPencil;
  faTimes = faTimes;

  restaurantState$: Observable<RestaurantEditorState>
  RestaurantEditorState = RestaurantEditorState

  restaurantEditFormGroup = this.fb.group({
    name: "",
    address: "",
    url: "",
    telephone: "",
  })

  constructor(private restaurantControllerService: RestaurantControllerService,
              private router: Router,
              private fb: NonNullableFormBuilder,
              private restaurantFormService: RestaurantFormService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.restaurant$ = this.restaurantFormService.showRestaurantResponse.asObservable().pipe(filter(isNotNull));
    this.restaurantState$ = this.restaurantFormService.editorStateSubject.asObservable()
    this.editedDishId$ = this.restaurantFormService.editedDishId.asObservable()
  }

  ngOnInit() {

  }

  editRestaurant() {
    this.restaurantControllerService.editRestaurant(this.id).subscribe(({id, ...value}) => {
      this.restaurantEditFormGroup.setValue(value)
      this.restaurantFormService.setEditorState(RestaurantEditorState.EDITING_RESTAURANT)
    })
  }

  submitEdit() {
    if (this.restaurantEditFormGroup.valid) {
      const formValue = this.restaurantEditFormGroup.getRawValue();

      this.restaurantControllerService.updateRestaurant({id: this.id, ...formValue})
        .pipe(tap(() => this.onRefresh())
      ).subscribe()
    }
  }

  cancelEdit() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
  }

  dateToRel(date?: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }

  onRefresh() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
    let id = this.route.snapshot.paramMap.get('id');
    this.restaurantFormService.loadRestaurant(id!)
  }

  onRestaurantDelete() {
    this.dialog.open(DeleteConfirmationModalComponent, {
      width: '250px',
      data: {
        content: "Are you sure you want to delete this restaurant?"
      }
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.restaurant$.pipe(
          take(1),
          switchMap(payload => {
            let restaurantId = payload.restaurant.id;

            return this.restaurantControllerService.deleteRestaurant(restaurantId)
              .pipe(tap(() => {
                this.router.navigate(['/restaurants/'], {onSameUrlNavigation: "reload"})
              }))
          })
        ).subscribe()
      }
    });
  }
}
