import { Injectable } from '@angular/core';
import {
  DeleteConfirmationModalComponent
} from "../components/delete-confirmation-modal/delete-confirmation-modal.component";
import {EMPTY, Observable, switchMap} from "rxjs";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  displayDeleteDialog(title: string, content: string): MatDialogRef<DeleteConfirmationModalComponent, boolean | null> {
    return this.dialog.open(DeleteConfirmationModalComponent, { width: '250px', data: { title: title, content: content } })
  }
}
