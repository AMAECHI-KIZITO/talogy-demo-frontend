import { Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-check-otp',
  templateUrl: './check-otp.component.html',
  styleUrls: ['./check-otp.component.scss']
})
export class CheckOtpComponent implements OnInit {

  otpValues: string[] = ['', '', '', '', '', ''];
  isOtp: boolean = true;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  buttonloading: boolean = false;
  errormsg: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public token: string, private app: AppService, private dialogref: MatDialogRef<CheckOtpComponent>) { }

  ngOnInit(): void {
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Only allow numeric input
    if (!/^\d$/.test(value)) {
      input.value = '';
      this.otpValues[index] = '';
      return;
    }

    this.otpValues[index] = value;
    this.otpValues.filter(e => e != '').length > 5 ? this.isOtp = false : this.isOtp = true

    // Move to the next input if available
    const inputsArray = this.otpInputs.toArray();
    if (index < inputsArray.length - 1) {
      inputsArray[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (input.value === '') {
        if (index > 0) {
          const prevInput = this.otpInputs.toArray()[index - 1].nativeElement;
          prevInput.focus();
          this.otpValues[index - 1] = '';
        }
      } else {
        this.otpValues[index] = '';
      }
    }
  }

  submitOTP() {
    this.buttonloading = true
    let load = {
      code: this.otpValues.join(''),
      token: this.token
    }
    this.errormsg = ''
    this.app.productService.verifyOTP(load).subscribe({
      next: res => {
        this.buttonloading = false
        this.dialogref.close(res.reportData)
      }, error: err => {
        this.buttonloading = false
        this.errormsg = err.error.message
        this.errorDialog(err.error.message)
      }
    })
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
