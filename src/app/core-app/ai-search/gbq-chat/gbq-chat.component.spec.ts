import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GbqChatComponent } from './gbq-chat.component';

describe('GbqChatComponent', () => {
  let component: GbqChatComponent;
  let fixture: ComponentFixture<GbqChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GbqChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GbqChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
