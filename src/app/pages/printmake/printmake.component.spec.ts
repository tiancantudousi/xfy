import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintmakeComponent } from './printmake.component';

describe('PrintmakeComponent', () => {
  let component: PrintmakeComponent;
  let fixture: ComponentFixture<PrintmakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintmakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintmakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
