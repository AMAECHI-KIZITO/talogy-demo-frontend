import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageModeComponent } from './manage-mode.component';

describe('ManageModeComponent', () => {
  let component: ManageModeComponent;
  let fixture: ComponentFixture<ManageModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageModeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
