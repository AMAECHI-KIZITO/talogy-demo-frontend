import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceConnectorComponent } from './advance-connector.component';

describe('AdvanceConnectorComponent', () => {
  let component: AdvanceConnectorComponent;
  let fixture: ComponentFixture<AdvanceConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
