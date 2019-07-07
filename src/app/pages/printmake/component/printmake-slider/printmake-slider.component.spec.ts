import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintmakeSliderComponent } from './printmake-slider.component';

describe('PrintmakeSliderComponent', () => {
  let component: PrintmakeSliderComponent;
  let fixture: ComponentFixture<PrintmakeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintmakeSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintmakeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
