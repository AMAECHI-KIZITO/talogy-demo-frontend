import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { MessageUtil } from 'src/app/helpers/messages';
import { payPayload, upgradePayload } from 'src/app/model/productModel';
import { ReceiptComponent } from './receipt/receipt.component';
import { ActivatedRoute } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  useremail = this.app.helperService.getEmail();

  plan = [
    {
      name: 'Basic',
      amount: '$99',
      active: false,
      info: ['2 user Accounts', '25 Connectors'],
    },
    {
      name: 'Premium',
      amount: '$159',
      active: true,
      info: ['5 User Accounts', '50 Connectors', 'AI Chat'],
    },
    {
      name: 'Super',
      amount: '$199',
      active: false,
      info: ['10 User Accounts', '100 Connectors', 'AI Chat', 'Weekly Updates'],
    },
  ];
  planLoading: boolean = false;
  planError: boolean = false;
  planList: any;

  activeDays: any;

  payLoading: boolean = false;
  payError: boolean = false;
  authparam: any;

  upgradeLoading: boolean = false;
  upgradeError: boolean = false;

  activePlan: any;

  mode = 'monthly';

  info = ['10 User Accounts', '100 Connectors', 'AI Chat', 'Weekly Updates'];

  setId: any;
  constructor(
    private app: AppService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {

      this.authparam = params['status'];
      if (this.authparam === 'success') {
        this.successDialog(this.authparam)
      } else if (this.authparam === 'failed') {
        this.errorDialog(this.authparam);
      } else {
        ('');
      }
    });
  }

  ngOnInit(): void {
    this.getPlan();
  }

  getPlan() {
    this.planLoading = true;
    let user = this.app.helperService.getActiveid();

    this.app.productService.getPlan().subscribe({
      next: (res) => {
        if (res['status']) {
          this.getActiveDays();
          this.planList = res['plans'];
          this.planList.forEach((element: any) => {
            if (element.isMonthlyPlanActive || element.isYearlyPlanActive) {
              this.activePlan = element;
            }
          });
        } else {
          this.planLoading = false;
          this.planError = true;
          this.planList = [];
          this.activePlan = 'Free Plan';
        }
      },
      error: (err) => {
        this.planLoading = false;
        this.planList = [];
        this.planError = true;
        this.activePlan = 'Free Plan';
      },
    });
  }

  upgrade(item: any) {
    window.analytics.track('button_clicked', {
      button_name: 'upgrade_plan',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
    this.setId = item.subId;
    this.upgradeLoading = true;
    let payload = new upgradePayload();
    payload.paymentPlan = this.mode;
    payload.newSubChoice = item.subId;
    payload.userId = this.app.helperService.getActiveid();

    this.app.productService.upgradePlan(payload).subscribe({
      next: (res) => {
        if (res['status']) {
          this.upgradeLoading = false;
          window.open(res['url'], '_self');
        } else {
          this.upgradeLoading = false;
          this.upgradeError = true;
          this.errorDialog(res['message']);
        }
      },
      error: (err) => {
        this.upgradeLoading = false;
        this.upgradeError = true;
        this.errorDialog(err);
      },
    });
  }

  getActiveDays() {
    this.app.productService.getActivedays().subscribe({
      next: (res) => {
        if (res['status']) {
          this.planLoading = false;
          this.activeDays = res['daysLeft'];
        } else {
          this.planLoading = false;
          this.planError = true;
          this.planList = 0;
        }
      },
      error: (err) => {
        this.planLoading = false;
        this.planList = 0;
        this.planError = true;
      },
    });
  }

  changeMode(item: any) {
    this.mode = item;
  }

  postPay(item: any) {
    window.analytics.track('button_clicked', {
      button_name: 'select_plan',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });
    this.setId = item.subId;
    this.payLoading = true;
    let payload = new payPayload();
    payload.paymentPlan = this.mode;
    payload.subscriptionChoice = item.subId;
    payload.userId = this.app.helperService.getActiveid();

    this.app.productService.pay(payload).subscribe({
      next: (res) => {
        if (res['status']) {
          this.payLoading = false;
          window.open(res['url'], '_self');
        } else {
          this.payLoading = false;
          this.payError = true;
          this.errorDialog(res['message']);
        }
      },
      error: (err) => {
        this.payLoading = false;
        this.payError = true;
        this.errorDialog(err);
      },
    });
  }

  reciptDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '30%';
    this.dialog
      .open(ReceiptComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        // if (res) {
        // }
      });
  }

  contactUs(item: any) {
    window.analytics.track('button_clicked', {
      button_name: 'contact_us',
      username: this.app.helperService.getClientname(),
      datae_user_id: this.app.helperService.getActiveid(),
      company_plan: this.app.helperService.getTrial(),
      user_title: this.app.helperService.getRole(),
      company_name: this.app.helperService.getOrg(),
    });

    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.height = 'auto';
    dialogConfig.width = '40%';
    dialogConfig.data = item;
    this.dialog
      .open(ContactUsComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        // if (res) {
        // }
      });
  }

  successDialog(item: any){
    let alert: alertModal = {
      details: item,
      message: 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
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
}
