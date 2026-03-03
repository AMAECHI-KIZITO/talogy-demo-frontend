import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faSlash } from '@fortawesome/free-solid-svg-icons';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  name = this.app.helperService.getClientname()
  username = this.app.helperService.getEmail()
  form: FormGroup
  loading: boolean = false
  accountDetail: any;
  errorList: boolean = false

  constructor(private app : AppService, private fb: FormBuilder) { 
    this.form = this.fb.group({
      'fname': ['', Validators.required],
      'organization': ['', Validators.required],
      'email': ['', Validators.required],
      'account': ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAccount()
  }

  getAccount(){
    this.loading = true
    let user = this.app.helperService.getActiveid()

    this.app.productService.getAccountDetails(user)
    .subscribe({
      next: (res) => {
        if(res['status']){
          this.loading = false
          this.accountDetail = res['userRecord']
          this.form = this.fb.group({
            'fname': [this.name, Validators.required],
            'organization': [this.accountDetail.organization, Validators.required],
            'email': [this.accountDetail.useremail, Validators.required],
            'account': [this.accountDetail.method, Validators.required],
          });
        }else{
          this.loading = false
          this.errorList = true
          this.accountDetail = null
        }
      },
      error: (err) => {
        this.loading = false
        this.accountDetail = null
        this.errorList = true
      }
    })
  }

  getInitials(string:any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

}
