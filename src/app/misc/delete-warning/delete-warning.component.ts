import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Constants,} from 'src/app/helpers/messages';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.scss']
})
export class DeleteWarningComponent implements OnInit {
  loading: boolean = false;
  error: any;

  constructor(
    // @Inject(MAT_DIALOG_DATA) private id:any,
    // private app:DataService,
    private dialog:MatDialogRef<DeleteWarningComponent>) 
  { }

  ngOnInit(): void {

  }

  delete(){
    this.dialog.close(Constants.COMPLETED)
  }

  closeDialog(){
    this.dialog.close()
  }

}
