import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfectPackageComponent } from './confect-package.component';

describe('ConfectPackageComponent', () => {
  let component: ConfectPackageComponent;
  let fixture: ComponentFixture<ConfectPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfectPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfectPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
