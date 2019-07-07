import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashSliderComponent } from './wash-slider.component';

describe('WashSliderComponent', () => {
  let component: WashSliderComponent;
  let fixture: ComponentFixture<WashSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
