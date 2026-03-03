import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWorkflowComponent } from './report-workflow.component';

describe('ReportWorkflowComponent', () => {
  let component: ReportWorkflowComponent;
  let fixture: ComponentFixture<ReportWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportWorkflowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
