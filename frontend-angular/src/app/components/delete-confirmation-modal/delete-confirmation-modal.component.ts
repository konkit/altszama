import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface DeleteConfirmationInput {
  content :string
}

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss']
})
export class DeleteConfirmationModalComponent {

  content: string = "Are you sure you want to delete?";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DeleteConfirmationInput,
    private dialogRef: MatDialogRef<DeleteConfirmationModalComponent>
  ) {
    this.content = data.content;
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
