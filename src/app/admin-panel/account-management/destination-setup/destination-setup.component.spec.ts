import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationSetupComponent } from './destination-setup.component';

describe('DestinationSetupComponent', () => {
  let component: DestinationSetupComponent;
  let fixture: ComponentFixture<DestinationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestinationSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
