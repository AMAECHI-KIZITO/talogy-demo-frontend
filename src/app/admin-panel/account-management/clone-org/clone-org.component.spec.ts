import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneOrgComponent } from './clone-org.component';

describe('CloneOrgComponent', () => {
  let component: CloneOrgComponent;
  let fixture: ComponentFixture<CloneOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneOrgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
