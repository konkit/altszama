import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-restaurant-confirm-modal',
  templateUrl: './delete-restaurant-confirm-modal.component.html',
  styleUrls: ['./delete-restaurant-confirm-modal.component.scss']
})
export class DeleteRestaurantConfirmModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteRestaurantConfirmModalComponent>) {
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
