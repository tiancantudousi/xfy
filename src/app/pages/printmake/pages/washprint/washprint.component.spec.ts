import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashprintComponent } from './washprint.component';

describe('WashprintComponent', () => {
  let component: WashprintComponent;
  let fixture: ComponentFixture<WashprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
