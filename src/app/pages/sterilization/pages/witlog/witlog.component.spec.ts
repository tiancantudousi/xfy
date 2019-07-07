import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WitlogComponent } from './witlog.component';

describe('WitlogComponent', () => {
  let component: WitlogComponent;
  let fixture: ComponentFixture<WitlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WitlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WitlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
