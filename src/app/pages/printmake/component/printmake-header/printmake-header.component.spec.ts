import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintmakeHeaderComponent } from './printmake-header.component';

describe('PrintmakeHeaderComponent', () => {
  let component: PrintmakeHeaderComponent;
  let fixture: ComponentFixture<PrintmakeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintmakeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintmakeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
