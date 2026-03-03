import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicConnectorComponent } from './basic-connector.component';

describe('BasicConnectorComponent', () => {
  let component: BasicConnectorComponent;
  let fixture: ComponentFixture<BasicConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
