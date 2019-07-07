import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WlbComponent } from './wlb.component';

describe('WitlogComponent', () => {
  let component: WlbComponent;
  let fixture: ComponentFixture<WlbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WlbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WlbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
