import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PowerbiDisplayComponent } from '../powerbi-display.component';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit {
  timer: number = 0;
  timerComplete: boolean = false;

  constructor(private dialogref: MatDialogRef<FullscreenComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private app: AppService) { 
    this.app.timertoken$.subscribe(timer => {
      if(timer >= 0) this.timer = timer      
    })

    this.app.reportConfig$.subscribe(config => {
      if(config){
        this.data.reportConfig = config
        if(config){
          this.timerComplete = true
          setTimeout(() => {
            this.timerComplete = false
          }, 500);
        }
      }
    })
  }

  ngOnInit(): void {
  }

  close(){
    this.dialogref.close()
  }
}