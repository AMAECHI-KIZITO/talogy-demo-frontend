import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConnectorComponent } from './custom-connector.component';

describe('CustomConnectorComponent', () => {
  let component: CustomConnectorComponent;
  let fixture: ComponentFixture<CustomConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
