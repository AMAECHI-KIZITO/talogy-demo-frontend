import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorManagementComponent } from './connector-management.component';

describe('ConnectorManagementComponent', () => {
  let component: ConnectorManagementComponent;
  let fixture: ComponentFixture<ConnectorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
