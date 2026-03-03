import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-waitlist-popup',
  templateUrl: './waitlist-popup.component.html',
  styleUrls: ['./waitlist-popup.component.scss']
})
export class WaitlistPopupComponent implements OnInit {

  check: boolean = false
  constructor(private dialog: MatDialogRef<WaitlistPopupComponent>) { }

  ngOnInit(): void {
  }

  join(){
    this.check = true
  }

  close(){
    this.dialog.close()
  }

}
