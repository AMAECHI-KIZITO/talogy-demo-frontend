import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginButtonLoaderComponent } from './login-button-loader.component';

describe('LoginButtonLoaderComponent', () => {
  let component: LoginButtonLoaderComponent;
  let fixture: ComponentFixture<LoginButtonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginButtonLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginButtonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
