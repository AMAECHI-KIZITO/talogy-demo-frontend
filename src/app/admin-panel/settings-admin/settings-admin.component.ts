import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-admin',
  templateUrl: './settings-admin.component.html',
  styleUrls: ['./settings-admin.component.scss']
})
export class SettingsAdminComponent implements OnInit {

  itemList = [
    {name: "Report Config", icon: "ph ph-user", value: "report", route: "report-config"},
    {name: "Catalog", icon: "ph ph-user", value: "catalog", route: "catalog"}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
