import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagentoGaReportComponent } from './magento-ga-report.component';

describe('MagentoGaReportComponent', () => {
  let component: MagentoGaReportComponent;
  let fixture: ComponentFixture<MagentoGaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagentoGaReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagentoGaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
