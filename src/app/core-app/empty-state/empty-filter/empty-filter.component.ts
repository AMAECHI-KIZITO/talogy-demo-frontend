import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empty-filter',
  templateUrl: './empty-filter.component.html',
  styleUrls: ['./empty-filter.component.scss']
})
export class EmptyFilterComponent implements OnInit {


  @Output() private create: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  createOperation() {
    this.create.emit()
  }
}
