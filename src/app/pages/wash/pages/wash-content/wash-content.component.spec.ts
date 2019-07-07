import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashContentComponent } from './wash-content.component';

describe('WashContentComponent', () => {
  let component: WashContentComponent;
  let fixture: ComponentFixture<WashContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
