import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { inviteUserPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InviteUserComponent>,
    private app: AppService
  ) {
    this.form = this.fb.group({
      inviteeName: ['', Validators.required],
      inviteeEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  submit() {
    this.loading = true;
    let payload = new inviteUserPayload();
    payload.inviteeName = this.form.value.inviteeName;
    payload.inviteeEmail = this.form.value.inviteeEmail;

    this.app.productService.inviteSuperUsers(payload)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false;
            this.dialogRef.close('invited');
          } else {
            this.loading = false;
            this.errorDialog(res['message']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorDialog(err);
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  errorDialog(item: any) {
    let alert: alertModal = {
      details: item,
      message: 'Invitation Failed',
      type: 'ERROR',
      duration: 10000
    };
    this.app.ui.setAlertStatus(alert);
  }
}
