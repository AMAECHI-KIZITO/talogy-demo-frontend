import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipedriveReportComponent } from './pipedrive-report.component';

describe('PipedriveReportComponent', () => {
  let component: PipedriveReportComponent;
  let fixture: ComponentFixture<PipedriveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipedriveReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipedriveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
