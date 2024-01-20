import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';

export interface DeleteConfirmationInput {
  title: string
  content :string
}

@Component({
    selector: 'app-delete-confirmation-modal',
    templateUrl: './delete-confirmation-modal.component.html',
    styleUrls: ['./delete-confirmation-modal.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose]
})
export class DeleteConfirmationModalComponent {

  title: string = "Confirm delete";
  content: string = "Are you sure you want to delete?";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DeleteConfirmationInput,
    private dialogRef: MatDialogRef<DeleteConfirmationModalComponent>
  ) {
    this.title = data.title;
    this.content = data.content;
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
