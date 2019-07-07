import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashcheckComponent } from './washcheck.component';

describe('WashcheckComponent', () => {
  let component: WashcheckComponent;
  let fixture: ComponentFixture<WashcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
