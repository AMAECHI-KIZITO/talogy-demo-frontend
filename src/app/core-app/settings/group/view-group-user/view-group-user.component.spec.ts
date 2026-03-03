import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupUserComponent } from './view-group-user.component';

describe('ViewGroupUserComponent', () => {
  let component: ViewGroupUserComponent;
  let fixture: ComponentFixture<ViewGroupUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGroupUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
