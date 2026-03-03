import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-invite-external-user',
  templateUrl: './invite-external-user.component.html',
  styleUrls: ['./invite-external-user.component.scss']
})
export class InviteExternalUserComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InviteExternalUserComponent>,
    @Inject(MAT_DIALOG_DATA) public report: any,
    private app: AppService
  ) {
    this.form = this.fb.group({
      inviteeName: ['', Validators.required],
      inviteeEmail: ['', [Validators.required, Validators.email]],
      durationInDays: ['']
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const payload: any = {
      inviteeName: this.form.value.inviteeName,
      inviteeEmail: this.form.value.inviteeEmail,
      reportId: this.report._id
    };

    if (this.form.value.durationInDays) {
      payload.durationInDays = this.form.value.durationInDays;
    }

    this.app.productService.superadminInviteExternalUserToReport(payload)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res['status'] === true) {
            this.showAlert('Invitation sent successfully', 'SUCCESS');
            this.dialogRef.close('invited');
          } else {
            this.showAlert(res['message'] || 'Invitation failed', 'ERROR');
          }
        },
        error: (err) => {
          this.loading = false;
          this.showAlert(err?.message || 'An error occurred', 'ERROR');
        }
      });
  }

  showAlert(message: string, type: 'SUCCESS' | 'ERROR') {
    let alert: alertModal = {
      details: message,
      message: type === 'SUCCESS' ? 'Invitation Sent' : 'Invitation Failed',
      type,
      duration: 8000
    };
    this.app.ui.setAlertStatus(alert);
  }

  close() {
    this.dialogRef.close();
  }
}
