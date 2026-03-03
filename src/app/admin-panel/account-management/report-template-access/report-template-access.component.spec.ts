import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTemplateAccessComponent } from './report-template-access.component';

describe('ReportTemplateAccessComponent', () => {
  let component: ReportTemplateAccessComponent;
  let fixture: ComponentFixture<ReportTemplateAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTemplateAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTemplateAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
