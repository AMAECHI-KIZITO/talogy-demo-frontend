import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state-create',
  templateUrl: './empty-state-create.component.html',
  styleUrls: ['./empty-state-create.component.scss']
})
export class EmptyStateCreateComponent implements OnInit {

  @Output() private create:EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  createOperation(){
    this.create.emit()
  }

}
