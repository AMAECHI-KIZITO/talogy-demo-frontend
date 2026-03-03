import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss']
})
export class ErrorStateComponent implements OnInit {

  @Output() retry:EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  tryOperation(){
    this.retry.emit()
  }

}
