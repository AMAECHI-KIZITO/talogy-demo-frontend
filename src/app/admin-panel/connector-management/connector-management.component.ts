import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-connector-management',
  templateUrl: './connector-management.component.html',
  styleUrls: ['./connector-management.component.scss'],
})
export class ConnectorManagementComponent implements OnInit {

  constructor(private app: AppService) {}

  ngOnInit(): void {
    
  }

}
