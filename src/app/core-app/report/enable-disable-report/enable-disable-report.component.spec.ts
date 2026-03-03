import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableDisableReportComponent } from './enable-disable-report.component';

describe('EnableDisableReportComponent', () => {
  let component: EnableDisableReportComponent;
  let fixture: ComponentFixture<EnableDisableReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableDisableReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnableDisableReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
