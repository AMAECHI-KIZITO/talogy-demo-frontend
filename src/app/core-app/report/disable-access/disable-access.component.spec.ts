import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableAccessComponent } from './disable-access.component';

describe('DisableAccessComponent', () => {
  let component: DisableAccessComponent;
  let fixture: ComponentFixture<DisableAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisableAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisableAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
