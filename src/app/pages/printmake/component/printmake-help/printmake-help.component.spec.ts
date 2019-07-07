import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintmakeHelpComponent } from './printmake-help.component';

describe('PrintmakeHelpComponent', () => {
  let component: PrintmakeHelpComponent;
  let fixture: ComponentFixture<PrintmakeHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintmakeHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintmakeHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
