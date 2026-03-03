import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntradayReportComponent } from './intraday-report.component';

describe('IntradayReportComponent', () => {
  let component: IntradayReportComponent;
  let fixture: ComponentFixture<IntradayReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntradayReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntradayReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
