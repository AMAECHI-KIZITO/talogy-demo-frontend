import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';


@Component({
  selector: 'app-demo-breadcurmb',
  templateUrl: './demo-breadcurmb.component.html',
  styleUrls: ['./demo-breadcurmb.component.scss']
})
export class DemoBreadcurmbComponent implements OnInit {

  breadCrumb$ = this.titleService.breadcrumbObs$
  
  constructor(
    private titleService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

}
