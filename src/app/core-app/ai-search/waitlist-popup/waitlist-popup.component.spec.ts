import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitlistPopupComponent } from './waitlist-popup.component';

describe('WaitlistPopupComponent', () => {
  let component: WaitlistPopupComponent;
  let fixture: ComponentFixture<WaitlistPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitlistPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitlistPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
