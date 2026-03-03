import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportTemplateComponent } from './add-report-template.component';

describe('AddReportTemplateComponent', () => {
  let component: AddReportTemplateComponent;
  let fixture: ComponentFixture<AddReportTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReportTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
