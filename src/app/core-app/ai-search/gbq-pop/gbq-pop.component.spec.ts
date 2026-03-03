import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GbqPopComponent } from './gbq-pop.component';

describe('GbqPopComponent', () => {
  let component: GbqPopComponent;
  let fixture: ComponentFixture<GbqPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GbqPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GbqPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
