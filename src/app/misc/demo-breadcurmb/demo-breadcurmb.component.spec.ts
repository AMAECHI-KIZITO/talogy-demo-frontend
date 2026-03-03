import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoBreadcurmbComponent } from './demo-breadcurmb.component';

describe('DemoBreadcurmbComponent', () => {
  let component: DemoBreadcurmbComponent;
  let fixture: ComponentFixture<DemoBreadcurmbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoBreadcurmbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoBreadcurmbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
