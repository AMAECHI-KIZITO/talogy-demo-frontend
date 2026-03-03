import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  itemList = [
    // {name: "Account", icon: "ph ph-user", value: "account", route: "accounts"},
    // {name: "Billing", icon: "ph ph-credit-card", value: "billing", route: "billings"},
    {name: "User", icon: "ph-bold ph-users", value: "user", route: "user"},
    // {name: "Audit", icon: "ph-bold ph-book-bookmark", value: "audit", route: "audit"},
    {name: "Group", icon: "ph-bold ph-users-three", value: "group", route: "group"},
  ]

  constructor(private breadcrumb: BreadcrumbService) {
    let history;
    this.breadcrumb.breadcrumbObs$.subscribe(
      (item) => {
        history = item
      }
    )
    this.breadcrumb.updateBreadcrumb({
      parent: 'Settings',
      parentLink: 'settings',
      children: []
    })
   }

  ngOnInit(): void {
  }

}
