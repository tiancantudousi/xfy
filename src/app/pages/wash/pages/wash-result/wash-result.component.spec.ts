import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashResultComponent } from './wash-result.component';

describe('WashResultComponent', () => {
  let component: WashResultComponent;
  let fixture: ComponentFixture<WashResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
