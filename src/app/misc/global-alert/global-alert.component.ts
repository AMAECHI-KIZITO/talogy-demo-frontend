import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-global-alert',
  templateUrl: './global-alert.component.html',
  styleUrls: ['./global-alert.component.scss']
})
export class GlobalAlertComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();
  type: string = '';
  message: string = '';
  details: string = '';
  action: string | undefined;

  SUCCESS = 'SUCCESS';
  WARNING = 'WARNING';
  ERROR = 'ERROR';
  INFO = 'INFO';
  duration: number = 0;
  timer!: NodeJS.Timeout;

  constructor(private ui: UiService, private app: AppService) {
    this.ui.$alertStatus.pipe(takeUntil(this.unsubscribe))
      .subscribe(val => {
        this.type = val.type || '';
        this.message = val.message || '';
        this.details = val.details || '';
        this.action = val.action
        this.duration = val.duration || 0
        if(val.duration) this.setTimer()

        this.trackevent()
      })
  }

  ngOnInit(): void {

  }

  trackevent(){
    if(this.action == this.SUCCESS){
      window.analytics.track('success_alert', {
        username: this.app.helperService.getClientname(),
        datae_user_id: this.app.helperService.getActiveid(),
        plan_type: this.app.helperService.getTrial(),
        user_role: this.app.helperService.getRole(),
        organisation_name: this.app.helperService.getOrg(),
      });
    }else if (this.action == this.ERROR){
      window.analytics.track('failure_alert', {
        username: this.app.helperService.getClientname(),
        datae_user_id: this.app.helperService.getActiveid(),
        plan_type: this.app.helperService.getTrial(),
        user_role: this.app.helperService.getRole(),
        organisation_name: this.app.helperService.getOrg(),
      });
    }
  }

  actionClicked(){
    this.ui.clickAlertButton(this.action || '')
  }

  setTimer() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.ui.setAlertStatus({})
      clearTimeout(this.timer)
    }, this.duration);
  }

  close() {
    this.ui.setAlertStatus({})
  }
}
