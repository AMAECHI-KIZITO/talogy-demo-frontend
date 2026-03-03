import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expiration-link',
  templateUrl: './expiration-link.component.html',
  styleUrls: ['./expiration-link.component.scss']
})
export class ExpirationLinkComponent implements OnInit {

  linkStatus: string = ''
  message: string = ''
  submessage: string = ''

  constructor(private route$: ActivatedRoute) {
    this.route$.queryParams.subscribe(res => {
      this.linkStatus = res['status']
    })
  }

  ngOnInit(): void {
    if(this.linkStatus == 'missing_token'){
      this.message = 'Token Missing';
      this.submessage = 'Seems you are using a broken link. Please retry from your email or get ask the link to be resent.'
    }else if(this.linkStatus == 'invalid_token'){
      this.message = "Link is Invalid"
      this.submessage = "Seems you are accessing an invalid link. Please ask for the link to be resent."
    }else if(this.linkStatus == 'expired_token'){
      this.message = 'Link expired'
      this.submessage = "Seems you are trying to access an expired link, please contact the sender to resend your report."
    }else{
      this.message = 'Link expired'
      this.submessage = "Seems you are trying to access an expired link, please contact the sender to resend your report."
    }
  }

}
