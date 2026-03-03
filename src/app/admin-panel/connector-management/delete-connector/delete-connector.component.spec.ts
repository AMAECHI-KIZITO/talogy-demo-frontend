import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConnectorComponent } from './delete-connector.component';

describe('DeleteConnectorComponent', () => {
  let component: DeleteConnectorComponent;
  let fixture: ComponentFixture<DeleteConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
