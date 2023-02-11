import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-dish-confirm-modal',
  templateUrl: './delete-dish-confirm-modal.component.html',
  styleUrls: ['./delete-dish-confirm-modal.component.scss']
})
export class DeleteDishConfirmModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteDishConfirmModalComponent>) {
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
