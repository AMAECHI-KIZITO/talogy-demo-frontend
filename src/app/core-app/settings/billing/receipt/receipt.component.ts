import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  constructor(private dialog: MatDialogRef<ReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow: any,) { }

  ngOnInit(): void {
  }

  close() {
    this.dialog.close();
  }

}
