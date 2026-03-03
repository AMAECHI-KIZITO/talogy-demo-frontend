import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent implements OnInit {

  // @Output() private create:EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  // createOperation(){
  //   this.create.emit()
  // }

}
