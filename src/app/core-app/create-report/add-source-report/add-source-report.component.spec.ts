import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSourceReportComponent } from './add-source-report.component';

describe('AddSourceReportComponent', () => {
  let component: AddSourceReportComponent;
  let fixture: ComponentFixture<AddSourceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSourceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSourceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
