import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorecoverComponent } from './torecover.component';

describe('TorecoverComponent', () => {
  let component: TorecoverComponent;
  let fixture: ComponentFixture<TorecoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorecoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorecoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
