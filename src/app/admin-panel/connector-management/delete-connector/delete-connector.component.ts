import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-delete-connector',
  templateUrl: './delete-connector.component.html',
  styleUrls: ['./delete-connector.component.scss']
})
export class DeleteConnectorComponent implements OnInit {

  loading: boolean = false
  error: boolean = false
  constructor(private fb: FormBuilder, private dialog: MatDialogRef<DeleteConnectorComponent>,
    @Inject(MAT_DIALOG_DATA) public item : any, private dialog1: MatDialog,
    private app: AppService) { }

  ngOnInit(): void {
   
  }

  connect() {
    this.loading = true
    this.app.productService.deleteConnectorListAdmin(this.item._id)
    .subscribe({
      next: (res) => {
        if(res['status'] === true) {
          this.loading = false
          this.dialog.close('deleted')
        }else{
          this.loading = false
          this.error = true
          this.errorDialog(res['message'])
        }
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.errorDialog(err)
      }
    })
  }

  errorDialog(item:any){
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }
  
  close(){
    this.dialog.close()
  }

}
