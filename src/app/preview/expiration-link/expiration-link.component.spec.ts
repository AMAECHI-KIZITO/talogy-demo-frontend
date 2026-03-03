import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirationLinkComponent } from './expiration-link.component';

describe('ExpirationLinkComponent', () => {
  let component: ExpirationLinkComponent;
  let fixture: ComponentFixture<ExpirationLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpirationLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
