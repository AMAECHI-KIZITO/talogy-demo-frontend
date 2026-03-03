import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-gbq-pop',
  templateUrl: './gbq-pop.component.html',
  styleUrls: ['./gbq-pop.component.scss']
})
export class GbqPopComponent implements OnInit {

  serviceToken: string = '';
  successmsg: string = '';
  loading: boolean = false;
  showSuccess: boolean = false;

  constructor(
    private app: AppService,
    private router: Router,
    private dialogref: MatDialogRef<GbqPopComponent>,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogref.close()
    this.router.navigateByUrl('/app/ai-search')
  }

  closeSuccess() {
    this.dialogref.close()
  }

  submit() {
    this.loading = true
    this.app.productService.listGBQDatasets(JSON.parse(this.serviceToken)).subscribe({
      next: (res: any) => {
        this.loading = false
        this.dialogref.close({datasets: res['datasets'], token: this.serviceToken})
      }, error: err => {
        this.loading = false
        console.log(err);
        this.errorDialog(err.message || 'Error getting templates')
      }
    })
  }

  successDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  errorDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }
}
