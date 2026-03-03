import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustReportComponent } from './adjust-report.component';

describe('AdjustReportComponent', () => {
  let component: AdjustReportComponent;
  let fixture: ComponentFixture<AdjustReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
