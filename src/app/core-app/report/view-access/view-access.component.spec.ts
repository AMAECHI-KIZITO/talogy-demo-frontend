import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccessComponent } from './view-access.component';

describe('ViewAccessComponent', () => {
  let component: ViewAccessComponent;
  let fixture: ComponentFixture<ViewAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
